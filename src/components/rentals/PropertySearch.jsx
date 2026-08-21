import Input from "../ui/Input";
import Button from "../common/Button";

const PropertySearch = ({
  location,
  maxPrice,
  propertyType,
  onLocationChange,
  onMaxPriceChange,
  onPropertyTypeChange,
  onSearch,
}) => {
  return (
    <section className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="grid items-center gap-4 md:grid-cols-4"
      >
        {/* Location */}
        <Input
          type="text"
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
          <option value="Commercial">Commercial</option>
        </select>

        {/* Search Button */}
        <Button
          type="submit"
          className="h-12 w-full"
        >
          Search Properties
        </Button>
      </form>
    </section>
  );
};

export default PropertySearch;