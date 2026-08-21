import SEO from "../components/common/SEO";
import RentalHero from "../components/rentals/RentalHero";
import PropertySearch from "../components/rentals/PropertySearch";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";
import FeaturedRental from "../components/rentals/FeaturedRental";
import CTA from "../components/home/CTA";
import Pagination from "../components/rentals/Pagination";
import properties from "../data/properties";
import { useState } from "react";


const Rentals = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Clear ALL filters
  const handleClearFilters = () => {
    setSelectedCategory("All");
    setLocation("");
    setMaxPrice("");
    setPropertyType("");
  };

  const filteredProperties = properties.filter((property) => {
    const matchesCategory =
      selectedCategory === "All" ||
      property.category === selectedCategory;

    const matchesLocation =
      location.trim() === "" ||
      property.location
        .toLowerCase()
        .includes(location.toLowerCase().trim());

    const matchesPrice =
      maxPrice === "" ||
      property.price <= Number(maxPrice);

    const matchesPropertyType =
      propertyType === "" ||
      property.category === propertyType;

    return (
      matchesCategory &&
      matchesLocation &&
      matchesPrice &&
      matchesPropertyType
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <RentalHero />

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Search */}
        <PropertySearch
          location={location}
          maxPrice={maxPrice}
          propertyType={propertyType}
          onLocationChange={setLocation}
          onMaxPriceChange={setMaxPrice}
          onPropertyTypeChange={setPropertyType}
        />

        {/* Category Filter */}
        <div className="mt-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              if (category === "All") {
                handleClearFilters();
              } else {
                setSelectedCategory(category);
              }
            }}
          />
        </div>

        {/* Results */}
        <div className="mt-8">
          <PropertyGrid properties={filteredProperties} />
        </div>
      </main>
    </div>
  );
};

export default Rentals;