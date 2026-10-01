import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/Badges';
import PasswordInput from '../components/PasswordInput';
import FieldError from '../components/FieldError';
import { validators } from '../utils/validators';

export default function Profile() {
  const { user, company, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: '' });
  };

  const validate = () => {
    const next = {
      name: validators.name(form.name),
      phone: validators.phone(form.phone),
      password: form.password ? validators.password(form.password) : '',
    };
    setErrors(next);
    return Object.values(next).every((m) => !m);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    try {
      const { data } = await api.put(`/users/${user._id}`, payload);
      setUser(data.data);
      setForm({ ...form, password: '' });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-700">{user.name[0].toUpperCase()}</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <div className="ml-auto"><RoleBadge role={user.role} /></div>
        </div>
        <p className="mt-4 text-sm text-slate-600">Company: <span className="font-medium">{company?.name}</span></p>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-semibold text-slate-900">Edit profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input className="input" required value={form.name} onChange={set('name')} />
            <FieldError message={errors.name} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" type="tel" value={form.phone} onChange={set('phone')} placeholder="e.g. +92 300 1234567" />
            <FieldError message={errors.phone} />
          </div>
        </div>
        <div>
          <label className="label">New password (optional)</label>
          <PasswordInput value={form.password} onChange={set('password')} autoComplete="new-password" />
          <FieldError message={errors.password} />
        </div>
        <button className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
      </form>
    </div>
  );
}