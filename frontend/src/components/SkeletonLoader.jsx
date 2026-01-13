const SkeletonLoader = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-[200px] animate-pulse">
      <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-5/6 mb-4"></div>
      <div className="flex justify-between mt-auto pt-4">
        <div className="h-4 bg-white/10 rounded w-1/4"></div>
        <div className="h-4 bg-white/10 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
