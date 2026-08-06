import { motion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";

const CompanyStory = () => {
  return (
    <section className="bg-white py-20">
      <div className="container-custom grid items-center gap-12 lg:grid-cols-2">
        {/* Image */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="/images/about/company-story.jpg"
            alt="Our Company"
            className="h-full w-full rounded-2xl object-cover shadow-xl"
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
          />

          <p className="mt-6 text-slate-600 leading-8">
            We started with one goal—to make renting homes, apartments, offices
            and commercial properties simple, transparent and affordable.
          </p>

          <p className="mt-5 text-slate-600 leading-8">
            Today we connect thousands of tenants with verified property owners
            while providing professional property management solutions across
            the country.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyStory;
