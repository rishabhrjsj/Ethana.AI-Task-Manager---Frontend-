import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckSquare2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/team', icon: Users, label: 'Team' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <CheckSquare2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Task Manager</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-3">
        {!collapsed && user && (
          <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2">
            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
