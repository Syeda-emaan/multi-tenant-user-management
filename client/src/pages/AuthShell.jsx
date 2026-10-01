import { Building2, Users2, ShieldCheck } from 'lucide-react';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2 text-lg font-semibold"><Building2 /> Capregsoft</div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight">Manage your team.<br />Keep your data yours.</h2>
          <p className="mt-4 max-w-md text-indigo-100">Every company gets its own secure workspace with role-based access for admins, managers and employees.</p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <Users2 className="h-5 w-5 text-indigo-300" />
              <span className="text-sm">Multi-tenant, isolated by design</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <span className="text-sm">Role-based access control built in</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-indigo-200">Multi-tenant user management</p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="animate-rise w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}