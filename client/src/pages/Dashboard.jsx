import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, UserCheck, UserX, ShieldCheck, Mail, Phone, Briefcase } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton } from '../components/Skeleton';
import { RoleBadge } from '../components/Badges';
import { avatarColor } from '../utils/avatarColor';

const COLORS = ['#6366f1', '#0ea5e9', '#94a3b8'];

export default function Dashboard() {
  const { user, company } = useAuth();
  const [stats, setStats] = useState(null);
  const isStaff = user.role === 'admin' || user.role === 'manager';

  useEffect(() => {
    if (!isStaff) return; // employees can't call /users, skip the fetch entirely
    api.get('/users', { params: { limit: 100 } }).then(({ data }) => {
      const rows = data.data;
      const roleCount = { admin: 0, manager: 0, employee: 0 };
      let active = 0;
      rows.forEach((r) => { roleCount[r.role]++; if (r.isActive) active++; });
      setStats({ total: data.meta.total, active, inactive: data.meta.total - active, roleCount });
    });
  }, [isStaff]);

  const cards = stats && [
    { label: 'Total members', value: stats.total, icon: Users, tint: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
    { label: 'Active', value: stats.active, icon: UserCheck, tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { label: 'Inactive', value: stats.inactive, icon: UserX, tint: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' },
    { label: 'Admins', value: stats.roleCount.admin, icon: ShieldCheck, tint: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400' },
  ];

  const pieData = stats && [
    { name: 'Admin', value: stats.roleCount.admin },
    { name: 'Manager', value: stats.roleCount.manager },
    { name: 'Employee', value: stats.roleCount.employee },
  ].filter((d) => d.value > 0);

  const av = avatarColor(user.name);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 animate-rise">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="mt-1 text-base text-slate-500 dark:text-slate-400">Here's what's happening at {company?.name} today.</p>
      </div>

      {!isStaff ? (
        // Employee view: a personal overview card instead of company-wide stats
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card animate-rise p-6 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className={`grid h-16 w-16 place-items-center rounded-full text-2xl font-semibold ${av.bg} ${av.text}`}>
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</p>
                <RoleBadge role={user.role} />
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-slate-400" /> {user.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" /> {user.phone || 'No phone number on file'}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Briefcase className="h-4 w-4 text-slate-400" /> {user.department || 'No department assigned'}
              </div>
            </div>
          </div>

          <div className="card animate-rise flex flex-col items-center justify-center p-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
              <ShieldCheck className="h-7 w-7 text-indigo-500" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-900 dark:text-white">You're all set</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              You have employee access at {company?.name}. Visit "My Profile" to update your details.
            </p>
          </div>
        </div>
      ) : !stats ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {cards.map(({ label, value, icon: Icon, tint }) => (
              <div key={label} className="card animate-rise p-6">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
                <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="card animate-rise p-6">
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Role breakdown</p>
            {pieData.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">No data yet</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {pieData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}