const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 bg-gray-300 rounded w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] bg-gray-200 rounded" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-10 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};
export default SkeletonLoader;
