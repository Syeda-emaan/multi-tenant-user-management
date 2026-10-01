export default function ConfirmModal({ title, message, confirmText = 'Delete', onConfirm, onCancel, busy, danger = true }) {
  return (
    <div className="animate-overlay fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-modal card w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-[15px] text-slate-600 dark:text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={`btn-primary ${danger ? '!bg-red-600 hover:!bg-red-700' : ''}`} onClick={onConfirm} disabled={busy}>
            {busy ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}