import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, LogOut, Building2, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { RoleBadge } from './Badges';
import ConfirmModal from './ConfirmModal';
import { avatarColor } from '../utils/avatarColor';

export default function Layout() {
  const { user, company, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const av = avatarColor(user.name);

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(user.role !== 'employee' ? [{ to: '/users', label: 'Users', icon: Users }] : []),
    ...(user.role === 'admin' ? [{ to: '/settings', label: 'Company Settings', icon: Settings }] : []),
    { to: '/profile', label: 'My Profile', icon: UserCircle },
  ];

  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
      isActive ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-72 flex-col bg-gradient-to-b from-slate-900 to-slate-950 md:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
            <Building2 className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-white">{company?.name}</p>
            <p className="text-xs text-slate-400">Workspace</p>
          </div>
        </div>

        <div className="mx-4 mb-2 h-px bg-slate-800" />

        <nav className="flex-1 space-y-1.5 px-4 py-2">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={link}>
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-4 mb-3 h-px bg-slate-800" />

        <button onClick={toggle} className="mx-4 mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
        <button onClick={() => setConfirmingSignOut(true)} className="mx-4 mb-5 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <nav className="flex gap-4 md:hidden">
            {items.map(({ to, label }) => (
              <NavLink key={to} to={to} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{label}</NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <button onClick={toggle} className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <div className={`grid h-11 w-11 place-items-center rounded-full text-base font-semibold shadow-sm ${av.bg} ${av.text}`}>
              {user.name[0].toUpperCase()}
            </div>
            <div className="hidden sm:block"><RoleBadge role={user.role} /></div>
            <button onClick={() => setConfirmingSignOut(true)} className="rounded-lg p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600 md:hidden">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8"><Outlet /></main>
      </div>

      {confirmingSignOut && (
        <ConfirmModal title="Sign out?" message="You'll need to sign in again to access your workspace." confirmText="Sign out" onConfirm={logout} onCancel={() => setConfirmingSignOut(false)} danger={false} />
      )}
    </div>
  );
}