import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/common/SEO";
import RentalHero from "../components/rentals/RentalHero";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/properties`;

const FETCH_TIMEOUT = 15000;

const Rentals = () => {
  console.log("🔥 RENTALS COMPONENT IS RUNNING");

  const [searchParams, setSearchParams] = useSearchParams();

  // =====================================================
  // URL PARAMETERS
  // =====================================================

  const urlType = searchParams.get("type") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  // =====================================================
  // PROPERTY STATE
  // =====================================================

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // SEARCH STATE
  // =====================================================

  const [location, setLocation] = useState(urlLocation);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [propertyType, setPropertyType] = useState(urlType);

  // =====================================================
  // CATEGORY STATE
  // =====================================================

  const [selectedCategory, setSelectedCategory] = useState(
    urlType || "All"
  );

  // =====================================================
  // FETCH PROPERTIES
  // =====================================================

const fetchProperties = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

   const startTime = performance.now();

console.log(
  "📡 Fetching properties from:",
  API_URL
);

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status}`
      );
    }

    const data = await response.json();

    const endTime = performance.now();

console.log(
  `⏱️ Properties API: ${(endTime - startTime).toFixed(0)} ms`
);

    if (!Array.isArray(data?.properties)) {
      throw new Error(
        "Invalid property data received from server."
      );
    }

    setProperties(data.properties);
  } catch (error) {
    console.error(
      "❌ Failed to fetch properties:",
      error
    );

    setError(
      "Unable to load properties. Please try again."
    );
  } finally {
    setLoading(false);
  }
}, []);
  // =====================================================
  // LOAD PROPERTIES ONCE
  // =====================================================

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // =====================================================
  // SYNCHRONIZE URL WITH STATE
  // =====================================================

  useEffect(() => {
    setLocation(urlLocation);
    setMaxPrice(urlMaxPrice);
    setPropertyType(urlType);
    setSelectedCategory(urlType || "All");
  }, [urlType, urlLocation, urlMaxPrice]);

  // =====================================================
  // SCROLL TO RESULTS
  // =====================================================

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

  // =====================================================
  // FILTER PROPERTIES
  // =====================================================

  const filteredProperties = properties.filter(
    (property) => {
      // -----------------------------------------------
      // CATEGORY
      // -----------------------------------------------

      const matchesCategory =
        selectedCategory === "All" ||
        String(property.propertyType || "").toLowerCase() ===
          String(selectedCategory).toLowerCase();

      // -----------------------------------------------
      // LOCATION
      // -----------------------------------------------

      const propertyLocation = String(
        property.location || ""
      ).toLowerCase();

      const searchLocation = location
        .trim()
        .toLowerCase();

      const matchesLocation =
        searchLocation === "" ||
        propertyLocation.includes(searchLocation);

      // -----------------------------------------------
      // PRICE
      // -----------------------------------------------

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

  // =====================================================
  // SCROLL HELPER
  // =====================================================

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

  // =====================================================
  // HANDLE SEARCH
  // =====================================================

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

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setLocation("");
    setMaxPrice("");
    setPropertyType("");
    setSelectedCategory("All");

    setSearchParams({});

    scrollToResults();
  };

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

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

    scrollToResults();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =================================================
          SEO
      ================================================= */}

      <SEO
        title="Rental Properties in Kenya | Apartments, Houses & Bedsitters | RentMe"
        description="Find apartments, houses, bedsitters, studios, maisonettes and other rental properties in Kenya. Browse available properties by location, property type and price on RentMe."
        keywords="rental properties Kenya, apartments for rent Kenya, houses for rent Kenya, bedsitters for rent Kenya, studios for rent Kenya, maisonettes for rent Kenya, property rentals Kenya"
      />

      {/* =================================================
          HERO
      ================================================= */}

      <RentalHero />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================
            STICKY CATEGORIES
        ================================================= */}

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

        {/* =================================================
            PROPERTY RESULTS
        ================================================= */}

        <section
          id="property-results"
          className="scroll-mt-32 pt-5"
        >

          {/* =================================================
              LOADING SKELETON
          ================================================= */}

          {loading && (
            <div className="space-y-6">

              {/* Loading message */}

              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                  Loading properties...
                </div>
              </div>

              {/* Skeleton cards */}

              <div className="
                grid
                grid-cols-1
                gap-6
                sm:grid-cols-2
                lg:grid-cols-3
              ">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="
                      overflow-hidden
                      rounded-xl
                      bg-white
                      shadow-sm
                    "
                  >
                    {/* Image */}

                    <div className="
                      h-64
                      animate-pulse
                      bg-slate-200
                    " />

                    {/* Content */}

                    <div className="space-y-4 p-5">

                      <div className="
                        h-5
                        w-3/4
                        animate-pulse
                        rounded
                        bg-slate-200
                      " />

                      <div className="
                        h-4
                        w-1/2
                        animate-pulse
                        rounded
                        bg-slate-200
                      " />

                      <div className="
                        h-4
                        w-2/3
                        animate-pulse
                        rounded
                        bg-slate-200
                      " />

                      <div className="
                        h-10
                        w-full
                        animate-pulse
                        rounded-lg
                        bg-slate-200
                      " />

                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="
              rounded-xl
              border
              border-red-100
              bg-white
              px-6
              py-12
              text-center
              shadow-sm
            ">

              <div className="
                mx-auto
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-500
              ">
                !
              </div>

              <h3 className="
                text-lg
                font-semibold
                text-slate-800
              ">
                Properties couldn't be loaded
              </h3>

              <p className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                text-slate-500
              ">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchProperties}
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
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              RESULTS
          ================================================= */}

          {!loading && !error && (
            <>

              {/* RESULT COUNT */}

              <div className="mb-4">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="
                    font-semibold
                    text-slate-800
                  ">
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
                <div className="
                  rounded-xl
                  bg-white
                  px-6
                  py-16
                  text-center
                  shadow-sm
                ">

                  <h3 className="
                    text-lg
                    font-semibold
                    text-slate-800
                  ">
                    No properties found
                  </h3>

                  <p className="
                    mt-2
                    text-sm
                    text-slate-500
                  ">
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