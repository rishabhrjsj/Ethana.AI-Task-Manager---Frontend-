import { Calendar, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const TaskCard = ({ task, onStatusChange, canEdit = true, onClick }) => {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  const assigneeNames = task.assignees?.map((a) => a.name).join(', ');

  return (
    <div
      className="group shrink-0 cursor-pointer overflow-visible rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md"
      onClick={onClick}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{task.title}</h4>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="mb-3 text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {task.dueDate && (
          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
            <Calendar className="h-3.5 w-3.5" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        {assigneeNames && (
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {assigneeNames}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={task.status} />
        {canEdit && onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 focus:border-violet-400 focus:outline-none"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
