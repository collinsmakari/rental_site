const PropertySidebar = () => {
  return (
    <aside className="space-y-8 rounded-xl bg-white p-6 shadow">
      <div>
        <h3 className="mb-4 text-xl font-bold">Property Types</h3>

        <ul className="space-y-2">
          <li>Apartment</li>
          <li>House</li>
          <li>Bedsitter</li>
          <li>Studio</li>
          <li>Maisonette</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold">Price Range</h3>

        <input type="range" className="w-full" />
      </div>
    </aside>
  );
};

export default PropertySidebar;
