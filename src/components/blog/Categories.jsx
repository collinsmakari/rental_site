const Categories = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="sticky top-[80px] z-30 mb-12 bg-slate-200/95 py-4 backdrop-blur-md">
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-700 shadow-md hover:bg-blue-600 hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;