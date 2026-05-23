import { useEffect, useState } from 'react';
import { Calendar, Users, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import FormInput from './FormInput';
import AssigneeSelect from './AssigneeSelect';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import Loader from './Loader';
import { taskAPI } from '../api/tasks';
import { projectAPI } from '../api/projects';
import { useAuth } from '../context/AuthContext';

const TaskDetailModal = ({ taskId, isOpen, onClose, isAdmin, onUpdated, onDeleted }) => {
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
  });
  const [assignedToIds, setAssignedToIds] = useState([]);

  useEffect(() => {
    if (isOpen && taskId) {
      loadTask();
    } else {
      setTask(null);
    }
  }, [isOpen, taskId]);

  const loadTask = async () => {
    setLoading(true);
    try {
      const res = await taskAPI.getById(taskId);
      const data = res.data.data;
      setTask(data);
      setForm({
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
      });
      setAssignedToIds(data.assignees?.map((a) => a.id) || []);

      if (data.project?.id) {
        const membersRes = await projectAPI.getMembers(data.project.id);
        setMembers(membersRes.data.data.map((m) => m.user));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load task');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isAssigned = task?.assignees?.some((a) => a.id === user?.id);
  const canEditTask = isAdmin || isAssigned;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
      };

      if (isAdmin) {
        payload.assignedToIds = assignedToIds;
      }

      await taskAPI.update(taskId, payload);
      toast.success('Task updated successfully');
      await loadTask();
      onUpdated?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(taskId);
      toast.success('Task deleted');
      onDeleted?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const isOverdue =
    task?.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader size="md" />
        </div>
      ) : task ? (
        <div className="space-y-5">
          {!canEditTask ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <div className="flex gap-2">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
              {task.description && (
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                  {task.description}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <FormInput
                label="Title"
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <FormInput
                label="Description"
                name="description"
                as="textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Status"
                  name="status"
                  as="select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  options={[
                    { value: 'TODO', label: 'To Do' },
                    { value: 'IN_PROGRESS', label: 'In Progress' },
                    { value: 'DONE', label: 'Done' },
                  ]}
                />
                <FormInput
                  label="Priority"
                  name="priority"
                  as="select"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  options={[
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                  ]}
                />
              </div>
              <FormInput
                label="Due Date"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium uppercase text-gray-400">Project</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{task.project?.name}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium uppercase text-gray-400">Created By</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{task.createdBy?.name}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium uppercase text-gray-400">Due Date</p>
              <p className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                <Calendar className="h-4 w-4" />
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium uppercase text-gray-400">Assigned Members</p>
              <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-gray-900">
                <Users className="mt-0.5 h-4 w-4 shrink-0" />
                {task.assignees?.length
                  ? task.assignees.map((a) => a.name).join(', ')
                  : 'Unassigned'}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-4">
              <AssigneeSelect
                label="Assign Members"
                members={members}
                selectedIds={assignedToIds}
                onChange={setAssignedToIds}
              />
            </div>
          )}

          {canEditTask && (
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="mr-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
};

export default TaskDetailModal;
