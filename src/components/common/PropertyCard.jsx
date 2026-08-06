import { Link } from "react-router-dom";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";

const PropertyCard = ({ property }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-2 hover:shadow-xl">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="h-64 w-full object-cover"
        />

        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          {property.status}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900">{property.title}</h3>

        <p className="mt-2 flex items-center gap-2 text-slate-500">
          <FaMapMarkerAlt />
          {property.location}
        </p>

        <p className="mt-4 text-2xl font-bold text-blue-600">
          KSh {property.price}
        </p>

        <div className="mt-6 flex justify-between text-slate-600">
          <span className="flex items-center gap-2">
            <FaBed />
            {property.beds}
          </span>

          <span className="flex items-center gap-2">
            <FaBath />
            {property.baths}
          </span>

          <span className="flex items-center gap-2">
            <FaRulerCombined />
            {property.size}
          </span>
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="mt-6 block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
