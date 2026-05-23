const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  as = 'input',
  options = [],
  ...props
}) => {
  const baseClasses =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100';

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {as === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClasses}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClasses} min-h-[100px] resize-y`}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
          {...props}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
