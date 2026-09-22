import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const [rejectingProperty, setRejectingProperty] =
    useState(null);
  const [rejectionReason, setRejectionReason] =
    useState("");

  // ==========================================
  // AUTHENTICATION
  // ==========================================

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

  // ==========================================
  // FETCH PENDING PROPERTIES
  // ==========================================

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

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

      if (response.status === 401) {
        clearAdminSession();
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load pending properties."
        );
      }

      setProperties(data.properties || []);

      // Select first image automatically
      const imageSelections = {};

      (data.properties || []).forEach((property) => {
        if (property.images?.length > 0) {
          imageSelections[property._id] =
            property.images[0];
        }
      });

      setSelectedImages(imageSelections);
    } catch (error) {
      console.error(
        "Fetch pending properties error:",
        error
      );

      setError(
        error.message ||
          "Failed to load pending properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  // ==========================================
  // APPROVE PROPERTY
  // ==========================================

  const approveProperty = async (property) => {
    const confirmed = window.confirm(
      `Approve "${property.title}" and make it available on the public rental listings?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(property._id);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        clearAdminSession();
        window.location.href = "/admin/login";
        return;
      }

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

      if (response.status === 401) {
        clearAdminSession();
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to approve property."
        );
      }

      setProperties((current) =>
        current.filter(
          (item) => item._id !== property._id
        )
      );

      setExpandedProperty(null);

      setSuccess(
        `"${property.title}" was approved successfully.`
      );
    } catch (error) {
      console.error(
        "Approve property error:",
        error
      );

      setError(
        error.message ||
          "Failed to approve property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // OPEN REJECTION FORM
  // ==========================================

  const openRejectForm = (property) => {
    setRejectingProperty(property);
    setRejectionReason("");
    setError("");
    setSuccess("");
  };

  // ==========================================
  // CANCEL REJECTION
  // ==========================================

  const cancelReject = () => {
    if (actionLoading) {
      return;
    }

    setRejectingProperty(null);
    setRejectionReason("");
  };

  // ==========================================
  // REJECT PROPERTY
  // ==========================================

  const rejectProperty = async () => {
    if (!rejectingProperty) {
      return;
    }

    const reason = rejectionReason.trim();

    if (!reason) {
      setError(
        "Please provide a reason for rejecting this property."
      );
      return;
    }

    try {
      setActionLoading(
        rejectingProperty._id
      );

      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        clearAdminSession();
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/properties/${rejectingProperty._id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        clearAdminSession();
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reject property."
        );
      }

      setProperties((current) =>
        current.filter(
          (property) =>
            property._id !==
            rejectingProperty._id
        )
      );

      setExpandedProperty(null);

      setSuccess(
        `"${rejectingProperty.title}" was rejected successfully.`
      );

      setRejectingProperty(null);
      setRejectionReason("");
    } catch (error) {
      console.error(
        "Reject property error:",
        error
      );

      setError(
        error.message ||
          "Failed to reject property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // TOGGLE PROPERTY DETAILS
  // ==========================================

  const toggleDetails = (propertyId) => {
    setExpandedProperty((current) =>
      current === propertyId
        ? null
        : propertyId
    );
  };

  // ==========================================
  // IMAGE SELECTION
  // ==========================================

  const selectImage = (propertyId, image) => {
    setSelectedImages((current) => ({
      ...current,
      [propertyId]: image,
    }));
  };

  // ==========================================
  // ADMIN USER
  // ==========================================

  const adminUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("adminUser") || "null"
      );
    } catch {
      return null;
    }
  })();

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ======================================
          HEADER
      ======================================= */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Review and manage submitted rental
              properties
            </p>
          </div>

          <div className="flex items-center gap-2">
            {adminUser?.username && (
              <span className="hidden text-sm text-slate-500 md:block">
                {adminUser.username}
              </span>
            )}

            <button
              type="button"
              onClick={fetchPendingProperties}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ======================================
          MAIN
      ======================================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* ====================================
            ALERTS
        ===================================== */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <p>{success}</p>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="font-bold text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* ====================================
            PAGE TITLE
        ===================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Pending Properties
              </h2>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                {properties.length}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Review each property carefully before
              approving it for public listing.
            </p>
          </div>
        </div>

        {/* ====================================
            LOADING
        ===================================== */}

        {loading ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="font-medium text-slate-600">
              Loading pending properties...
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Please wait while we retrieve the latest
              submissions.
            </p>
          </div>
        ) : properties.length === 0 ? (
          /* ==================================
             EMPTY STATE
          =================================== */

          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✓
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No pending properties
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              All submitted properties have been
              reviewed. New landlord submissions will
              appear here.
            </p>

            <button
              type="button"
              onClick={fetchPendingProperties}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Check Again
            </button>
          </div>
        ) : (
          /* ==================================
             PROPERTY LIST
          =================================== */

          <div className="space-y-8">
            {properties.map((property) => {
              const images = property.images || [];

              const mainImage =
                selectedImages[property._id] ||
                images[0] ||
                null;

              const isExpanded =
                expandedProperty === property._id;

              const isProcessing =
                actionLoading === property._id;

              return (
                <article
                  key={property._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* ============================
                      PROPERTY IMAGE
                  ============================= */}

                  <div className="grid lg:grid-cols-[1.05fr_1fr]">
                    <div className="bg-slate-900">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={property.title}
                          className="h-72 w-full object-cover sm:h-96 lg:h-full lg:min-h-[500px]"
                        />
                      ) : (
                        <div className="flex h-72 items-center justify-center bg-slate-200 text-slate-500 sm:h-96 lg:h-full lg:min-h-[500px]">
                          No image available
                        </div>
                      )}
                    </div>

                    {/* ==========================
                        PROPERTY SUMMARY
                    =========================== */}

                    <div className="p-5 sm:p-7 lg:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-700">
                            Pending Review
                          </span>

                          <h3 className="mt-4 text-2xl font-bold leading-tight text-slate-900">
                            {property.title}
                          </h3>

                          <p className="mt-2 text-sm font-medium text-slate-500">
                            📍 {property.location}
                          </p>
                        </div>
                      </div>

                      {/* ==========================
                          FINANCIAL INFORMATION
                      =========================== */}

                      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-blue-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                            Monthly Rent
                          </p>

                          <p className="mt-1 text-lg font-bold text-slate-900">
                            KSh{" "}
                            {Number(
                              property.price || 0
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Deposit
                          </p>

                          <p className="mt-1 text-lg font-bold text-slate-900">
                            KSh{" "}
                            {Number(
                              property.deposit || 0
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                            Viewing Fee
                          </p>

                          <p className="mt-1 text-lg font-bold text-slate-900">
                            KSh{" "}
                            {Number(
                              property.viewingFee || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* ==========================
                          PROPERTY DETAILS
                      =========================== */}

                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-lg border border-slate-100 p-3">
                          <p className="text-xs text-slate-400">
                            Type
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {property.propertyType ||
                              "Not provided"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-100 p-3">
                          <p className="text-xs text-slate-400">
                            Bedrooms
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {property.bedrooms ?? 0}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-100 p-3">
                          <p className="text-xs text-slate-400">
                            Bathrooms
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {property.bathrooms ?? 0}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-100 p-3">
                          <p className="text-xs text-slate-400">
                            Area
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {property.area ?? 0} m²
                          </p>
                        </div>
                      </div>

                      {/* ==========================
                          STATUS INFORMATION
                      =========================== */}

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            property.furnished
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {property.furnished
                            ? "Furnished"
                            : "Unfurnished"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            property.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {property.available
                            ? "Available"
                            : "Not Available"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {images.length}{" "}
                          {images.length === 1
                            ? "Image"
                            : "Images"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {(property.videos || [])
                            .length}{" "}
                          {(property.videos || [])
                            .length === 1
                            ? "Video"
                            : "Videos"}
                        </span>
                      </div>

                      {/* ==========================
                          IMAGE THUMBNAILS
                      =========================== */}

                      {images.length > 1 && (
                        <div className="mt-5">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Property Images
                          </p>

                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {images.map(
                              (image, index) => (
                                <button
                                  key={`${property._id}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    selectImage(
                                      property._id,
                                      image
                                    )
                                  }
                                  className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                                    mainImage === image
                                      ? "border-blue-600"
                                      : "border-transparent"
                                  }`}
                                >
                                  <img
                                    src={image}
                                    alt={`${property.title} ${
                                      index + 1
                                    }`}
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* ==========================
                          DESCRIPTION
                      =========================== */}

                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Description
                        </p>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {property.description ||
                            "No description provided."}
                        </p>
                      </div>

                      {/* ==========================
                          REVIEW DETAILS BUTTON
                      =========================== */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleDetails(
                            property._id
                          )
                        }
                        className="mt-6 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {isExpanded
                          ? "Hide Review Details ↑"
                          : "View Full Review Details ↓"}
                      </button>

                      {/* ==========================
                          EXPANDED REVIEW DETAILS
                      =========================== */}

                      {isExpanded && (
                        <div className="mt-6 space-y-6 border-t border-slate-100 pt-6">
                          {/* Amenities */}

                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              Amenities
                            </h4>

                            {property.amenities?.length >
                            0 ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {property.amenities.map(
                                  (
                                    amenity,
                                    index
                                  ) => (
                                    <span
                                      key={`${property._id}-amenity-${index}`}
                                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                                    >
                                      {amenity}
                                    </span>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-slate-500">
                                No amenities provided.
                              </p>
                            )}
                          </div>

                          {/* Landlord */}

                          <div className="rounded-xl bg-slate-50 p-5">
                            <h4 className="text-sm font-bold text-slate-900">
                              Landlord Information
                            </h4>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-slate-400">
                                  Name
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  {property.landlordName ||
                                    "Not provided"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  Phone
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  {property.landlordPhone ||
                                    "Not provided"}
                                </p>
                              </div>

                              <div className="sm:col-span-2">
                                <p className="text-xs text-slate-400">
                                  Email
                                </p>

                                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                                  {property.landlordEmail ||
                                    "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Caretaker */}

                          <div className="rounded-xl bg-slate-50 p-5">
                            <h4 className="text-sm font-bold text-slate-900">
                              Caretaker Information
                            </h4>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-slate-400">
                                  Name
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  {property.caretakerName ||
                                    "Not provided"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  Phone
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  {property.caretakerPhone ||
                                    "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Protected location */}

                          <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                            <h4 className="text-sm font-bold text-orange-900">
                              Location Information
                            </h4>

                            <p className="mt-2 text-xs leading-5 text-orange-700">
                              This information is visible
                              here for administrative review.
                              Some location details may remain
                              protected from public users until
                              the viewing fee is paid.
                            </p>

                            <div className="mt-4">
                              <p className="text-xs text-orange-600">
                                Map URL
                              </p>

                              {property.mapUrl ? (
                                <a
                                  href={
                                    property.mapUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 block break-all text-sm font-semibold text-blue-600 hover:underline"
                                >
                                  Open Property Map
                                </a>
                              ) : (
                                <p className="mt-1 text-sm text-orange-700">
                                  No map URL provided.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Videos */}

                          {property.videos?.length >
                            0 && (
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                Property Videos
                              </h4>

                              <div className="mt-3 space-y-2">
                                {property.videos.map(
                                  (
                                    video,
                                    index
                                  ) => (
                                    <a
                                      key={`${property._id}-video-${index}`}
                                      href={video}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-blue-600 transition hover:bg-slate-50"
                                    >
                                      View Video{" "}
                                      {index + 1}
                                    </a>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Submission date */}

                          <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-400">
                              Submitted
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {property.createdAt
                                ? new Date(
                                    property.createdAt
                                  ).toLocaleString()
                                : "Date unavailable"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* ==========================
                          ACTION BUTTONS
                      =========================== */}

                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            openRejectForm(
                              property
                            )
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject Property
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            approveProperty(
                              property
                            )
                          }
                          className="rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing
                            ? "Processing..."
                            : "Approve Property"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================
          REJECTION MODAL
      ========================================= */}

      {rejectingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Reject Property
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You are rejecting:
                  <span className="font-semibold text-slate-800">
                    {" "}
                    {rejectingProperty.title}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={cancelReject}
                disabled={Boolean(
                  actionLoading
                )}
                className="text-2xl leading-none text-slate-400 hover:text-slate-700 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="rejectionReason"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Reason for rejection
              </label>

              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Explain why this property cannot be approved..."
                disabled={Boolean(
                  actionLoading
                )}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                A clear reason helps the landlord understand
                what needs to be corrected.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={cancelReject}
                disabled={Boolean(
                  actionLoading
                )}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={rejectProperty}
                disabled={
                  Boolean(actionLoading) ||
                  !rejectionReason.trim()
                }
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;