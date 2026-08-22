import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaArrowLeft,
  FaLock,
  FaCheckCircle,
  FaPlayCircle,
} from "react-icons/fa";

import properties from "../data/properties";

const PropertyDetails = () => {
   const { id } = useParams();
  const [isPaid, setIsPaid] = useState(false);

  const property = properties.find(
    (item) => item.id === Number(id)
  );

  useEffect(() => {
    if (property) {
      const timer = setTimeout(() => {
        document.getElementById("unlock-property")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [property]);

  

  

  // ================= PROPERTY NOT FOUND =================

  if (!property) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">

          <h1 className="text-3xl font-bold text-slate-900">
            Property Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            Property ID: {id}
          </p>

          <Link
            to="/rentals"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Browse Properties
          </Link>

        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10">

      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">

        {/* BACK */}

        <Link
          to="/rentals"
          className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
        >
          <FaArrowLeft />
          Back to Properties
        </Link>

        {/* PROPERTY */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

          {/* MAIN IMAGE */}

          <div className="relative">

            <img
              src={property.image}
              alt={property.title}
              className="h-[350px] w-full object-cover md:h-[500px]"
            />

            <span className="absolute left-6 top-6 rounded-full bg-blue-600 px-5 py-2 font-semibold text-white">
              {property.category}
            </span>

          </div>

          {/* CONTENT */}

          <div className="p-6 md:p-10">

            <div className="grid gap-10 lg:grid-cols-3">

              {/* MAIN */}

              <div className="lg:col-span-2">

                {/* TITLE */}

                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  {property.title}
                </h1>

                {/* LOCATION */}

                <div className="mt-4 flex items-center gap-2 text-slate-500">

                  <FaMapMarkerAlt className="text-blue-600" />

                  <span>
                    {property.location}
                  </span>

                </div>

                {/* PRICE */}

                <div className="mt-6">

                  <p className="text-3xl font-bold text-blue-600">
                    KSh {Number(property.price).toLocaleString()}
                  </p>

                  <p className="text-slate-500">
                    per {property.period || "month"}
                  </p>

                </div>

                {/* FEATURES */}

                <div className="mt-8 grid grid-cols-3 border-y border-slate-200 py-6">

                  <div className="text-center">

                    <FaBed className="mx-auto text-2xl text-blue-600" />

                    <p className="mt-2 font-semibold">
                      {property.bedrooms}
                    </p>

                    <p className="text-sm text-slate-500">
                      Bedrooms
                    </p>

                  </div>

                  <div className="border-x border-slate-200 text-center">

                    <FaBath className="mx-auto text-2xl text-blue-600" />

                    <p className="mt-2 font-semibold">
                      {property.bathrooms}
                    </p>

                    <p className="text-sm text-slate-500">
                      Bathrooms
                    </p>

                  </div>

                  <div className="text-center">

                    <FaRulerCombined className="mx-auto text-2xl text-blue-600" />

                    <p className="mt-2 font-semibold">
                      {property.area}
                    </p>

                    <p className="text-sm text-slate-500">
                      Sq Ft
                    </p>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="mt-8">

                  <h2 className="text-2xl font-bold text-slate-900">
                    Property Description
                  </h2>

                  <p className="mt-4 leading-8 text-slate-600">
                    {property.description}
                  </p>

                </div>

                {/* AMENITIES */}

                {property.amenities?.length > 0 && (
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
                )}

                {/* ================================================= */}
                {/* LOCKED INFORMATION */}
                {/* ================================================= */}

                {!isPaid ? (
  <div
    id="unlock-property"
    className="scroll-mt-24 mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-8"
  >

                    <div className="text-center">

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                        <FaLock className="text-2xl" />
                      </div>

                      <h2 className="mt-5 text-2xl font-bold text-slate-900">
                        Unlock Full Property Information
                      </h2>

                      <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
                        Pay to access additional photos, videos,
                        exact location and landlord or caretaker
                        contact information.
                      </p>

                    </div>

                    <div className="mx-auto mt-8 max-w-md space-y-4">

                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-blue-600" />
                        Additional photos
                      </div>

                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-blue-600" />
                        Property videos
                      </div>

                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-blue-600" />
                        Exact property location
                      </div>

                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-blue-600" />
                        Landlord / caretaker details
                      </div>

                    </div>

                    <div className="mt-8 text-center">

                      <p className="text-sm text-slate-500">
                        Property access fee
                      </p>

                      <p className="mt-1 text-3xl font-bold text-blue-600">
                        KSh 500
                      </p>

                      <button
                        type="button"
                        onClick={() => setIsPaid(true)}
                        className="mt-5 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        Pay & Unlock Property
                      </button>

                    </div>

                  </div>

                ) : (

                  /* ================================================= */
                  /* UNLOCKED */
                  /* ================================================= */

                  <div className="mt-12 space-y-8">

                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-600" />

                        <p className="font-semibold text-green-800">
                          Property information unlocked
                        </p>
                      </div>

                    </div>

                    {/* GALLERY */}

                    {property.images?.length > 0 && (
                      <div className="rounded-3xl bg-slate-50 p-6">

                        <h2 className="text-2xl font-bold">
                          Property Gallery
                        </h2>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                          {property.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${property.title} ${index + 1}`}
                              className="h-64 w-full rounded-2xl object-cover"
                            />
                          ))}

                        </div>

                      </div>
                    )}

                    {/* VIDEO */}

                    {property.video && (
                      <div className="rounded-3xl bg-slate-50 p-6">

                        <div className="flex items-center gap-3">

                          <FaPlayCircle className="text-2xl text-blue-600" />

                          <h2 className="text-2xl font-bold">
                            Property Video
                          </h2>

                        </div>

                        <video
                          controls
                          className="mt-6 w-full rounded-2xl"
                        >
                          <source
                            src={property.video}
                            type="video/mp4"
                          />
                        </video>

                      </div>
                    )}

                    {/* MAP */}

                    {property.mapUrl && (
                      <div className="rounded-3xl bg-slate-50 p-6">

                        <h2 className="text-2xl font-bold">
                          Exact Location
                        </h2>

                        <div className="mt-5 overflow-hidden rounded-2xl">

                          <iframe
                            title="Property Location"
                            src={property.mapUrl}
                            width="100%"
                            height="400"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            className="border-0"
                          />

                        </div>

                      </div>
                    )}

                    {/* LANDLORD */}

                    {property.landlord && (
                      <div className="rounded-3xl bg-slate-50 p-6">

                        <h2 className="text-2xl font-bold">
                          Landlord / Caretaker Details
                        </h2>

                        <div className="mt-5 space-y-3 text-slate-600">

                          {property.landlord.name && (
                            <p>
                              <strong>Name:</strong>{" "}
                              {property.landlord.name}
                            </p>
                          )}

                          {property.landlord.phone && (
                            <p>
                              <strong>Phone:</strong>{" "}
                              {property.landlord.phone}
                            </p>
                          )}

                          {property.landlord.email && (
                            <p>
                              <strong>Email:</strong>{" "}
                              {property.landlord.email}
                            </p>
                          )}

                        </div>

                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* SIDEBAR */}

              <div>

                <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <h2 className="text-xl font-bold">
                    Interested in this property?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Contact us to arrange a viewing or get more
                    information about this property.
                  </p>

                  {!isPaid && (
                    <button
                      type="button"
                      onClick={() => setIsPaid(true)}
                      className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      Unlock Property
                    </button>
                  )}

                  <Link
                    to="/contact"
                    className="mt-3 flex w-full items-center justify-center rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Contact Us
                  </Link>

                  <Link
                    to="/rentals"
                    className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
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