import { motion } from "framer-motion";

const SectionTitle = ({ badge, title, subtitle, center = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`mb-16 ${center ? "mx-auto max-w-3xl text-center" : ""}`}
    >
      {badge && (
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
          {badge}
        </span>
      )}

      <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-5 text-lg leading-8 text-slate-600">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
