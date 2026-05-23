const AssigneeSelect = ({ label, members, selectedIds, onChange }) => {
  const toggle = (userId) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <p className="block text-sm font-medium text-gray-700">{label}</p>}
      <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
        {members.length > 0 ? (
          members.map((member) => (
            <label
              key={member.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(member.id)}
                onChange={() => toggle(member.id)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-700">
                {member.name}
                <span className="ml-1 text-gray-400">({member.email})</span>
              </span>
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-400">No members available</p>
        )}
      </div>
    </div>
  );
};

export default AssigneeSelect;
