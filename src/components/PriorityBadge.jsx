const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
};

const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium uppercase ${priorityStyles[priority] || priorityStyles.MEDIUM}`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
