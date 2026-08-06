const Pagination = () => {
  return (
    <div className="mt-12 flex justify-center gap-2">
      {[1, 2, 3, 4].map((page) => (
        <button
          key={page}
          className="rounded-lg border px-4 py-2 hover:bg-blue-600 hover:text-white"
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
