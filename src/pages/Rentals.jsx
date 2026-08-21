import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import RentalHero from "../components/rentals/RentalHero";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";
import properties from "../data/properties";

const Rentals = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ===============================
  // URL PARAMETERS
  // ===============================

  const urlType = searchParams.get("type") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  // ===============================
  // SEARCH STATE
  // ===============================

  const [location, setLocation] = useState(urlLocation);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [propertyType, setPropertyType] = useState(urlType);

  // ===============================
  // CATEGORY STATE
  // ===============================

  const [selectedCategory, setSelectedCategory] = useState(
    urlType || "All"
  );

  // ===============================
  // SCROLL TO RESULTS
  // ===============================

  useEffect(() => {
    const hash = window.location.hash;

    if (hash === "#property-results") {
      const timer = setTimeout(() => {
        document
          .getElementById("property-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, []);

  // ===============================
  // HANDLE URL SEARCH
  // ===============================

  useEffect(() => {
    if (urlType || urlLocation || urlMaxPrice) {
      setLocation(urlLocation);
      setMaxPrice(urlMaxPrice);
      setPropertyType(urlType);
      setSelectedCategory(urlType || "All");

      const timer = setTimeout(() => {
        document
          .getElementById("property-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [urlType, urlLocation, urlMaxPrice]);

  // ===============================
  // FILTER PROPERTIES
  // ===============================

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

  // ===============================
  // SEARCH
  // ===============================

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
      document
        .getElementById("property-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // ===============================
  // CLEAR FILTERS
  // ===============================

  const handleClearFilters = () => {
    setLocation("");
    setMaxPrice("");
    setPropertyType("");
    setSelectedCategory("All");

    setSearchParams({});

    setTimeout(() => {
      document
        .getElementById("property-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // ===============================
  // CATEGORY CHANGE
  // ===============================

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
      document
        .getElementById("property-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===============================
          HERO
      =============================== */}

      <RentalHero />

      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ===============================
            STICKY CATEGORIES
        =============================== */}

        <div
          className="
            sticky
            top-20
            z-40
            -mx-4
            border-b
            border-slate-200
            bg-gray-50/95
            px-4
            py-3
            shadow-sm
            backdrop-blur-md
            sm:-mx-6
            sm:px-6
            lg:-mx-8
            lg:px-8
          "
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* ===============================
            PROPERTY RESULTS
        =============================== */}

        <section
          id="property-results"
          className="scroll-mt-32 pt-5"
        >

          {/* Result Count */}
          <div className="mb-4">
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

          {/* Property Grid */}
          <PropertyGrid
            properties={filteredProperties}
          />

        </section>
      </main>
    </div>
  );
};

export default Rentals;