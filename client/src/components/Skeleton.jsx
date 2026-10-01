export function TableSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4"><div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
          <td className="px-6 py-4"><div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700" /></td>
          <td className="px-6 py-4"><div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
          <td className="px-6 py-4"><div className="ml-auto h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" /></td>
        </tr>
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse p-6">
      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-8 w-16 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}