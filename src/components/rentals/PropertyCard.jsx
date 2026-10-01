import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaRulerCombined,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const PropertyCard = ({ property, priority = false }) => {
  // Support both MongoDB _id and transformed frontend id
  const propertyId = property.id || property._id;

  // Support the existing image structure
  const image =
    property.image ||
    property.images?.[0] ||
    "/images/property-placeholder.jpg";

  // IMPORTANT:
  // Only show "Not Available" when MongoDB explicitly says available: false.
  // Do NOT use !property.available because undefined would become "Not Available".
  const isUnavailable = property.available === false;

  return (
    <article
      className="
        flex
        h-full
        min-h-[620px]
        flex-col
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* ===============================
          PROPERTY IMAGE
      =============================== */}
      <div
        className="
          relative
          h-56
          shrink-0
          overflow-hidden
          bg-slate-100
        "
      >
        <Link
          to={`/rentals/${propertyId}`}
          className="block h-full w-full"
          aria-label={`View ${property.title}`}
        >
          <img
            src={image}
            alt={property.title || "Rental property"}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="
              h-full
              w-full
              cursor-pointer
              object-cover
              transition-transform
              duration-500
              hover:scale-105
            "
            onError={(event) => {
              event.currentTarget.src =
                "/images/property-placeholder.jpg";
            }}
          />
        </Link>

        {/* PROPERTY TYPE */}
        <span
          className="
            pointer-events-none
            absolute
            left-4
            top-4
            rounded-full
            bg-blue-600
            px-4
            py-1.5
            text-sm
            font-semibold
            text-white
          "
        >
          {property.category || property.propertyType}
        </span>

        {/* NOT AVAILABLE BADGE */}
        {isUnavailable && (
          <span
            className="
              pointer-events-none
              absolute
              right-4
              top-4
              rounded-full
              bg-red-600
              px-4
              py-1.5
              text-sm
              font-semibold
              text-white
              shadow-md
            "
          >
            Not Available
          </span>
        )}
      </div>

      {/* ===============================
          PROPERTY DETAILS
      =============================== */}
      <div
        className="
          flex
          flex-1
          flex-col
          px-6
          py-6
        "
      >
        {/* TITLE */}
        <div
          className="
            flex
            flex-1
            items-start
            justify-center
            text-center
          "
        >
          <h3
            className="
              max-w-sm
              text-xl
              font-bold
              leading-7
              text-slate-900
            "
          >
            {property.title}
          </h3>
        </div>

        {/* LOCATION */}
        <div
          className="
            flex
            flex-1
            items-center
            justify-center
          "
        >
          <p
            className="
              flex
              items-center
              justify-center
              gap-2
              text-center
              leading-6
              text-slate-500
            "
          >
            <FaMapMarkerAlt className="shrink-0 text-blue-600" />

            <span>{property.location}</span>
          </p>
        </div>

        {/* PROPERTY FEATURES */}
        <div
          className="
            flex
            min-h-[105px]
            flex-1
            items-center
            border-y
            border-slate-200
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-3
            "
          >
            {/* BEDROOMS */}
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                border-r
                border-slate-200
              "
            >
              <FaBed className="text-lg text-blue-600" />

              <span className="font-semibold text-slate-700">
                {property.bedrooms ?? 0}
              </span>

              <span className="text-xs text-slate-400">
                Bedrooms
              </span>
            </div>

            {/* BATHROOMS */}
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                border-r
                border-slate-200
              "
            >
              <FaBath className="text-lg text-blue-600" />

              <span className="font-semibold text-slate-700">
                {property.bathrooms ?? 0}
              </span>

              <span className="text-xs text-slate-400">
                Bathrooms
              </span>
            </div>

            {/* AREA */}
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
              "
            >
              <FaRulerCombined className="text-lg text-blue-600" />

              <span className="font-semibold text-slate-700">
                {property.area ?? 0}
              </span>

              <span className="text-xs text-slate-400">
                Sq Ft
              </span>
            </div>
          </div>
        </div>

        {/* MONTHLY RENT */}
        <div
          className="
            flex
            flex-1
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <p className="text-sm text-slate-400">
            Monthly Rent
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-bold
              text-blue-600
            "
          >
            KSh{" "}
            {Number(property.price || 0).toLocaleString()}
          </h2>
        </div>

        {/* BUTTON */}
        <div
          className="
            flex
            shrink-0
            justify-center
            pt-6
          "
        >
          <Button
            to={`/rentals/${propertyId}`}
            className="
              min-w-[180px]
              bg-blue-600
              text-white
              transition-none
              hover:!bg-blue-600
              focus:!bg-blue-600
            "
          >
            View Property
          </Button>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;