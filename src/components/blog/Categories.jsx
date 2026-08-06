const Categories = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
            activeCategory === category
              ? "bg-primary text-white shadow-lg"
              : "bg-white text-slate-700 shadow hover:bg-primary hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;
