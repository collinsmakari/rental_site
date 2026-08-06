import Input from "../ui/Input";
import Button from "../common/Button";

const PropertySearch = () => {
  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <div className="grid gap-4 md:grid-cols-4">
        <Input placeholder="Location" />

        <Input placeholder="Maximum Price" />

        <select className="rounded-lg border p-3">
          <option>Property Type</option>
          <option>Apartment</option>
          <option>House</option>
          <option>Bedsitter</option>
          <option>Studio</option>
        </select>

        <Button text="Search" />
      </div>
    </section>
  );
};

export default PropertySearch;
