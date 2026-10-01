import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/client';
import { useAuth } from '../context/AuthContext';
import UserModal from '../components/UserModal';
import ConfirmModal from '../components/ConfirmModal';
import { RoleBadge, StatusBadge } from '../components/Badges';
import { TableSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { avatarColor } from '../utils/avatarColor';

export default function Users() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, user: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setQ(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', {
        params: { page, limit: 10, search: q || undefined, role: role || undefined, isActive: status || undefined },
      });
      setRows(data.data);
      setMeta(data.meta);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [page, q, role, status]);

  useEffect(() => { load(); }, [load]);

  const canEdit = (u) => u._id !== me._id && (me.role === 'admin' || u.role === 'employee');
  const hasFilters = search || role || status;

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/users/${toDelete._id}`);
      toast.success('User deleted');
      setToDelete(null);
      if (rows.length === 1 && page > 1) setPage(page - 1); else load();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 animate-rise">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
            <UsersIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Users</h1>
            <p className="text-base text-slate-500 dark:text-slate-400">{meta.total} member{meta.total === 1 ? '' : 's'} in your company</p>
          </div>
        </div>
        <button className="btn-primary !px-5 !py-2.5 !text-base" onClick={() => setModal({ open: true, user: null })}>
          <Plus className="h-5 w-5" /> Add user
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 animate-rise">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input className="input !pl-11" placeholder="Search name, email, department" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input !w-44" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option><option value="admin">Admin</option><option value="manager">Manager</option><option value="employee">Employee</option>
        </select>
        <select className="input !w-44" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All status</option><option value="true">Active</option><option value="false">Inactive</option>
        </select>
      </div>

      <div className="card animate-rise overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">User</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Department</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <TableSkeleton />
              ) : rows.length === 0 ? (
                <tr><td colSpan={5}>
                  <EmptyState icon={UsersIcon} title={hasFilters ? 'No users match your filters' : 'No users yet'} message={hasFilters ? 'Try adjusting your search or filters.' : 'Add your first team member to get started.'} />
                </td></tr>
              ) : rows.map((u, idx) => {
                const av = avatarColor(u.name);
                return (
                  <tr key={u._id} className={`transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${idx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-900/40' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-full text-base font-semibold ${av.bg} ${av.text}`}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-900 dark:text-white">
                            {u.name}{u._id === me._id && <span className="ml-2 text-sm font-normal text-slate-400">(you)</span>}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                    <td className="px-6 py-4 text-base text-slate-600 dark:text-slate-300">{u.department || '-'}</td>
                    <td className="px-6 py-4"><StatusBadge active={u.isActive} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        {canEdit(u) && (
                          <button title="Edit" className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800" onClick={() => setModal({ open: true, user: u })}>
                            <Pencil className="h-4.5 w-4.5" />
                          </button>
                        )}
                        {canEdit(u) && (
                          <button title="Delete" className="rounded-lg p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10" onClick={() => setToDelete(u)}>
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-base text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>Page {page} of {meta.totalPages}</span>
          <div className="flex gap-2">
            <button className="btn-secondary !h-10 !w-10 !p-0" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-5 w-5" /></button>
            <button className="btn-secondary !h-10 !w-10 !p-0" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>

      {modal.open && <UserModal user={modal.user} onClose={() => setModal({ open: false, user: null })} onSaved={() => { setModal({ open: false, user: null }); load(); }} />}
      {toDelete && <ConfirmModal title="Delete user?" message={`${toDelete.name} will lose access immediately.`} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} busy={deleting} />}
    </div>
  );
}