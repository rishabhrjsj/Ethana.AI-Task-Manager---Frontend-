import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h2 className="text-4xl font-bold leading-tight">
            Manage your team&apos;s work, all in one place.
          </h2>
          <p className="mt-4 text-violet-200">
            Organize projects, assign tasks, and track progress with a clean, modern workspace.
          </p>
        </div>
        <p className="text-sm text-violet-300">Inspired by ClickUp — simple and lightweight.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
                <CheckSquare2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Task Manager</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-violet-600 hover:text-violet-700">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? <Loader size="sm" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
