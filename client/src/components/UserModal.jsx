import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/client';
import { useAuth } from '../context/AuthContext';
import PasswordInput from './PasswordInput';
import FieldError from './FieldError';
import { validators } from '../utils/validators';

export default function UserModal({ user, onClose, onSaved }) {
  const { user: me } = useAuth();
  const editing = !!user;
  const isManager = me.role === 'manager';
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'employee',
    phone: user?.phone || '',
    department: user?.department || '',
    isActive: user?.isActive ?? true,
  });

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: '' });
  };

  const validate = () => {
    const next = {};
    next.name = validators.name(form.name);
    next.email = validators.email(form.email);
    if (!editing || form.password) next.password = validators.password(form.password);
    next.phone = validators.phone(form.phone);
    next.department = validators.department(form.department);
    setErrors(next);
    return Object.values(next).every((m) => !m);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    if (!editing) delete payload.isActive;
    if (editing && isManager) delete payload.role;
    try {
      if (editing) await api.put(`/users/${user._id}`, payload);
      else await api.post('/users', payload);
      toast.success(editing ? 'User updated' : 'User created');
      onSaved();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-overlay fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <form onSubmit={submit} noValidate className="animate-modal card w-full max-w-lg p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? 'Edit user' : 'Add new user'}</h3>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input className="input" required value={form.name} onChange={set('name')} placeholder="e.g. Ayesha Khan" />
            <FieldError message={errors.name} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="name@company.com" />
            <FieldError message={errors.email} />
          </div>
          <div>
            <label className="label">{editing ? 'New password (optional)' : 'Password'}</label>
            <PasswordInput required={!editing} value={form.password} onChange={set('password')} placeholder="Min 8 chars, letter + number" autoComplete="new-password" />
            <FieldError message={errors.password} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={set('role')} disabled={isManager}>
              <option value="employee">Employee</option>
              {!isManager && <option value="manager">Manager</option>}
              {!isManager && <option value="admin">Admin</option>}
            </select>
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" type="tel" value={form.phone} onChange={set('phone')} placeholder="e.g. +92 300 1234567" />
            <FieldError message={errors.phone} />
          </div>
          <div>
            <label className="label">Department</label>
            <input className="input" value={form.department} onChange={set('department')} placeholder="e.g. Human Resources" />
            <FieldError message={errors.department} />
          </div>
        </div>

        {editing && (
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} className="h-4 w-4 rounded border-slate-300" />
            Account is active
          </label>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create user'}</button>
        </div>
      </form>
    </div>
  );
}