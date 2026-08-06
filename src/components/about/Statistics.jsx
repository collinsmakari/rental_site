import { motion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  {
    value: 2500,
    suffix: "+",
    label: "Properties",
  },
  {
    value: 1800,
    suffix: "+",
    label: "Happy Clients",
  },
  {
    value: 150,
    suffix: "+",
    label: "Property Owners",
  },
  {
    value: 12,
    suffix: "+",
    label: "Years Experience",
  },
];

const Statistics = () => {
  return (
    <section className="bg-primary py-20 text-white">
      <div className="container-custom">
        <div className="grid gap-10 text-center md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-5xl font-bold">
                <CountUp end={item.value} duration={2.5} />

                {item.suffix}
              </h2>

              <p className="mt-3 text-lg text-slate-200">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
