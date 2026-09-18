import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import RentalHero from "../components/rentals/RentalHero";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/properties`;

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

        // Backend response:
        // {
        //   success: true,
        //   count: ...,
        //   properties: [...]
        // }

        setProperties(
          Array.isArray(data.properties)
            ? data.properties
            : []
        );
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
  // SYNCHRONIZE URL WITH STATE
  // ===============================

  useEffect(() => {
    setLocation(urlLocation);
    setMaxPrice(urlMaxPrice);
    setPropertyType(urlType);
    setSelectedCategory(urlType || "All");
  }, [urlType, urlLocation, urlMaxPrice]);

  // ===============================
  // SCROLL TO RESULTS
  // ===============================

  useEffect(() => {
    if (window.location.hash !== "#property-results") {
      return;
    }

    const timer = setTimeout(() => {
      document
        .getElementById("property-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

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
        String(property.propertyType || "").toLowerCase() ===
          String(selectedCategory).toLowerCase();

      // ===============================
      // LOCATION
      // ===============================

      const propertyLocation = String(
        property.location || ""
      ).toLowerCase();

      const searchLocation = location
        .trim()
        .toLowerCase();

      const matchesLocation =
        searchLocation === "" ||
        propertyLocation.includes(searchLocation);

      // ===============================
      // PRICE
      // ===============================

      const propertyPrice = Number(property.price);
      const maximumPrice = Number(maxPrice);

      const matchesPrice =
        maxPrice === "" ||
        (
          Number.isFinite(propertyPrice) &&
          Number.isFinite(maximumPrice) &&
          propertyPrice <= maximumPrice
        );

      return (
        matchesCategory &&
        matchesLocation &&
        matchesPrice
      );
    }
  );

  // ===============================
  // SCROLL HELPER
  // ===============================

  const scrollToResults = () => {
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
  // HANDLE SEARCH
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

    scrollToResults();
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

    scrollToResults();
  };

  // ===============================
  // CATEGORY CHANGE
  // ===============================

  const handleCategoryChange = (category) => {
    // ALL
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

    scrollToResults();
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

          {/* ===============================
              LOADING
          =============================== */}

          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-slate-500">
                Loading properties...
              </p>
            </div>
          )}

          {/* ===============================
              ERROR
          =============================== */}

          {!loading && error && (
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <p className="mb-4 text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Try Again
              </button>
            </div>
          )}

          {/* ===============================
              RESULTS
          =============================== */}

          {!loading && !error && (
            <>
              {/* RESULT COUNT */}

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

              {/* PROPERTY GRID */}

              {filteredProperties.length > 0 ? (
                <PropertyGrid
                  properties={filteredProperties}
                />
              ) : (
                <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800">
                    No properties found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try changing your location, property
                    type, or maximum price.
                  </p>

                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="
                      mt-5
                      rounded-lg
                      bg-blue-600
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-blue-700
                    "
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}

        </section>
      </main>
    </div>
  );
};

export default Rentals;