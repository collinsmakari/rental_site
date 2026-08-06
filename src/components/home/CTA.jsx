import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/cta-bg.jpg"
          alt="Modern rental property"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80" />
      </div>

      {/* Decorative Glow */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-lg lg:p-16"
        >
          <span className="inline-block rounded-full bg-blue-600/20 px-5 py-2 text-sm font-semibold text-blue-400">
            Find Your Perfect Home Today
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Ready to Move Into Your Next Rental?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Browse quality apartments, family homes, commercial spaces and
            furnished rentals. Our team is ready to help you find a property
            that matches your lifestyle and budget.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              to="/properties"
              className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Properties
              <FaArrowRight />
            </Link>

            <Link
              to="/contact"
              className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:border-blue-500 hover:bg-blue-500/10"
            >
              Contact Us
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
            <div>
              <h3 className="text-3xl font-bold text-blue-400">500+</h3>
              <p className="mt-2 text-slate-300">Available Rentals</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-blue-400">1,200+</h3>
              <p className="mt-2 text-slate-300">Happy Tenants</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-blue-400">98%</h3>
              <p className="mt-2 text-slate-300">Customer Satisfaction</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-blue-400">24/7</h3>
              <p className="mt-2 text-slate-300">Customer Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
