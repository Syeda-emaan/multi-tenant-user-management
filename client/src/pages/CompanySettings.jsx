import { useState } from 'react';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import api, { errMsg } from '../api/client';
import { useAuth } from '../context/AuthContext';
import FieldError from '../components/FieldError';
import { validators } from '../utils/validators';

export default function CompanySettings() {
  const { company } = useAuth();
  const [form, setForm] = useState({ name: company?.name || '', email: company?.email || '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: '' });
  };

  const validate = () => {
    const next = { name: validators.companyName(form.name), email: validators.email(form.email) };
    setErrors(next);
    return Object.values(next).every((m) => !m);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await api.put('/company', form);
      toast.success('Company details updated');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-3 animate-rise">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
          <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Company settings</h1>
          <p className="text-base text-slate-500 dark:text-slate-400">Manage your workspace details</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="card animate-rise space-y-4 p-6">
        <div>
          <label className="label">Company name</label>
          <input className="input" value={form.name} onChange={set('name')} />
          <FieldError message={errors.name} />
        </div>
        <div>
          <label className="label">Company email</label>
          <input className="input" type="email" value={form.email} onChange={set('email')} />
          <FieldError message={errors.email} />
        </div>
        <button className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
      </form>
    </div>
  );
}