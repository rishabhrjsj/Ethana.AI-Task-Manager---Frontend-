import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-violet-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <CheckSquare2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">Team Task Manager</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Start managing tasks today.</h2>
          <p className="mt-4 text-violet-200">
            Create projects, invite team members, and track work with a beautiful dashboard.
          </p>
        </div>
        <p className="text-sm text-violet-300">First user becomes Admin automatically.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              required
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              error={errors.email}
              required
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              required
            />
            <FormInput
              label="Role"
              name="role"
              as="select"
              value={form.role}
              onChange={handleChange}
              options={[
                { value: 'MEMBER', label: 'Member' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? <Loader size="sm" /> : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
