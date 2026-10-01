const categories = [
  { label: "All", value: "All" },
  { label: "Apartments", value: "Apartment" },
  { label: "Houses", value: "House" },
  { label: "Bedsitters", value: "Bedsitter" },
  { label: "Studios", value: "Studio" },
  { label: "Commercials", value: "Commercial" },
  { label: "Offices", value: "Office" },
  { label: "Maisonette", value: "Maisonette" },
  { label: "AirBnBs", value: "AirBnB" },
];

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const handleCategoryClick = (category) => {
    onCategoryChange(category);

    // Scroll to property results
    setTimeout(() => {
      document.getElementById("property-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const visibleCategories = categories.slice(0, 2);
  const moreCategories = categories.slice(2);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* ========================================
          MOBILE
          Only first two categories
      ======================================== */}
      <div className="flex items-center gap-2 sm:hidden">
        {visibleCategories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => handleCategoryClick(category.value)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selectedCategory === category.value
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {category.label}
          </button>
        ))}

        {/* More Dropdown */}
        <select
          value={
            moreCategories.some(
              (category) => category.value === selectedCategory
            )
              ? selectedCategory
              : ""
          }
          onChange={(e) => {
            if (e.target.value) {
              handleCategoryClick(e.target.value);
            }
          }}
          className={`rounded-full border px-4 py-2 text-sm outline-none transition ${
            moreCategories.some(
              (category) => category.value === selectedCategory
            )
              ? "border-orange-500 bg-orange-500 text-white"
              : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          <option value="">More ▾</option>

          {moreCategories.map((category) => (
            <option
              key={category.value}
              value={category.value}
            >
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* ========================================
          DESKTOP
          Show all categories
      ======================================== */}
      <div className="hidden flex-wrap gap-3 sm:flex">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => handleCategoryClick(category.value)}
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
    </div>
  );
};

export default CategoryFilter;