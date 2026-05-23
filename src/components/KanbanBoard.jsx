import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'TODO', label: 'To Do', color: 'border-gray-300' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-300' },
  { id: 'DONE', label: 'Done', color: 'border-green-300' },
];

const KanbanBoard = ({ tasks, onStatusChange, canEditTask, onTaskClick }) => {
  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((column) => (
        <div key={column.id} className="flex flex-col">
          <div className={`mb-3 flex items-center gap-2 border-l-4 ${column.color} pl-3`}>
            <h3 className="text-sm font-semibold text-gray-700">{column.label}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {getColumnTasks(column.id).length}
            </span>
          </div>
          <div className="flex-1 space-y-3 rounded-xl bg-gray-50/80 p-3 min-h-[200px]">
            {getColumnTasks(column.id).length > 0 ? (
              getColumnTasks(column.id).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  canEdit={canEditTask ? canEditTask(task) : false}
                  onClick={() => onTaskClick?.(task)}
                />
              ))
            ) : (
              <p className="py-8 text-center text-xs text-gray-400">No tasks</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
