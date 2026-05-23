import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { projectAPI } from '../api/projects';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.data.data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectAPI.create(form);
      toast.success('Project created');
      setModalOpen(false);
      setForm({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar title="Projects" subtitle="Manage your team projects" />
      <main className="p-6 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">{projects.length} project(s)</p>
          {isAdmin && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 transition group-hover:bg-violet-100">
                  <FolderKanban className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
                  <span>{project._count?.tasks || 0} tasks</span>
                  <span>{project.members?.length || 0} members</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects yet"
            description={
              isAdmin
                ? 'Create your first project to get started.'
                : 'You have not been added to any projects yet.'
            }
            action={
              isAdmin && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Create Project
                </button>
              )
            }
          />
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormInput
            label="Project Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Marketing Campaign"
            required
          />
          <FormInput
            label="Description"
            name="description"
            as="textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Project description..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Projects;
