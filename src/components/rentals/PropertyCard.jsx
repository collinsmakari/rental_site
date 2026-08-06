import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../common/Button";

const PropertyCard = ({ property }) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <img
        src={property.image}
        alt={property.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-semibold">{property.title}</h3>

        <p className="mt-2 flex items-center gap-2 text-gray-500">
          <FaMapMarkerAlt />
          {property.location}
        </p>

        <div className="mt-4 flex gap-6 text-gray-600">
          <span className="flex items-center gap-2">
            <FaBed />
            {property.bedrooms}
          </span>

          <span className="flex items-center gap-2">
            <FaBath />
            {property.bathrooms}
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-bold text-blue-600">
          KSh {property.price}/month
        </h2>

        <div className="mt-6">
          <Button text="View Details" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
