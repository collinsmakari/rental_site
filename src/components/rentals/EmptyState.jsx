const EmptyState = () => {
  return (
    <div className="py-20 text-center">
      <img
        src="/images/empty-search.svg"
        alt="No Properties"
        className="mx-auto w-56"
      />

      <h2 className="mt-8 text-3xl font-bold">No Properties Found</h2>

      <p className="mt-3 text-gray-600">Try adjusting your search filters.</p>
    </div>
  );
};

export default EmptyState;
