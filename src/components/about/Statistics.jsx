
import { motion } from "framer-motion";

const stats = [
  {
    value: "25+",
    label: "Properties",
  },
  {
    value: "100+",
    label: "Happy Clients",
  },
  {
    value: "50+",
    label: "Property Owners",
  },
  {
    value: "1+",
    label: "Years Experience",
  },
];

const Statistics = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
            >
              <h2 className="text-4xl font-bold text-blue-700 md:text-5xl">
                {stat.value}
              </h2>

              <p className="mt-3 text-base font-medium text-slate-600 md:text-lg">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
