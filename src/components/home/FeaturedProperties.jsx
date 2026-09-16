import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Button from "../common/Button";

const API_URL = "http://localhost:5000/api/properties";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();

        // Get only featured properties
        const featured = (data.properties || []).filter(
          (property) => property.featured === true
        );

        setProperties(featured);
      } catch (error) {
        console.error("Featured properties error:", error);
        setError("Unable to load featured properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

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
            Browse a carefully selected collection of premium apartments,
            family homes, offices, and commercial spaces available for rent.
          </p>
        </motion.div>

        {/* Loading */}

        {loading && (
          <div className="py-10 text-center text-slate-600">
            Loading featured properties...
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="py-10 text-center text-red-500">
            {error}
          </div>
        )}

        {/* No featured properties */}

        {!loading && !error && properties.length === 0 && (
          <div className="py-10 text-center text-slate-600">
            No featured properties available at the moment.
          </div>
        )}

        {/* Property Grid */}

        {!loading && !error && properties.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {properties.map((property, index) => (
              <motion.article
                key={property._id}
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
                    src={
                      property.images?.[0] ||
                      "/properties/property-1.jpg"
                    }
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

                  {/* Location */}

                  <div className="mt-3 flex items-center gap-2 text-slate-500">
                    <FaMapMarkerAlt className="text-blue-600" />

                    <span>
                      {property.location}
                    </span>
                  </div>

                  {/* Rental Price */}

                  <p className="mt-5 text-3xl font-bold text-blue-600">
                    KSh {Number(property.price).toLocaleString()} / month
                  </p>

                  {/* Property Info */}

                  <div className="my-6 flex items-center justify-between border-y border-slate-200 py-5 text-slate-600">

                    <div className="flex items-center gap-2">
                      <FaBed className="text-blue-600" />
                      <span>{property.bedrooms ?? "-"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaBath className="text-blue-600" />
                      <span>{property.bathrooms ?? "-"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaRulerCombined className="text-blue-600" />
                      <span>{property.area ?? "-"} m²</span>
                    </div>

                  </div>
                  
                  {/* View Details */}

                  <Button
                    to={`/properties/${property._id}`}
                    className="min-w-[180px] bg-blue-600 text-white transition-none hover:!bg-blue-600 focus:!bg-blue-600"
                  >
                    View Details
                  </Button>

                </div>
              </motion.article>
            ))}

          </div>
        )}

        {/* Bottom Button */}

        <div className="mt-16 text-center">
          <Button to="/rentals">
            View All Properties
          </Button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProperties;