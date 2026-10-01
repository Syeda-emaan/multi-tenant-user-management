import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api/client';
import { validators } from '../utils/validators';
import PasswordInput from '../components/PasswordInput';
import FieldError from '../components/FieldError';
import AuthShell from './AuthShell';

export default function Register() {
  const { registerCompany } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ companyName: '', companyEmail: '', name: '', email: '', password: '' });

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: '' });
  };

  const validate = () => {
    const next = {
      companyName: validators.companyName(form.companyName),
      companyEmail: validators.email(form.companyEmail),
      name: validators.name(form.name),
      email: validators.email(form.email),
      password: validators.password(form.password),
    };
    setErrors(next);
    return Object.values(next).every((m) => !m);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try { await registerCompany(form); toast.success('Company created'); nav('/users'); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Register your company" subtitle="Create a workspace and your admin account">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Company name</label>
            <input className="input" required value={form.companyName} onChange={set('companyName')} placeholder="e.g. Acme Ltd" />
            <FieldError message={errors.companyName} />
          </div>
          <div>
            <label className="label">Company email</label>
            <input className="input" type="email" required value={form.companyEmail} onChange={set('companyEmail')} placeholder="info@company.com" />
            <FieldError message={errors.companyEmail} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Your name</label>
            <input className="input" required value={form.name} onChange={set('name')} placeholder="e.g. Ali Khan" />
            <FieldError message={errors.name} />
          </div>
          <div>
            <label className="label">Your email</label>
            <input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" />
            <FieldError message={errors.email} />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <PasswordInput required value={form.password} onChange={set('password')} placeholder="Min 8 chars, letter + number" autoComplete="new-password" />
          <FieldError message={errors.password} />
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating...' : 'Create company'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered? <Link to="/login" className="font-medium text-indigo-600 hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}