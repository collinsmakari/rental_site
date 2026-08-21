const categories = [
  { label: "All", value: "All" },
  { label: "Apartments", value: "Apartment" },
  { label: "Houses", value: "House" },
  { label: "Bedsitters", value: "Bedsitter" },
  { label: "Studios", value: "Studio" },
  { label: "Maisonettes", value: "Maisonette" },
];

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category.value}
          type="button"
          onClick={() => onCategoryChange(category.value)}
          className={`rounded-full border px-5 py-2 transition ${
            selectedCategory === category.value
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;