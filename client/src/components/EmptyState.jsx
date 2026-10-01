export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="animate-rise flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
        <Icon className="h-8 w-8 text-indigo-400" />
      </div>
      <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      {message && <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>}
      {action}
    </div>
  );
}