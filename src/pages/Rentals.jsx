import SEO from "../components/common/SEO";
import RentalHero from "../components/rentals/RentalHero";
import PropertySearch from "../components/rentals/PropertySearch";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";
import FeaturedRental from "../components/rentals/FeaturedRental";
import CTA from "../components/home/CTA";
import Pagination from "../components/rentals/Pagination";
import properties from "../data/properties";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Rentals = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters
  const urlType = searchParams.get("type") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  // Search state
  const [location, setLocation] = useState(urlLocation);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [propertyType, setPropertyType] = useState(urlType);

  // Category state
  const [selectedCategory, setSelectedCategory] = useState(
    urlType || "All"
  );

  // Detect search coming from Home page
  useEffect(() => {
    if (urlType || urlLocation || urlMaxPrice) {
      setLocation(urlLocation);
      setMaxPrice(urlMaxPrice);
      setPropertyType(urlType);
      setSelectedCategory(urlType || "All");

      const timer = setTimeout(() => {
        const results = document.getElementById("property-results");

        if (results) {
          results.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [urlType, urlLocation, urlMaxPrice]);

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesCategory =
      selectedCategory === "All" ||
      property.category === selectedCategory;

    const matchesLocation =
      location.trim() === "" ||
      property.location
        .toLowerCase()
        .includes(location.trim().toLowerCase());

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

  // Search button
  const handleSearch = () => {
    const params = {};

    if (propertyType) {
      params.type = propertyType;
    }

    if (location.trim()) {
      params.location = location.trim();
    }

    if (maxPrice) {
      params.maxPrice = maxPrice;
    }

    setSearchParams(params);

    setSelectedCategory(propertyType || "All");

    setTimeout(() => {
      document.getElementById("property-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setLocation("");
    setMaxPrice("");
    setPropertyType("");
    setSelectedCategory("All");

    setSearchParams({});

    setTimeout(() => {
      document.getElementById("property-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Category click
  const handleCategoryChange = (category) => {
    if (category === "All") {
      handleClearFilters();
      return;
    }

    setSelectedCategory(category);
    setPropertyType(category);

    const params = {
      type: category,
    };

    if (location.trim()) {
      params.location = location.trim();
    }

    if (maxPrice) {
      params.maxPrice = maxPrice;
    }

    setSearchParams(params);

    setTimeout(() => {
      document.getElementById("property-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

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
          onSearch={handleSearch}
        />

        {/* Sticky Categories */}
        <div className="sticky top-20 z-40 -mx-4 mt-8 border-b border-slate-200 bg-gray-50/95 px-4 py-4 shadow-sm backdrop-blur-md">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Property Results */}
        <section
          id="property-results"
          className="scroll-mt-36"
        >
          <div className="mb-5 mt-8">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredProperties.length}
              </span>{" "}
              {filteredProperties.length === 1
                ? "property"
                : "properties"}
            </p>
          </div>

          <PropertyGrid properties={filteredProperties} />
        </section>
      </main>
    </div>
  );
};

export default Rentals;