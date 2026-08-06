import { motion } from "framer-motion";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../common/Button";

const properties = [
  {
    id: 1,
    image: "/images/properties/property-1.jpg",
    title: "Luxury Family House",
    location: "Westlands, Nairobi",
    price: "KSh 85,000 / month",
    beds: 4,
    baths: 3,
    area: "280 m²",
  },
  {
    id: 2,
    image: "/images/properties/property-2.jpg",
    title: "Modern Apartment",
    location: "Kilimani, Nairobi",
    price: "KSh 55,000 / month",
    beds: 3,
    baths: 2,
    area: "170 m²",
  },
  {
    id: 3,
    image: "/images/properties/property-3.jpg",
    title: "Executive Office Space",
    location: "Upper Hill, Nairobi",
    price: "KSh 120,000 / month",
    beds: 6,
    baths: 2,
    area: "420 m²",
  },
  {
    id: 4,
    image: "/images/properties/property-4.jpg",
    title: "Luxury Studio Apartment",
    location: "Karen, Nairobi",
    price: "KSh 38,000 / month",
    beds: 1,
    baths: 1,
    area: "70 m²",
  },
  {
    id: 5,
    image: "/images/properties/property-5.jpg",
    title: "Commercial Shop",
    location: "CBD, Nairobi",
    price: "KSh 70,000 / month",
    beds: "-",
    baths: 1,
    area: "120 m²",
  },
  {
    id: 6,
    image: "/images/properties/property-6.jpg",
    title: "Townhouse",
    location: "Runda, Nairobi",
    price: "KSh 150,000 / month",
    beds: 5,
    baths: 4,
    area: "350 m²",
  },
];

const FeaturedProperties = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Featured Properties
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Explore Our Latest Rental Listings
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Browse a carefully selected collection of premium apartments, family
            homes, offices, and commercial spaces available for rent.
          </p>
        </motion.div>

        {/* Property Grid */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property, index) => (
            <motion.article
              key={property.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}

              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-72 w-full object-cover transition duration-500 hover:scale-110"
                />

                <span className="absolute left-5 top-5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  Featured
                </span>
              </div>

              {/* Content */}

              <div className="p-7">
                <h3 className="text-2xl font-bold text-slate-900">
                  {property.title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-slate-500">
                  <FaMapMarkerAlt className="text-blue-600" />
                  {property.location}
                </div>

                <p className="mt-5 text-3xl font-bold text-blue-600">
                  {property.price}
                </p>

                {/* Property Info */}

                <div className="my-6 flex items-center justify-between border-y border-slate-200 py-5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaBed className="text-blue-600" />
                    {property.beds}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaBath className="text-blue-600" />
                    {property.baths}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaRulerCombined className="text-blue-600" />
                    {property.area}
                  </div>
                </div>

                <Button text="View Details" to={`/properties/${property.id}`} />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Button */}

        <div className="mt-16 text-center">
          <Button text="View All Properties" to="/properties" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
