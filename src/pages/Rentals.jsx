import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/common/SEO";
import RentalHero from "../components/rentals/RentalHero";
import CategoryFilter from "../components/rentals/CategoryFilter";
import PropertyGrid from "../components/rentals/PropertyGrid";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/properties`;

const CACHE_KEY = "rentme_properties_cache";

const Rentals = () => {
  console.log("🔥 RENTALS COMPONENT IS RUNNING");

  const [searchParams, setSearchParams] = useSearchParams();

  // ===============================
  // URL PARAMETERS
  // ===============================

  const urlType = searchParams.get("type") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  // ===============================
  // LOAD CACHED PROPERTIES
  // ===============================

  const getCachedProperties = () => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);

      if (!cached) {
        return [];
      }

      const parsed = JSON.parse(cached);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to read property cache:", error);
      return [];
    }
  };

  // ===============================
  // PROPERTY STATE
  // ===============================

  const cachedProperties = getCachedProperties();

  const [properties, setProperties] = useState(cachedProperties);

  const [loading, setLoading] = useState(
    cachedProperties.length === 0
  );

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
  // GET PROPERTIES
  // ===============================

  useEffect(() => {
    let cancelled = false;

    const fetchProperties = async () => {
      console.log("🔥 FETCH STARTED");

      const startTime = performance.now();

      try {
        // Only show the loading state when there
        // are no properties available yet.
        if (properties.length === 0) {
          setLoading(true);
        }

        setError("");

        console.log("🌐 Fetching:", API_URL);

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        console.log(
          "📡 RESPONSE RECEIVED:",
          response.status,
          `${Math.round(performance.now() - startTime)}ms`
        );

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "📦 JSON RECEIVED:",
          `${Math.round(performance.now() - startTime)}ms`
        );

        const freshProperties = Array.isArray(data.properties)
          ? data.properties
          : [];

        console.log(
          "📊 PROPERTY COUNT:",
          freshProperties.length
        );

        if (cancelled) {
          return;
        }

        // Update React state immediately
        setProperties(freshProperties);

        // Save latest data for instant future loads
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify(freshProperties)
          );
        } catch (cacheError) {
          console.warn(
            "Could not cache properties:",
            cacheError
          );
        }

        console.log(
          "✅ PROPERTIES UPDATED:",
          `${Math.round(performance.now() - startTime)}ms`
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "❌ FAILED TO FETCH PROPERTIES:",
          error
        );

        // Only show an error if we have no cached data
        if (properties.length === 0) {
          setError(
            "Unable to load properties. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);

          console.log(
            "🔓 LOADING COMPLETE:",
            `${Math.round(performance.now() - startTime)}ms`
          );
        }
      }
    };

    fetchProperties();

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const filteredProperties = properties.filter((property) => {
    // CATEGORY
    const matchesCategory =
      selectedCategory === "All" ||
      String(property.propertyType || "").toLowerCase() ===
        String(selectedCategory).toLowerCase();

    // LOCATION
    const propertyLocation = String(
      property.location || ""
    ).toLowerCase();

    const searchLocation = location
      .trim()
      .toLowerCase();

    const matchesLocation =
      searchLocation === "" ||
      propertyLocation.includes(searchLocation);

    // PRICE
    const propertyPrice = Number(property.price);
    const maximumPrice = Number(maxPrice);

    const matchesPrice =
      maxPrice === "" ||
      (Number.isFinite(propertyPrice) &&
        Number.isFinite(maximumPrice) &&
        propertyPrice <= maximumPrice);

    return (
      matchesCategory &&
      matchesLocation &&
      matchesPrice
    );
  });

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
          SEO
      =============================== */}

      <SEO
        title="Rental Properties in Kenya | Apartments, Houses & Bedsitters | RentMe"
        description="Find apartments, houses, bedsitters, studios, maisonettes and other rental properties in Kenya. Browse available properties by location, property type and price on RentMe."
        keywords="rental properties Kenya, apartments for rent Kenya, houses for rent Kenya, bedsitters for rent Kenya, studios for rent Kenya, maisonettes for rent Kenya, property rentals Kenya"
      />

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
              ERROR
          =============================== */}

          {error && properties.length === 0 && (
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
              INITIAL LOADING
          =============================== */}

          {loading && properties.length === 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-sm
                    animate-pulse
                  "
                >
                  <div className="h-64 bg-slate-200" />

                  <div className="space-y-4 p-5">

                    <div className="h-5 w-3/4 rounded bg-slate-200" />

                    <div className="h-4 w-1/2 rounded bg-slate-200" />

                    <div className="h-4 w-2/3 rounded bg-slate-200" />

                    <div className="h-10 w-full rounded bg-slate-200" />

                  </div>
                </div>
              ))}

            </div>
          )}

          {/* ===============================
              RESULTS
          =============================== */}

          {!error && properties.length > 0 && (
            <>
              {/* RESULT COUNT */}

              <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredProperties.length}
                  </span>{" "}
                  {filteredProperties.length === 1
                    ? "property"
                    : "properties"}
                </p>

                {/* Background refresh indicator */}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                    Updating...
                  </div>
                )}

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