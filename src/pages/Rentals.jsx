import SEO from "../components/common/SEO";
import RentalHero from "../components/rentals/RentalHero";
import PropertySearch from "../components/rentals/PropertySearch";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";
import FeaturedRental from "../components/rentals/FeaturedRental";
import CTA from "../components/home/CTA";
import Pagination from "../components/rentals/Pagination";
import properties from "../data/properties";

const Rentals = () => {
  return (
    <>
      <SEO
        title="Rental Properties"
        description="Find houses, apartments, bedsitters, offices and commercial rental properties."
      />

      <RentalHero />

      <PropertySearch />

      <CategoryFilter />

      <PropertyGrid properties={properties} />
      <Pagination />

      <FeaturedRental />

      <CTA />
    </>
  );
};

export default Rentals;
