const categories = [
  "All",
  "Apartments",
  "Houses",
  "Bedsitters",
  "Studios",
  "Maisonettes",
];

const CategoryFilter = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          className="rounded-full border px-5 py-2 transition hover:bg-blue-600 hover:text-white"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
