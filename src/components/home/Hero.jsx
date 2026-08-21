import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Button from "../common/Button";

const propertyTypes = [
  { label: "All Properties", value: "" },
  { label: "Apartments", value: "Apartment" },
  { label: "Houses", value: "House" },
  { label: "Bedsitters", value: "Bedsitter" },
  { label: "Studios", value: "Studio" },
  { label: "Maisonettes", value: "Maisonette" },
  { label: "Commercial", value: "Commercial" },
];

const Hero = () => {
  const navigate = useNavigate();

  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (propertyType) {
      params.set("type", propertyType);
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (budget) {
      params.set("maxPrice", budget);
    }

    navigate(`/rentals?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 8,
          ease: "easeOut",
        }}
        className="absolute inset-0"
      >
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/img-1.jpg')",
          }}
        />
      </motion.div>

      {/* ================= DARK OVERLAY ================= */}

      <div className="absolute inset-0 bg-slate-950/65" />

      {/* ================= GRADIENT ================= */}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

      {/* ================= GRID ================= */}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-10 lg:px-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="w-full max-w-4xl"
        >

          {/* ================= BADGE ================= */}

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300 backdrop-blur-md">
            <FaHome />
            Trusted Rental Company
          </div>

          {/* ================= HEADING ================= */}

          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect
            <span className="text-blue-400">
              {" "}Rental Property
            </span>
            <br />
            With Confidence
          </h1>

          {/* ================= DESCRIPTION ================= */}

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Discover apartments, family homes, offices and commercial spaces
            from verified property owners. Affordable rentals, flexible lease
            options and professional support every step of the way.
          </p>

          {/* ================= SEARCH ================= */}

          <div className="mt-7 rounded-2xl bg-white p-3 shadow-2xl">
            <form
              onSubmit={handleSearch}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >

              {/* Property Type */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                {propertyTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Location */}
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              {/* Maximum Budget */}
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Maximum Budget"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <FaSearch />
                Search
              </button>
            </form>
          </div>

          {/* ================= ACTION BUTTONS ================= */}

          <div className="mt-6 flex flex-wrap gap-4">
            <Button to="/rentals">
              Browse Properties
            </Button>

            <Button
              to="/contact"
              variant="outline"
            >
              Contact Us
            </Button>
          </div>

          {/* ================= STATISTICS ================= */}

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-blue-400 sm:text-4xl">
                500+
              </h2>

              <p className="mt-1 text-sm text-slate-300 sm:text-base">
                Properties
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-400 sm:text-4xl">
                1200+
              </h2>

              <p className="mt-1 text-sm text-slate-300 sm:text-base">
                Happy Clients
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-400 sm:text-4xl">
                25+
              </h2>

              <p className="mt-1 text-sm text-slate-300 sm:text-base">
                Cities
              </p>
            </div>
          </div>

        </motion.div>
      </div>

      {/* ================= SCROLL INDICATOR ================= */}

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <FaMapMarkerAlt className="text-2xl text-blue-400" />
      </motion.div>

    </section>
  );
};

export default Hero;