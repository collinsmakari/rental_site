import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Heart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

const PropertyCard = ({ property }) => {
  const {
    _id,
    title,
    propertyType,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    images,
    furnished,
    featured,
  } = property;

  // Use the first MongoDB image
  const mainImage =
    images?.length > 0
      ? images[0]
      : "/properties/property-placeholder.jpg";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
      
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={mainImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Property Type */}
        <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
          {propertyType}
        </div>

        {/* Featured */}
        {featured && (
          <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-600 shadow">
            Featured
          </div>
        )}

        {/* Availability */}
        {!property.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Property Content */}
      <div className="flex flex-1 flex-col p-5">

        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
          {title}
        </h3>

        {/* Location */}
        <p className="mt-2 text-sm text-gray-500">
          {location}
        </p>

        {/* Price */}
        <div className="mt-4">
          <span className="text-2xl font-bold text-blue-600">
            KSh {Number(price).toLocaleString()}
          </span>

          <span className="ml-1 text-sm text-gray-500">
            / month
          </span>
        </div>

        {/* Property Features */}
        <div className="mt-4 flex flex-wrap gap-4 border-y border-gray-100 py-4 text-sm text-gray-600">

          <div className="flex items-center gap-2">
            <FaBed className="text-blue-600" />
            <span>
              {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaBath className="text-blue-600" />
            <span>
              {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaRulerCombined className="text-blue-600" />
            <span>{Number(area).toLocaleString()} sq ft</span>
          </div>

        </div>

        {/* Furnished */}
        <div className="mt-3 text-sm text-gray-500">
          {furnished ? "Furnished" : "Unfurnished"}
        </div>

        {/* Button */}
        <div className="mt-auto pt-5">
          <Link
            to={`/properties/${_id}`}
            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
          >
            View Property
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PropertyCard;
