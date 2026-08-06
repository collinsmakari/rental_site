const Loading = ({ text = "Loading...", size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "fixed inset-0 z-50 bg-white/80" : "py-10"
      }`}
    >
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizes[size]}`}
      />

      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
};

export default Loading;
