import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import TaskDetailModal from '../components/TaskDetailModal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { projectAPI } from '../api/projects';
import { taskAPI } from '../api/tasks';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { isAdmin, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      const data = res.data.data;
      setProjects(data);
      if (data.length > 0) setSelectedProject(data[0].id);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId) => {
    setTasksLoading(true);
    try {
      const res = await taskAPI.getByProject(projectId);
      setTasks(res.data.data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      toast.success('Status updated');
      fetchTasks(selectedProject);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTaskId(task.id);
    setTaskDetailOpen(true);
  };

  const refreshTasks = () => fetchTasks(selectedProject);

  const canEditTask = (task) =>
    isAdmin || task.assignees?.some((a) => a.id === user?.id);

  if (loading) {
    return (
      <>
        <Navbar title="Tasks" subtitle="Kanban board view" />
        <div className="flex h-96 items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Tasks" subtitle="Kanban board view" />
      <main className="p-6 pb-10">
        {projects.length > 0 ? (
          <>
            <div className="mb-6 max-w-xs">
              <FormInput
                label="Select Project"
                name="project"
                as="select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
              />
            </div>
            {tasksLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : tasks.length > 0 ? (
              <KanbanBoard
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onTaskClick={handleTaskClick}
                canEditTask={canEditTask}
              />
            ) : (
              <EmptyState title="No tasks in this project" />
            )}
          </>
        ) : (
          <EmptyState title="No projects available" description="Join or create a project first." />
        )}
      </main>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={taskDetailOpen}
        onClose={() => {
          setTaskDetailOpen(false);
          setSelectedTaskId(null);
        }}
        isAdmin={isAdmin}
        onUpdated={refreshTasks}
        onDeleted={refreshTasks}
      />
    </>
  );
};

export default Tasks;
