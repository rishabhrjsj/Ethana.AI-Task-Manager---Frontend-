import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  FolderKanban,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { dashboardAPI } from '../api/dashboard';
import { taskAPI } from '../api/tasks';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setData(res.data.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      toast.success('Task status updated');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTaskId(task.id);
    setTaskDetailOpen(true);
  };

  const canEditTask = (task) =>
    isAdmin || task.assignees?.some((a) => a.id === user?.id);

  if (loading) {
    return (
      <>
        <Navbar title="Dashboard" subtitle={`Welcome back, ${user?.name}`} />
        <div className="flex h-96 items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );
  }

  const { stats, assignedTasks, recentTasks, overdueTasksList, projects } = data || {};

  return (
    <>
      <Navbar title="Dashboard" subtitle={`Welcome back, ${user?.name}`} />
      <main className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Tasks" value={stats?.totalTasks || 0} icon={ListTodo} color="violet" />
          <StatsCard title="Completed" value={stats?.completedTasks || 0} icon={CheckCircle2} color="green" />
          <StatsCard title="Pending" value={stats?.pendingTasks || 0} icon={Clock} color="blue" />
          <StatsCard title="Overdue" value={stats?.overdueTasks || 0} icon={AlertTriangle} color="red" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Assigned to You</h2>
              <Link to="/tasks" className="text-sm text-violet-600 hover:text-violet-700">
                View all
              </Link>
            </div>
            {assignedTasks?.length > 0 ? (
              <div className="space-y-3">
                {assignedTasks.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onClick={() => handleTaskClick(task)}
                    canEdit={canEditTask(task)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No assigned tasks" description="Tasks assigned to you will appear here." />
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Overdue Tasks</h2>
            </div>
            {overdueTasksList?.length > 0 ? (
              <div className="space-y-3">
                {overdueTasksList.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onClick={() => handleTaskClick(task)}
                    canEdit={canEditTask(task)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No overdue tasks" description="You're all caught up!" />
            )}
          </section>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          </div>
          {recentTasks?.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {recentTasks.slice(0, 6).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onClick={() => handleTaskClick(task)}
                  canEdit={canEditTask(task)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No recent tasks" />
          )}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
            <Link to="/projects" className="text-sm text-violet-600 hover:text-violet-700">
              View all
            </Link>
          </div>
          {projects?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                      <FolderKanban className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {project.description || 'No description'}
                      </p>
                      <div className="mt-3 flex gap-4 text-xs text-gray-400">
                        <span>{project._count?.tasks || 0} tasks</span>
                        <span>{project._count?.members || 0} members</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No projects yet" description="Create a project to get started." />
          )}
        </section>
      </main>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={taskDetailOpen}
        onClose={() => {
          setTaskDetailOpen(false);
          setSelectedTaskId(null);
        }}
        isAdmin={isAdmin}
        onUpdated={fetchDashboard}
        onDeleted={fetchDashboard}
      />
    </>
  );
};

export default Dashboard;
