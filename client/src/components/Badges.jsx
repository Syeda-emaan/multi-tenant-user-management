const roleStyle = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  manager: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  employee: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
};

export const RoleBadge = ({ role }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleStyle[role]}`}>{role}</span>
);

export const StatusBadge = ({ active }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'}`}>
    {active ? 'Active' : 'Inactive'}
  </span>
);