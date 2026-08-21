import { motion } from "framer-motion";

import {
  FaBuilding,
  FaHardHat,
  FaMoneyCheckAlt,
  FaCouch,
  FaTruckMoving,
  FaShieldAlt,
} from "react-icons/fa";

const partners = [
  {
    name: "Property Developers",
    // logo: "/images/partners/developer.png",
    icon: FaBuilding,
  },
  {
    name: "Construction Group",
    // logo: "/images/partners/construction.png",
    icon: FaHardHat,
  },
  {
    name: "Housing Finance",
    // logo: "/images/partners/bank.png",
    icon: FaMoneyCheckAlt,
  },
  {
    name: "Interior Design",
    // logo: "/images/partners/interior.png",
    icon: FaCouch,
  },
  {
    name: "Moving Services",
    // logo: "/images/partners/movers.png",
    icon: FaTruckMoving,
  },
  {
    name: "Property Insurance",
    // logo: "/images/partners/insurance.png",
    icon: FaShieldAlt,
  },
];

const Partners = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-600">
            Trusted Partners
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Working With Industry Leaders
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            We collaborate with trusted developers, financial institutions,
            contractors, and service providers to deliver quality rental
            solutions and exceptional customer experiences.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, index) => {
            const Icon = partner.icon;

            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="group flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="text-3xl transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Partner Name */}
                <h3 className="mt-5 text-sm font-semibold leading-5 text-slate-700">
                  {partner.name}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.8,
          }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-lg text-slate-600">
            Proudly partnering with leading organizations to provide reliable
            and professional rental services.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default Partners;