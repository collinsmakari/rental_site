import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaSearch, FaHome } from "react-icons/fa";
import Button from "../common/Button";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background Image */}

      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8 }}
        className="absolute inset-0"
      >
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/img-1.jpg')",
          }}
        />
      </motion.div>

      {/* Overlay */}

      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

      {/* Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

      {/* Content */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 lg:px-10">
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
          className="max-w-3xl"
        >
          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300 backdrop-blur-md">
            <FaHome />
            Trusted Rental Company
          </div>

          {/* Heading */}

          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect
            <span className="text-blue-400"> Rental Property</span>
            <br />
            With Confidence
          </h1>

          {/* Description */}

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Discover apartments, family homes, offices and commercial spaces
            from verified property owners. Affordable rentals, flexible lease
            options and professional support every step of the way.
          </p>

          {/* Search */}

          <div className="mt-10 rounded-2xl bg-white p-3 shadow-2xl">
            <form className="grid gap-3 lg:grid-cols-4">
              <input
                type="text"
                placeholder="Property Type"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="Location"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="number"
                placeholder="Budget"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                <FaSearch />
                Search
              </button>
            </form>
          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-wrap gap-4">
            <Button text="Browse Properties" to="/properties" />

            <Button text="Contact Us" to="/contact" variant="outline" />
          </div>

          {/* Statistics */}

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-8">
            <div>
              <h2 className="text-4xl font-bold text-blue-400">500+</h2>

              <p className="mt-2 text-slate-300">Properties</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-400">1200+</h2>

              <p className="mt-2 text-slate-300">Happy Clients</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-400">25+</h2>

              <p className="mt-2 text-slate-300">Cities</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <FaMapMarkerAlt className="text-3xl text-blue-400" />
      </motion.div>
    </section>
  );
};

export default Hero;
