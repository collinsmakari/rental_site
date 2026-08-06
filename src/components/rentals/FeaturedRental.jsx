import Button from "../common/Button";

const FeaturedRental = () => {
  return (
    <section className="grid items-center gap-10 rounded-xl bg-blue-50 p-10 lg:grid-cols-2">
      <img
        src="/images/rentals/featured.jpg"
        alt="Featured Rental"
        className="rounded-xl"
      />

      <div>
        <span className="font-semibold text-blue-600">Featured Property</span>

        <h2 className="mt-3 text-4xl font-bold">Luxury Family Apartment</h2>

        <p className="mt-5 text-gray-600">
          Spacious 3-bedroom apartment with modern interiors, secure parking and
          swimming pool.
        </p>

        <h3 className="mt-6 text-3xl font-bold text-blue-600">
          KSh 85,000/month
        </h3>

        <div className="mt-8">
          <Button text="View Property" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedRental;
