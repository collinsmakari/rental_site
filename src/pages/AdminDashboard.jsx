import { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaSignOutAlt,
  FaSyncAlt,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHome,
  FaVideo,
  FaImages,
  FaStar,
  FaRegStar,
  FaExclamationTriangle,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  // ---------------------------------------------------------------------------
  // AUTH
  // ---------------------------------------------------------------------------

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  const clearAdminSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  const logout = () => {
    clearAdminSession();
    window.location.href = "/admin/login";
  };

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);

  const [actionLoading, setActionLoading] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [expandedProperty, setExpandedProperty] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});

  const [rejectingProperty, setRejectingProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [activeTab, setActiveTab] = useState("pending");

  // ---------------------------------------------------------------------------
  // ADMIN USER
  // ---------------------------------------------------------------------------

  const adminUser = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("adminUser");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to read admin user:", error);
      return null;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // CHECK AUTHENTICATION
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    fetchPendingProperties();
  }, []);

  // ---------------------------------------------------------------------------
  // AUTO CLEAR SUCCESS / ERROR MESSAGES
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!success && !error) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, error]);

  // ---------------------------------------------------------------------------
  // FETCH PENDING PROPERTIES
  // ---------------------------------------------------------------------------

  const fetchPendingProperties = async () => {
    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/properties/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAdminSession();
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(
          data.message || "Failed to fetch pending properties"
        );
      }

      setProperties(data.properties || []);
    } catch (error) {
      console.error(
        "Fetch pending properties error:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch pending properties"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // FETCH ALL PROPERTIES
  // ---------------------------------------------------------------------------

  const fetchAllProperties = async () => {
    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    try {
      setLoadingAll(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/properties`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAdminSession();
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(
          data.message || "Failed to fetch properties"
        );
      }

      setAllProperties(data.properties || []);
    } catch (error) {
      console.error(
        "Fetch all properties error:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch properties"
      );
    } finally {
      setLoadingAll(false);
    }
  };

  // ---------------------------------------------------------------------------
  // REFRESH DASHBOARD
  // ---------------------------------------------------------------------------

  const refreshDashboard = async () => {
    setSuccess("");
    setError("");

    await fetchPendingProperties();

    if (activeTab !== "pending") {
      await fetchAllProperties();
    }

    setSuccess("Dashboard refreshed successfully.");
  };

  // ---------------------------------------------------------------------------
  // APPROVE PROPERTY
  // ---------------------------------------------------------------------------

  const approveProperty = async (property) => {
    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    const confirmed = window.confirm(
      `Approve "${property.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(property._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/properties/${property._id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAdminSession();
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(
          data.message ||
            "Failed to approve property"
        );
      }

      // Remove from pending list immediately
      setProperties((previous) =>
        previous.filter(
          (item) => item._id !== property._id
        )
      );

      // Update all-properties list if already loaded
      setAllProperties((previous) =>
        previous.map((item) =>
          item._id === property._id
            ? {
                ...item,
                status: "approved",
              }
            : item
        )
      );

      setExpandedProperty(null);

      setSuccess(
        data.message ||
          "Property approved successfully."
      );
    } catch (error) {
      console.error(
        "Approve property error:",
        error
      );

      setError(
        error.message ||
          "Failed to approve property"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ---------------------------------------------------------------------------
  // OPEN REJECTION FORM
  // ---------------------------------------------------------------------------

  const openRejectForm = (property) => {
    setRejectingProperty(property);
    setRejectionReason("");
    setError("");
    setSuccess("");
  };

  // ---------------------------------------------------------------------------
  // CANCEL REJECTION
  // ---------------------------------------------------------------------------

  const cancelReject = () => {
    setRejectingProperty(null);
    setRejectionReason("");
  };

  // ---------------------------------------------------------------------------
  // REJECT PROPERTY
  // ---------------------------------------------------------------------------

  const rejectProperty = async () => {
    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    if (!rejectingProperty) {
      return;
    }

    if (!rejectionReason.trim()) {
      setError(
        "Please provide a rejection reason."
      );
      return;
    }

    try {
      setActionLoading(rejectingProperty._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/properties/${rejectingProperty._id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: rejectionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAdminSession();
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(
          data.message ||
            "Failed to reject property"
        );
      }

      // Remove from pending list
      setProperties((previous) =>
        previous.filter(
          (item) =>
            item._id !== rejectingProperty._id
        )
      );

      // Update all-properties list
      setAllProperties((previous) =>
        previous.map((item) =>
          item._id === rejectingProperty._id
            ? {
                ...item,
                status: "rejected",
                rejectionReason:
                  rejectionReason.trim(),
              }
            : item
        )
      );

      setExpandedProperty(null);
      setRejectingProperty(null);
      setRejectionReason("");

      setSuccess(
        data.message ||
          "Property rejected successfully."
      );
    } catch (error) {
      console.error(
        "Reject property error:",
        error
      );

      setError(
        error.message ||
          "Failed to reject property"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ---------------------------------------------------------------------------
  // TOGGLE FEATURED PROPERTY
  // ---------------------------------------------------------------------------

  const toggleFeatured = async (property) => {
    const token = getToken();

    if (!token) {
      logout();
      return;
    }

    if (property.status !== "approved") {
      setError(
        "Only approved properties can be featured."
      );
      return;
    }

    const currentlyFeatured =
      property.featured === true;

    const confirmed = window.confirm(
      currentlyFeatured
        ? `Remove "${property.title}" from featured properties?`
        : `Add "${property.title}" to featured properties?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setFeaturedLoading(property._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/properties/${property._id}/featured`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAdminSession();
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(
          data.message ||
            "Failed to update featured property"
        );
      }

      const updatedFeatured =
        data.property?.featured === true;

      // Update all properties
      setAllProperties((previous) =>
        previous.map((item) =>
          item._id === property._id
            ? {
                ...item,
                featured: updatedFeatured,
              }
            : item
        )
      );

      // Also update pending list if necessary
      setProperties((previous) =>
        previous.map((item) =>
          item._id === property._id
            ? {
                ...item,
                featured: updatedFeatured,
              }
            : item
        )
      );

      setSuccess(
        data.message ||
          (updatedFeatured
            ? "Property added to featured properties."
            : "Property removed from featured properties.")
      );
    } catch (error) {
      console.error(
        "Toggle featured property error:",
        error
      );

      setError(
        error.message ||
          "Failed to update featured property"
      );
    } finally {
      setFeaturedLoading(null);
    }
  };

  // ---------------------------------------------------------------------------
  // TOGGLE PROPERTY DETAILS
  // ---------------------------------------------------------------------------

  const toggleDetails = (propertyId) => {
    setExpandedProperty((previous) =>
      previous === propertyId
        ? null
        : propertyId
    );
  };

  // ---------------------------------------------------------------------------
  // IMAGE SELECTION
  // ---------------------------------------------------------------------------

  const selectImage = (propertyId, image) => {
    setSelectedImages((previous) => ({
      ...previous,
      [propertyId]: image,
    }));
  };

  // ---------------------------------------------------------------------------
  // TAB CHANGE
  // ---------------------------------------------------------------------------

  const changeTab = async (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
    setExpandedProperty(null);

    if (tab !== "pending") {
      await fetchAllProperties();
    }
  };

  // ---------------------------------------------------------------------------
  // DISPLAYED PROPERTIES
  // ---------------------------------------------------------------------------

  const displayedProperties = useMemo(() => {
    if (activeTab === "pending") {
      return properties;
    }

    if (activeTab === "approved") {
      return allProperties.filter(
        (property) =>
          property.status === "approved"
      );
    }

    if (activeTab === "rejected") {
      return allProperties.filter(
        (property) =>
          property.status === "rejected"
      );
    }

    return allProperties;
  }, [
    activeTab,
    properties,
    allProperties,
  ]);

  // ---------------------------------------------------------------------------
  // COUNTS
  // ---------------------------------------------------------------------------

  const pendingCount = properties.length;

  const approvedCount = allProperties.filter(
    (property) =>
      property.status === "approved"
  ).length;

  const rejectedCount = allProperties.filter(
    (property) =>
      property.status === "rejected"
  ).length;

  const featuredCount = allProperties.filter(
    (property) =>
      property.status === "approved" &&
      property.featured === true
  ).length;

  // ---------------------------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------------------------

  const currentLoading =
    activeTab === "pending"
      ? loading
      : loadingAll;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------------------ */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage property submissions
              and featured properties.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={refreshDashboard}
              disabled={
                loading ||
                loadingAll ||
                actionLoading !== null ||
                featuredLoading !== null
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
            >
              <FaSyncAlt
                className={
                  loading || loadingAll
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-4"
            >
              <FaSignOutAlt />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN */}
      {/* ------------------------------------------------------------------ */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Admin welcome */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Logged in as
            </p>

            <div className="flex items-center gap-2">
              <FaUser className="text-blue-600" />

              <span className="font-semibold text-slate-800">
                {adminUser?.username || "Admin"}
              </span>

              {adminUser?.role && (
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {adminUser.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* ALERTS */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />

            <p className="text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <FaCheck className="mt-0.5 shrink-0" />

            <p className="text-sm font-medium">
              {success}
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* STATISTICS */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-700">
              Pending
            </p>

            <p className="mt-1 text-3xl font-bold text-amber-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm font-medium text-green-700">
              Approved
            </p>

            <p className="mt-1 text-3xl font-bold text-green-900">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              Rejected
            </p>

            <p className="mt-1 text-3xl font-bold text-red-900">
              {rejectedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">
              Featured
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-900">
              {featuredCount}
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* TABS */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-2">
            <button
              type="button"
              onClick={() =>
                changeTab("pending")
              }
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === "pending"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pending
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {pendingCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("approved")
              }
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === "approved"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Approved
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {approvedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("rejected")
              }
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === "rejected"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Rejected
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {rejectedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("all")
              }
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {allProperties.length}
              </span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SECTION HEADER */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {activeTab === "pending" &&
                "Pending Property Submissions"}

              {activeTab === "approved" &&
                "Approved Properties"}

              {activeTab === "rejected" &&
                "Rejected Properties"}

              {activeTab === "all" &&
                "All Properties"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "pending" &&
                "Review properties before making them publicly visible."}

              {activeTab === "approved" &&
                "Manage approved properties and featured listings."}

              {activeTab === "rejected" &&
                "View properties that were rejected and their reasons."}

              {activeTab === "all" &&
                "View and manage all property submissions."}
            </p>
          </div>

          {activeTab === "approved" && (
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700">
              <FaStar />
              {featuredCount} Featured
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* LOADING */}
        {/* ---------------------------------------------------------------- */}

        {currentLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <FaSyncAlt className="mx-auto animate-spin text-2xl text-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading properties...
            </p>
          </div>
        ) : displayedProperties.length === 0 ? (
          /* -------------------------------------------------------------- */
          /* EMPTY STATE */
          /* -------------------------------------------------------------- */

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FaHome className="text-xl" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No properties found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {activeTab === "pending"
                ? "There are currently no properties waiting for approval."
                : activeTab === "approved"
                ? "There are currently no approved properties."
                : activeTab === "rejected"
                ? "There are currently no rejected properties."
                : "No properties have been submitted yet."}
            </p>
          </div>
        ) : (
          /* -------------------------------------------------------------- */
          /* PROPERTY LIST */
          /* -------------------------------------------------------------- */

          <div className="space-y-6">
            {displayedProperties.map(
              (property) => {
                const images =
                  Array.isArray(
                    property.images
                  )
                    ? property.images
                    : [];

                const videos =
                  Array.isArray(
                    property.videos
                  )
                    ? property.videos
                    : [];

                const amenities =
                  Array.isArray(
                    property.amenities
                  )
                    ? property.amenities
                    : [];

                const mainImage =
                  selectedImages[
                    property._id
                  ] ||
                  images[0] ||
                  null;

                const isExpanded =
                  expandedProperty ===
                  property._id;

                const isActionLoading =
                  actionLoading ===
                  property._id;

                const isFeaturedLoading =
                  featuredLoading ===
                  property._id;

                return (
                  <article
                    key={property._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    {/* -------------------------------------------------- */}
                    {/* PROPERTY TOP */}
                    {/* -------------------------------------------------- */}

                    <div className="p-5 sm:p-6">
                      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                        {/* IMAGE */}
                        <div>
                          <div className="relative overflow-hidden rounded-xl bg-slate-100">
                            {mainImage ? (
                              <img
                                src={mainImage}
                                alt={
                                  property.title
                                }
                                className="h-64 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                                No image
                              </div>
                            )}

                            {/* Featured badge */}
                            {property.featured ===
                              true && (
                              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-950 shadow">
                                <FaStar />
                                Featured
                              </div>
                            )}

                            {/* Status badge */}
                            <div
                              className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold capitalize shadow ${
                                property.status ===
                                "approved"
                                  ? "bg-green-100 text-green-700"
                                  : property.status ===
                                    "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {property.status}
                            </div>
                          </div>

                          {/* IMAGE THUMBNAILS */}
                          {images.length >
                            1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                              {images.map(
                                (
                                  image,
                                  index
                                ) => (
                                  <button
                                    type="button"
                                    key={`${property._id}-image-${index}`}
                                    onClick={() =>
                                      selectImage(
                                        property._id,
                                        image
                                      )
                                    }
                                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                                      mainImage ===
                                      image
                                        ? "border-blue-600"
                                        : "border-transparent"
                                    }`}
                                  >
                                    <img
                                      src={image}
                                      alt={`Property ${
                                        index + 1
                                      }`}
                                      className="h-full w-full object-cover"
                                    />
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          {/* MEDIA COUNT */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              <FaImages />
                              {images.length}{" "}
                              image
                              {images.length !==
                              1
                                ? "s"
                                : ""}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              <FaVideo />
                              {videos.length}{" "}
                              video
                              {videos.length !==
                              1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                        </div>

                        {/* PROPERTY INFO */}
                        <div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">
                                {property.title}
                              </h3>

                              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                <FaMapMarkerAlt className="text-blue-600" />
                                {property.location ||
                                  "Location not provided"}
                              </p>
                            </div>

                            {/* Featured status */}
                            {property.status ===
                              "approved" && (
                              <div
                                className={`inline-flex self-start items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                                  property.featured
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {property.featured ? (
                                  <>
                                    <FaStar />
                                    Featured
                                  </>
                                ) : (
                                  <>
                                    <FaRegStar />
                                    Not Featured
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* PROPERTY DETAILS GRID */}
                          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Monthly Rent
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                KSh{" "}
                                {Number(
                                  property.price || 0
                                ).toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Deposit
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                KSh{" "}
                                {Number(
                                  property.deposit ||
                                    0
                                ).toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Viewing Fee
                              </p>

                              <p className="mt-1 font-bold text-blue-600">
                                KSh{" "}
                                {Number(
                                  property.viewingFee ||
                                    0
                                ).toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Property Type
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {property.propertyType ||
                                  "N/A"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Bedrooms
                              </p>

                              <p className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                                <FaBed className="text-blue-600" />
                                {property.bedrooms ??
                                  0}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Bathrooms
                              </p>

                              <p className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                                <FaBath className="text-blue-600" />
                                {property.bathrooms ??
                                  0}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Area
                              </p>

                              <p className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                                <FaRulerCombined className="text-blue-600" />
                                {property.area ??
                                  0}{" "}
                                m²
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Furnished
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {property.furnished
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">
                                Available
                              </p>

                              <p className="mt-1 font-bold text-slate-900">
                                {property.available
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                          </div>

                          {/* DESCRIPTION */}
                          <div className="mt-5">
                            <p className="text-sm leading-6 text-slate-600">
                              {property.description ||
                                "No description provided."}
                            </p>
                          </div>

                          {/* ------------------------------------------------ */}
                          {/* ACTION BUTTONS */}
                          {/* ------------------------------------------------ */}

                          <div className="mt-6 flex flex-wrap gap-3">
                            {/* APPROVE */}
                            {property.status ===
                              "pending" && (
                              <button
                                type="button"
                                onClick={() =>
                                  approveProperty(
                                    property
                                  )
                                }
                                disabled={
                                  isActionLoading ||
                                  isFeaturedLoading
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <FaCheck />

                                {isActionLoading
                                  ? "Processing..."
                                  : "Approve"}
                              </button>
                            )}

                            {/* REJECT */}
                            {property.status ===
                              "pending" && (
                              <button
                                type="button"
                                onClick={() =>
                                  openRejectForm(
                                    property
                                  )
                                }
                                disabled={
                                  isActionLoading
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <FaTimes />
                                Reject
                              </button>
                            )}

                            {/* FEATURED */}
                            {property.status ===
                              "approved" && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleFeatured(
                                    property
                                  )
                                }
                                disabled={
                                  isFeaturedLoading ||
                                  isActionLoading
                                }
                                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                  property.featured
                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                {property.featured ? (
                                  <FaStar />
                                ) : (
                                  <FaRegStar />
                                )}

                                {isFeaturedLoading
                                  ? "Updating..."
                                  : property.featured
                                  ? "Remove from Featured"
                                  : "Add to Featured"}
                              </button>
                            )}

                            {/* VIEW DETAILS */}
                            <button
                              type="button"
                              onClick={() =>
                                toggleDetails(
                                  property._id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              {isExpanded ? (
                                <>
                                  <FaChevronUp />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <FaChevronDown />
                                  View Full Review Details
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ------------------------------------------------------ */}
                    {/* EXPANDED DETAILS */}
                    {/* ------------------------------------------------------ */}

                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                          {/* AMENITIES */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h4 className="font-bold text-slate-900">
                              Amenities
                            </h4>

                            {amenities.length >
                            0 ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {amenities.map(
                                  (
                                    amenity,
                                    index
                                  ) => (
                                    <span
                                      key={`${property._id}-amenity-${index}`}
                                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                    >
                                      {amenity}
                                    </span>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                No amenities
                                provided.
                              </p>
                            )}
                          </div>

                          {/* PROPERTY STATUS */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h4 className="font-bold text-slate-900">
                              Property Status
                            </h4>

                            <div className="mt-3 space-y-2 text-sm">
                              <p>
                                <strong>
                                  Approval:
                                </strong>{" "}
                                <span className="capitalize">
                                  {property.status}
                                </span>
                              </p>

                              <p>
                                <strong>
                                  Featured:
                                </strong>{" "}
                                {property.featured
                                  ? "Yes"
                                  : "No"}
                              </p>

                              <p>
                                <strong>
                                  Available:
                                </strong>{" "}
                                {property.available
                                  ? "Yes"
                                  : "No"}
                              </p>

                              {property.rejectionReason && (
                                <div className="mt-3 rounded-lg bg-red-50 p-3 text-red-700">
                                  <p className="text-xs font-bold uppercase">
                                    Rejection Reason
                                  </p>

                                  <p className="mt-1 text-sm">
                                    {
                                      property.rejectionReason
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* LANDLORD */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h4 className="font-bold text-slate-900">
                              Landlord Information
                            </h4>

                            <div className="mt-3 space-y-3 text-sm text-slate-600">
                              <p className="flex items-center gap-2">
                                <FaUser className="text-blue-600" />

                                <span>
                                  {property.landlordName ||
                                    "Not provided"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaPhone className="text-blue-600" />

                                <span>
                                  {property.landlordPhone ||
                                    "Not provided"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2 break-all">
                                <FaEnvelope className="text-blue-600" />

                                <span>
                                  {property.landlordEmail ||
                                    "Not provided"}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* CARETAKER */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h4 className="font-bold text-slate-900">
                              Caretaker Information
                            </h4>

                            <div className="mt-3 space-y-3 text-sm text-slate-600">
                              <p className="flex items-center gap-2">
                                <FaUser className="text-blue-600" />

                                <span>
                                  {property.caretakerName ||
                                    "Not provided"}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FaPhone className="text-blue-600" />

                                <span>
                                  {property.caretakerPhone ||
                                    "Not provided"}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* MAP */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h4 className="font-bold text-slate-900">
                              Location / Map
                            </h4>

                            {property.mapUrl ? (
                              <a
                                href={
                                  property.mapUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-blue-600 hover:underline"
                              >
                                <FaMapMarkerAlt />
                                Open Map Location
                              </a>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                No map URL
                                provided.
                              </p>
                            )}
                          </div>

                          {/* VIDEOS */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h4 className="font-bold text-slate-900">
                              Videos
                            </h4>

                            {videos.length >
                            0 ? (
                              <div className="mt-3 space-y-2">
                                {videos.map(
                                  (
                                    video,
                                    index
                                  ) => (
                                    <a
                                      key={`${property._id}-video-${index}`}
                                      href={
                                        video
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 break-all text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                      <FaVideo />
                                      Video{" "}
                                      {index +
                                        1}
                                    </a>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                No videos
                                provided.
                              </p>
                            )}
                          </div>

                          {/* ALL IMAGES */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
                            <h4 className="font-bold text-slate-900">
                              Property Images
                            </h4>

                            {images.length >
                            0 ? (
                              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {images.map(
                                  (
                                    image,
                                    index
                                  ) => (
                                    <a
                                      key={`${property._id}-full-image-${index}`}
                                      href={
                                        image
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group overflow-hidden rounded-xl border border-slate-200"
                                    >
                                      <img
                                        src={
                                          image
                                        }
                                        alt={`${property.title} ${
                                          index +
                                          1
                                        }`}
                                        className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                                      />
                                    </a>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="mt-3 text-sm text-slate-500">
                                No images
                                provided.
                              </p>
                            )}
                          </div>

                          {/* SUBMISSION DATE */}
                          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
                            <h4 className="font-bold text-slate-900">
                              Submission Information
                            </h4>

                            <p className="mt-2 text-sm text-slate-600">
                              Submitted:{" "}
                              {property.createdAt
                                ? new Date(
                                    property.createdAt
                                  ).toLocaleString()
                                : "Date not available"}
                            </p>

                            {property.updatedAt && (
                              <p className="mt-1 text-sm text-slate-600">
                                Last updated:{" "}
                                {new Date(
                                  property.updatedAt
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* REJECTION MODAL */}
      {/* ------------------------------------------------------------------ */}

      {rejectingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Reject Property
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Provide a reason for rejecting
                    this property.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cancelReject}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-5 sm:p-6">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {rejectingProperty.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {rejectingProperty.location}
                </p>
              </div>

              <label
                htmlFor="rejectionReason"
                className="mt-5 block text-sm font-semibold text-slate-700"
              >
                Rejection Reason
              </label>

              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Explain why this property is being rejected..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                The rejection reason will be saved with
                the property for future reference.
              </p>
            </div>

            {/* Modal footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={cancelReject}
                disabled={
                  actionLoading ===
                  rejectingProperty._id
                }
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={rejectProperty}
                disabled={
                  actionLoading ===
                    rejectingProperty._id ||
                  !rejectionReason.trim()
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaTimes />

                {actionLoading ===
                rejectingProperty._id
                  ? "Rejecting..."
                  : "Reject Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;