import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaArrowLeft,
} from "react-icons/fa";

import properties from "../data/properties";

const PropertyDetails = () => {
  const { id } = useParams();

  const property = properties.find(
    (item) => item.id === Number(id)
  );

  if (!property) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Property Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            The property you are looking for does not exist.
          </p>

          <Link
            to="/rentals"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Properties
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Back */}
       <Link
  to="/rentals#property-results"
  className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
>
  <FaArrowLeft />
  Back to Properties
</Link>
        {/* Property */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

          {/* Image */}
          <div className="relative">
            <img
              src={property.image}
              alt={property.title}
              className="h-[400px] w-full object-cover md:h-[550px]"
            />

            <span className="absolute left-6 top-6 rounded-full bg-blue-600 px-5 py-2 font-semibold text-white">
              {property.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">

            <div className="grid gap-10 lg:grid-cols-3">

              {/* Main Information */}
              <div className="lg:col-span-2">

                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {property.title}
                </h1>

                {/* Location */}
                <div className="mt-4 flex items-center gap-2 text-slate-500">
                  <FaMapMarkerAlt className="text-blue-600" />
                  {property.location}
                </div>

                {/* Price */}
                <div className="mt-6">
                  <p className="text-3xl font-bold text-blue-600">
                    KSh {property.price.toLocaleString()}
                  </p>

                  <p className="text-slate-500">
                    per {property.period}
                  </p>
                </div>

                {/* Property Information */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-slate-200 py-6">

                  <div className="text-center">
                    <FaBed className="mx-auto text-2xl text-blue-600" />

                    <p className="mt-2 font-semibold text-slate-900">
                      {property.bedrooms}
                    </p>

                    <p className="text-sm text-slate-500">
                      Bedrooms
                    </p>
                  </div>

                  <div className="text-center">
                    <FaBath className="mx-auto text-2xl text-blue-600" />

                    <p className="mt-2 font-semibold text-slate-900">
                      {property.bathrooms}
                    </p>

                    <p className="text-sm text-slate-500">
                      Bathrooms
                    </p>
                  </div>

                  <div className="text-center">
                    <FaRulerCombined className="mx-auto text-2xl text-blue-600" />

                    <p className="mt-2 font-semibold text-slate-900">
                      {property.area}
                    </p>

                    <p className="text-sm text-slate-500">
                      Sq Ft
                    </p>
                  </div>

                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Property Description
                  </h2>

                  <p className="mt-4 leading-8 text-slate-600">
                    {property.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Amenities
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar */}
              <div>
                <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <h2 className="text-xl font-bold text-slate-900">
                    Interested in this property?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Contact us to arrange a viewing or get more information
                    about this property.
                  </p>

                  <Link
                    to="/contact"
                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Contact Us
                  </Link>

                  <Link
                    to="/rentals"
                    className="mt-3 flex w-full items-center justify-center rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                  >
                    Browse More Properties
                  </Link>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetails;