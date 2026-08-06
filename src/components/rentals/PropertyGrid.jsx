import PropertyCard from "./PropertyCard";

const PropertyGrid = ({ properties }) => {
  return (
    <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </section>
  );
};

export default PropertyGrid;
