import { motion } from "framer-motion";
import { FaBullseye, FaEye, FaHandshake } from "react-icons/fa";
import SectionTitle from "../common/SectionTitle";

const cards = [
  {
    icon: <FaBullseye />,
    title: "Our Mission",
    text: "Deliver quality rental solutions that simplify property search and management.",
  },
  {
    icon: <FaEye />,
    title: "Our Vision",
    text: "Become the most trusted real estate rental platform in Africa.",
  },
  {
    icon: <FaHandshake />,
    title: "Our Values",
    text: "Integrity, transparency, professionalism and customer satisfaction.",
  },
];

const MissionVision = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container-custom">
        <SectionTitle
          subtitle="What Drives Us"
          title="Mission, Vision & Values"
          center
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="rounded-2xl bg-white p-8 shadow-lg transition hover:-translate-y-2"
            >
              <div className="mb-5 text-4xl text-primary">{item.icon}</div>

              <h3 className="mb-4 text-2xl font-bold">{item.title}</h3>

              <p className="leading-7 text-slate-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
