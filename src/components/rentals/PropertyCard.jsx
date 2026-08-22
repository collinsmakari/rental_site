import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaRulerCombined,
} from "react-icons/fa";

import Button from "../common/Button";

const PropertyCard = ({ property }) => {
  return (
    <article className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ================= IMAGE ================= */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white">
          {property.category}
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-1 flex-col px-6 py-6">

        {/* TITLE */}
        <div className="flex flex-1 items-start justify-center text-center">
          <h3 className="max-w-sm text-xl font-bold leading-7 text-slate-900">
            {property.title}
          </h3>
        </div>

        {/* LOCATION */}
        <div className="flex flex-1 items-center justify-center">
          <p className="flex items-center justify-center gap-2 text-center leading-6 text-slate-500">
            <FaMapMarkerAlt className="shrink-0 text-blue-600" />
            <span>{property.location}</span>
          </p>
        </div>

        {/* FEATURES */}
        <div className="flex min-h-[105px] flex-1 items-center border-y border-slate-200">
          <div className="grid w-full grid-cols-3">

            {/* Bedrooms */}
            <div className="flex flex-col items-center justify-center gap-2 border-r border-slate-200">
              <FaBed className="text-lg text-blue-600" />

              <span className="font-semibold text-slate-700">
                {property.bedrooms}
              </span>

              <span className="text-xs text-slate-400">
                Bedrooms
              </span>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col items-center justify-center gap-2 border-r border-slate-200">
              <FaBath className="text-lg text-blue-600" />

              <span className="font-semibold text-slate-700">
                {property.bathrooms}
              </span>

              <span className="text-xs text-slate-400">
                Bathrooms
              </span>
            </div>

            {/* Area */}
            <div className="flex flex-col items-center justify-center gap-2">
              <FaRulerCombined className="text-lg text-blue-600" />

              <span className="font-semibold text-slate-700">
                {property.area}
              </span>

              <span className="text-xs text-slate-400">
                Sq Ft
              </span>
            </div>

          </div>
        </div>

        {/* PRICE */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-400">
            Monthly Rent
          </p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            KSh {property.price.toLocaleString()}
          </h2>
        </div>

        {/* BUTTON */}
        <div className="flex shrink-0 justify-center pt-6">
          <Button
            to={`/rentals/${property.id}`}
            className="min-w-[180px] bg-blue-600 text-white transition-none hover:!bg-blue-600 focus:!bg-blue-600"
          >
            View Property
          </Button>
        </div>

      </div>
    </article>
  );
};

export default PropertyCard;