import Input from "../ui/Input";

const PropertySearch = ({
  location,
  maxPrice,
  propertyType,
  onLocationChange,
  onMaxPriceChange,
  onPropertyTypeChange,
}) => {
  return (
    <section className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-md">
      <div className="grid items-center gap-4 md:grid-cols-4">
        {/* Location */}
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="h-12 w-full"
        />

        {/* Maximum Price */}
        <Input
          type="number"
          placeholder="Maximum Price"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="h-12 w-full"
        />

        {/* Property Type */}
        <select
          value={propertyType}
          onChange={(e) => onPropertyTypeChange(e.target.value)}
          className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Bedsitter">Bedsitter</option>
          <option value="Studio">Studio</option>
          <option value="Maisonette">Maisonette</option>
        </select>

        {/* Search indicator */}
        <div className="flex h-12 items-center justify-center rounded-lg bg-orange-500 px-5 font-medium text-white">
          Search Properties
        </div>
      </div>
    </section>
  );
};

export default PropertySearch;