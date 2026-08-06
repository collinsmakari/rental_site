import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaBuilding,
  FaClock,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaShieldAlt />,
    title: "Trusted & Secure",
    description:
      "Every property is carefully verified to ensure quality, safety, and peace of mind.",
  },
  {
    icon: <FaBuilding />,
    title: "Wide Property Selection",
    description:
      "Browse apartments, houses, offices, commercial spaces, and vacation rentals in prime locations.",
  },
  {
    icon: <FaClock />,
    title: "Fast & Simple Process",
    description:
      "Search, schedule viewings, and secure your rental quickly with a streamlined booking process.",
  },
  {
    icon: <FaUsers />,
    title: "Dedicated Support",
    description:
      "Our experienced team is available to guide you from your first search to moving in.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        {/* Left Image */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src="/images/img-1.jpg"
            alt="Modern rental property"
            className="rounded-3xl shadow-2xl"
          />

          {/* Floating Experience Card */}

          <div className="absolute -bottom-8 left-8 rounded-2xl bg-blue-600 px-8 py-6 text-white shadow-xl">
            <h3 className="text-3xl font-bold">10+</h3>

            <p className="mt-1">Years Experience</p>
          </div>
        </motion.div>

        {/* Right Content */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Why Choose Us
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Your Trusted Partner for Rental Properties
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Whether you're looking for your next apartment, family home, office,
            or commercial space, we make the rental journey simple, transparent,
            and stress-free with trusted listings and exceptional customer
            service.
          </p>

          {/* Benefits */}

          <div className="mt-10 space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                }}
                viewport={{ once: true }}
                className="flex gap-5 rounded-2xl border border-slate-200 p-6 transition duration-300 hover:border-blue-600 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
                  {benefit.icon}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Highlights */}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-slate-700">Verified Listings</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-slate-700">Transparent Pricing</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-slate-700">Professional Support</span>
            </div>

            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-slate-700">Flexible Rental Options</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
