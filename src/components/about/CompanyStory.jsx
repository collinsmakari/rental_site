import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";

const CompanyStory = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
  src="/properties/img-1.jpg"
  alt="Our Company"
  className="h-96 w-full rounded-2xl object-cover shadow-xl"
/>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <SectionTitle
            subtitle="Our Story"
            title="Helping People Find Places They Love"
           align="left"
          />

          <p className="mt-6 leading-8 text-slate-900">
            We started with one goal—to make renting homes, apartments, offices
            and commercial properties simple, transparent and affordable.
          </p>

          <p className="mt-3 leading-8 text-slate-900">
            Today we connect thousands of tenants with verified property owners
            while providing professional property management solutions in
            Nairobi City.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyStory;