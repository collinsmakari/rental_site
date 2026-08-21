import { motion } from "framer-motion";
import Button from "../common/Button";

const RentalHero = () => {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      <img
        src="/properties/img-1.jpg"
        alt="Rental Properties"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white"
        >
          Find Your Perfect Rental Home
        </motion.h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-200">
          Browse apartments, bedsitters, studios, maisonettes and family homes.
        </p>

        <div className="mt-8">
  <Button to="/rentals">
    Browse Rentals
  </Button>
</div>
      </div>
    </section>
  );
};

export default RentalHero;
