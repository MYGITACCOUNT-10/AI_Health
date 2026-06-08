const LoadingSpinner = ({ fullScreen = false, message = "Loading..." }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cyan-100 border-b-cyan-500 animate-spin flex items-center justify-center" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      {message && <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
