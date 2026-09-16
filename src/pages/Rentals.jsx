import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import RentalHero from "../components/rentals/RentalHero";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";

const API_URL = `${import.meta.env.VITE_API_URL}/api/properties`;

const Rentals = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ===============================
  // URL PARAMETERS
  // ===============================

  const urlType = searchParams.get("type") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  // ===============================
  // PROPERTY STATE
  // ===============================

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  // GET PROPERTIES FROM BACKEND
  // ===============================

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Properties received:", data);

        // Backend returns:
        // {
        //   success: true,
        //   count: ...,
        //   properties: [...]
        // }

        setProperties(data.properties || []);
      } catch (error) {
        console.error(
          "Failed to fetch properties:",
          error
        );

        setError(
          "Unable to load properties. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
    setLocation(urlLocation);
    setMaxPrice(urlMaxPrice);
    setPropertyType(urlType);
    setSelectedCategory(urlType || "All");
  }, [urlType, urlLocation, urlMaxPrice]);

  // ===============================
  // FILTER PROPERTIES
  // ===============================

  const filteredProperties = properties.filter(
  (property) => {
    // ===============================
    // CATEGORY
    // ===============================

    const matchesCategory =
      selectedCategory === "All" ||
      property.propertyType === selectedCategory;

    // ===============================
    // LOCATION
    // ===============================

    const matchesLocation =
      location.trim() === "" ||
      property.location
        ?.toLowerCase()
        .includes(
          location.trim().toLowerCase()
        );

    // ===============================
    // PRICE
    // ===============================

    const matchesPrice =
      maxPrice === "" ||
      Number(property.price) <= Number(maxPrice);

    // ===============================
    // PROPERTY TYPE
    // ===============================

    const matchesPropertyType =
      propertyType === "" ||
      property.propertyType === propertyType;

    return (
      matchesCategory &&
      matchesLocation &&
      matchesPrice &&
      matchesPropertyType
    );
  }
);
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

    setSelectedCategory(
      propertyType || "All"
    );

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

  // ===============================
  // RENDER
  // ===============================

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

          {/* LOADING */}

          {loading && (
            <div className="py-16 text-center">
              <p className="text-slate-500">
                Loading properties...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <p className="text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* RESULTS */}

          {!loading && !error && (
            <>
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
            </>
          )}

        </section>
      </main>
    </div>
  );
};

export default Rentals;