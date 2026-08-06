import { motion } from "framer-motion";
import {
  FaHome,
  FaMoneyBillWave,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaHome />,
    title: "Verified Properties",
    description:
      "Browse apartments, homes, offices and commercial spaces verified for quality and reliability.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Affordable Pricing",
    description:
      "Find rental properties that match your budget with transparent pricing and no hidden fees.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Transactions",
    description:
      "Enjoy a safe rental experience with trusted landlords and secure payment processes.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Customer Support",
    description:
      "Our experienced team is always available to help you find the perfect rental property.",
  },
];

const Features = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Why Choose Us
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Everything You Need to Find Your Next Rental
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            We make renting simple by providing verified listings, competitive
            prices, secure transactions, and exceptional customer service.
          </p>
        </motion.div>

        {/* Feature Cards */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
            >
              {/* Icon */}

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                {feature.icon}
              </div>

              {/* Title */}

              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              {/* Description */}

              <p className="mt-4 leading-7 text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
