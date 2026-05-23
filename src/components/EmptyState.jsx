import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = '', icon: Icon = Inbox, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
