import { motion } from "framer-motion";

const partners = [
  {
    name: "Property Developers",
    logo: "/images/partners/developer.png",
  },
  {
    name: "Construction Group",
    logo: "/images/partners/construction.png",
  },
  {
    name: "Housing Finance",
    logo: "/images/partners/bank.png",
  },
  {
    name: "Interior Design",
    logo: "/images/partners/interior.png",
  },
  {
    name: "Moving Services",
    logo: "/images/partners/movers.png",
  },
  {
    name: "Property Insurance",
    logo: "/images/partners/insurance.png",
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
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              className="group flex h-36 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-16 w-auto object-contain grayscale transition duration-300 group-hover:grayscale-0"
              />
            </motion.div>
          ))}
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
