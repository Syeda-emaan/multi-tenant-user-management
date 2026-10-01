import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api/client';
import { validators } from '../utils/validators';
import PasswordInput from '../components/PasswordInput';
import FieldError from '../components/FieldError';
import AuthShell from './AuthShell';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/users" replace />;

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: '' });
  };

  const validate = () => {
    const next = { email: validators.email(form.email), password: form.password ? '' : 'Password is required' };
    setErrors(next);
    return Object.values(next).every((m) => !m);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try { await login(form); nav('/users'); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your company workspace">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" />
          <FieldError message={errors.email} />
        </div>
        <div>
          <label className="label">Password</label>
          <PasswordInput required value={form.password} onChange={set('password')} autoComplete="current-password" />
          <FieldError message={errors.password} />
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New company? <Link to="/register" className="font-medium text-indigo-600 hover:underline">Register here</Link>
      </p>
    </AuthShell>
  );
}