const LoadingSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 h-4 w-24 rounded bg-slate-200" />
          <div className="mb-3 h-5 w-40 rounded bg-slate-200" />
          <div className="mb-2 h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-2/3 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
