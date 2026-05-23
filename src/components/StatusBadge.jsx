const statusStyles = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};

const statusLabels = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || statusStyles.TODO}`}
    >
      {statusLabels[status] || status}
    </span>
  );
};

export default StatusBadge;
