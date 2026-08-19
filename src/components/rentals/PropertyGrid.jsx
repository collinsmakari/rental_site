import PropertyCard from "../common/PropertyCard";

const PropertyGrid = ({ properties = [] }) => {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Available Properties
          </h2>

          <p className="mt-2 text-slate-500">
            Find a property that fits your lifestyle and budget.
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              No properties found
            </h3>

            <p className="mt-2 text-slate-500">
              Check back later for available rental properties.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyGrid;