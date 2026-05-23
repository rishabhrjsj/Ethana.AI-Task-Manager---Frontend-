const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-violet-200 border-t-violet-600`}
      />
    </div>
  );
};

export default Loader;
