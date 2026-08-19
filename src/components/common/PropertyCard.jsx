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

const PropertyCard = ({ property }) => {
  if (!property) return null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/images/property-placeholder.jpg";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow">
            {property.category}
          </span>
        </div>

        {/* Featured */}
        {property.featured && (
          <div className="absolute right-4 top-4">
            <span className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow">
              <CheckCircle size={14} />
              Featured
            </span>
          </div>
        )}

        {/* Favorite */}
        <button
          type="button"
          aria-label={`Save ${property.title}`}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white hover:text-red-500"
        >
          <Heart size={19} />
        </button>

        {/* Price */}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-xl font-bold">
            KSh {property.price.toLocaleString()}
          </p>
          <p className="text-sm text-white/80">per {property.period}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-orange-500">
          {property.title}
        </h3>

        {/* Location */}
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={16} className="shrink-0 text-orange-500" />
          <span>{property.location}</span>
        </div>

        {/* Property Details */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <BedDouble size={18} className="text-orange-500" />
            <span>{property.bedrooms} Beds</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Bath size={18} className="text-orange-500" />
            <span>{property.bathrooms} Baths</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Ruler size={18} className="text-orange-500" />
            <span>{property.area} ft²</span>
          </div>
        </div>

        {/* Furnished */}
        {property.furnished && (
          <div className="mt-4">
            <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Furnished
            </span>
          </div>
        )}

        {/* Description */}
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {property.description}
        </p>

        {/* Button */}
        <Link
          to={`/rentals/${property.id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          View Property
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;