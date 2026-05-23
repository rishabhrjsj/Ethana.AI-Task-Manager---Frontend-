import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { projectAPI } from '../api/projects';
import { useAuth } from '../context/AuthContext';

const Team = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) fetchUsers();
    else setLoading(false);
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await projectAPI.getAllUsers();
      setUsers(res.data.data);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar title="Team" subtitle="View all team members" />
      <main className="p-6">
        {!isAdmin ? (
          <EmptyState
            title="Admin access required"
            description="Only admins can view the full team list."
            icon={Users}
          />
        ) : loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : users.length > 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No team members" icon={Users} />
        )}
      </main>
    </>
  );
};

export default Team;
