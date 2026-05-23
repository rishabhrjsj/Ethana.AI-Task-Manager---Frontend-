import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, UserPlus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import AssigneeSelect from '../components/AssigneeSelect';
import KanbanBoard from '../components/KanbanBoard';
import TaskDetailModal from '../components/TaskDetailModal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { projectAPI } from '../api/projects';
import { taskAPI } from '../api/tasks';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdmin, user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskModal, setTaskModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedToIds: [],
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [descExpanded, setDescExpanded] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getByProject(id),
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);

      if (isAdmin) {
        const usersRes = await projectAPI.getAllUsers();
        setUsers(usersRes.data.data);
      }
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create({
        ...taskForm,
        projectId: id,
        assignedToIds: taskForm.assignedToIds,
        dueDate: taskForm.dueDate || null,
      });
      toast.success('Task created');
      setTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToIds: [] });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(id, selectedUserId);
      toast.success('Member added');
      setMemberModal(false);
      setSelectedUserId('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await projectAPI.removeMember(id, userId);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTaskId(task.id);
    setTaskDetailOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navbar title="Project" />
        <div className="flex h-96 items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar title="Project Not Found" />
        <EmptyState title="Project not found" />
      </>
    );
  }

  const canEditTask = (task) =>
    isAdmin || task.assignees?.some((a) => a.id === user?.id);

  const projectMembers = project?.members?.map((m) => m.user) || [];
  const memberIds = projectMembers.map((m) => m?.id).filter(Boolean);
  const availableUsers = users.filter((u) => !memberIds.includes(u.id));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'members', label: 'Members' },
  ];

  return (
    <>
      <Navbar title={project.name} />
      <main className="p-6 pb-10">
        {project.description && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setDescExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-700">Project Description</span>
              {descExpanded ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
              )}
            </button>
            {descExpanded && (
              <p className="border-t border-gray-100 px-4 py-3 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                {project.description}
              </p>
            )}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {isAdmin && activeTab === 'tasks' && (
            <button
              onClick={() => setTaskModal(true)}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          )}
          {isAdmin && activeTab === 'members' && (
            <button
              onClick={() => setMemberModal(true)}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </button>
          )}
        </div>

        {activeTab === 'overview' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">About this project</h2>
            <p className="mt-2 text-gray-600">{project.description || 'No description provided.'}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                <p className="text-xs text-gray-500">Total Tasks</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">
                  {tasks.filter((t) => t.status === 'DONE').length}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
                </p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
              <div className="rounded-lg bg-violet-50 p-4 text-center">
                <p className="text-2xl font-bold text-violet-700">
                  {project.members?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Members</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          tasks.length > 0 ? (
            <KanbanBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onTaskClick={handleTaskClick}
              canEditTask={canEditTask}
            />
          ) : (
            <EmptyState
              title="No tasks yet"
              description={isAdmin ? 'Create a task to get started.' : 'No tasks assigned to you in this project.'}
              action={
                isAdmin && (
                  <button
                    onClick={() => setTaskModal(true)}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Create Task
                  </button>
                )
              }
            />
          )
        )}

        {activeTab === 'members' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  {isAdmin && <th className="px-6 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {project.members?.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.user?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{member.user?.email}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {member.user?.role}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveMember(member.user?.id)}
                          className="rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Modal isOpen={taskModal} onClose={() => setTaskModal(false)} title="Create Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <FormInput
            label="Title"
            name="title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />
          <FormInput
            label="Description"
            name="description"
            as="textarea"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
          <FormInput
            label="Priority"
            name="priority"
            as="select"
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
            ]}
          />
          <FormInput
            label="Due Date"
            name="dueDate"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />
          <AssigneeSelect
            label="Assign Members"
            members={projectMembers}
            selectedIds={taskForm.assignedToIds}
            onChange={(ids) => setTaskForm({ ...taskForm, assignedToIds: ids })}
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setTaskModal(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={memberModal} onClose={() => setMemberModal(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <FormInput
            label="Select User"
            name="userId"
            as="select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            options={[
              { value: '', label: 'Choose a user...' },
              ...availableUsers.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
            ]}
            required
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setMemberModal(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
              Add Member
            </button>
          </div>
        </form>
      </Modal>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={taskDetailOpen}
        onClose={() => {
          setTaskDetailOpen(false);
          setSelectedTaskId(null);
        }}
        isAdmin={isAdmin}
        onUpdated={fetchData}
        onDeleted={fetchData}
      />
    </>
  );
};

export default ProjectDetail;
