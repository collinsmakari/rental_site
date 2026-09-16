
import { useEffect, useState } from "react";import { Link, useParams } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaArrowLeft,
  FaCheckCircle,
  FaLock,
  FaTimes,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaVideo,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const PropertyDetails = () => {
  const { id } = useParams();

  // ==========================================
  // PROPERTY STATE
  // ==========================================

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // PAYMENT STATE
  // ==========================================

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [paymentId, setPaymentId] =
    useState(null);

  const [paymentStatus, setPaymentStatus] =
    useState(null);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [unlocked, setUnlocked] =
    useState(false);

  const [unlockLoading, setUnlockLoading] =
    useState(false);

  // ==========================================
  // FETCH PUBLIC PROPERTY
  // ==========================================

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/properties/${id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch property"
          );
        }

        console.log("Property received from MongoDB:", data.property);
        console.log(
          "Viewing fee received:",
          data.property?.viewingFee
        );

        setProperty(data.property);
      } catch (error) {
        console.error(
          "Fetch property error:",
          error
        );

        setError(
          error.message ||
            "Failed to load property"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // ==========================================
  // PROPERTY DATA
  // ==========================================

  /*
   * IMPORTANT:
   * viewingFee comes directly from the property
   * returned by MongoDB.
   *
   * There is NO hardcoded viewing fee here.
   */

  const propertyViewingFee = Number(
    property?.viewingFee || 0
  );

  // ==========================================
  // OPEN PAYMENT MODAL
  // ==========================================

  const openPaymentModal = () => {
    // Make sure MongoDB supplied a valid fee
    if (
      !propertyViewingFee ||
      propertyViewingFee <= 0
    ) {
      setPaymentError(
        "This property does not have a valid viewing fee."
      );

      return;
    }

    setPaymentError("");
    setPaymentStatus(null);
    setPhoneNumber("");
    setShowPaymentModal(true);
  };

  // ==========================================
  // CLOSE PAYMENT MODAL
  // ==========================================

  const closePaymentModal = () => {
    if (paymentLoading) {
      return;
    }

    if (
      paymentStatus === "pending" ||
      unlockLoading
    ) {
      return;
    }

    setShowPaymentModal(false);
    setPaymentError("");
  };

  // ==========================================
  // INITIATE M-PESA PAYMENT
  // ==========================================

  const initiatePayment = async (event) => {
    event.preventDefault();

    setPaymentError("");

    // Validate viewing fee
    if (
      !propertyViewingFee ||
      propertyViewingFee <= 0
    ) {
      setPaymentError(
        "This property does not have a valid viewing fee."
      );

      return;
    }

    if (!phoneNumber.trim()) {
      setPaymentError(
        "Please enter your M-Pesa phone number."
      );

      return;
    }

    setPaymentLoading(true);
    setPaymentStatus("initiating");

    try {
      /*
       * IMPORTANT:
       *
       * We intentionally DO NOT send the viewing fee
       * from the frontend.
       *
       * The backend receives propertyId and looks up
       * the viewingFee directly from MongoDB.
       *
       * This prevents users from manipulating the
       * payment amount in the browser.
       */

      const response = await fetch(
        `${API_URL}/api/payments/initiate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            propertyId: id,
            phoneNumber: phoneNumber.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to initiate M-Pesa payment"
        );
      }

      console.log(
        "Payment initiated:",
        data
      );

      // Save payment ID
      setPaymentId(data.paymentId);

      setPaymentStatus("pending");
    } catch (error) {
      console.error(
        "Payment initiation error:",
        error
      );

      setPaymentError(
        error.message ||
          "Failed to initiate payment"
      );

      setPaymentStatus(null);
    } finally {
      setPaymentLoading(false);
    }
  };

  // ==========================================
  // UNLOCK PROTECTED PROPERTY
  // ==========================================

  const unlockProperty = async (
    completedPaymentId
  ) => {
    try {
      setUnlockLoading(true);

      const response = await fetch(
        `${API_URL}/api/properties/${id}/unlocked?paymentId=${completedPaymentId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to unlock property details"
        );
      }

      console.log(
        "Protected property data:",
        data
      );

      // ------------------------------------------
      // Merge protected information into property
      // ------------------------------------------

      setProperty((currentProperty) => ({
        ...currentProperty,

        images:
          data.protectedDetails?.images ||
          currentProperty.images ||
          [],

        videos:
          data.protectedDetails?.videos ||
          currentProperty.videos ||
          [],

        mapUrl:
          data.protectedDetails?.mapUrl ||
          currentProperty.mapUrl,

        landlordName:
          data.protectedDetails?.landlordName ||
          currentProperty.landlordName,

        landlordPhone:
          data.protectedDetails?.landlordPhone ||
          currentProperty.landlordPhone,

        landlordEmail:
          data.protectedDetails?.landlordEmail ||
          currentProperty.landlordEmail,

        caretakerName:
          data.protectedDetails?.caretakerName ||
          currentProperty.caretakerName,

        caretakerPhone:
          data.protectedDetails?.caretakerPhone ||
          currentProperty.caretakerPhone,
      }));

      setUnlocked(true);
    } catch (error) {
      console.error(
        "Unlock property error:",
        error
      );

      setPaymentError(
        error.message ||
          "Payment was successful, but the property details could not be unlocked."
      );
    } finally {
      setUnlockLoading(false);
    }
  };

  // ==========================================
  // POLL PAYMENT STATUS
  // ==========================================

  useEffect(() => {
    if (!paymentId) {
      return;
    }

    let interval;

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/payments/status/${paymentId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to check payment status"
          );
        }

        console.log(
          "Payment status:",
          data.payment.status
        );

        setPaymentStatus(
          data.payment.status
        );

        // ==========================================
        // PAYMENT COMPLETED
        // ==========================================

        if (
          data.payment.status ===
          "completed"
        ) {
          clearInterval(interval);

          // Unlock protected information
          await unlockProperty(paymentId);

          setTimeout(() => {
            setShowPaymentModal(false);
          }, 1500);
        }

        // ==========================================
        // PAYMENT FAILED
        // ==========================================

        if (
          data.payment.status ===
          "failed"
        ) {
          clearInterval(interval);

          setPaymentError(
            data.payment.resultDesc ||
              "Payment failed or was cancelled."
          );
        }
      } catch (error) {
        console.error(
          "Payment status error:",
          error
        );
      }
    };

    // Check immediately
    checkStatus();

    // Then every 3 seconds
    interval = setInterval(
      checkStatus,
      3000
    );

    return () => {
      clearInterval(interval);
    };
  }, [paymentId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-gray-600">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Property Not Found
          </h2>

          <p className="mt-2 text-gray-500">
            {error ||
              "The property you're looking for does not exist."}
          </p>

          <Link
            to="/rentals"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <FaArrowLeft />
            Back to Rentals
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROPERTY DATA
  // ==========================================

  const {
    title,
    propertyType,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    description,
    furnished,
    featured,
    images,
    videos,
    landlordName,
    landlordPhone,
    landlordEmail,
    caretakerName,
    caretakerPhone,
    mapUrl,
    available,
  } = property;

  const mainImage =
    images?.length > 0
      ? images[0]
      : "/properties/property-placeholder.jpg";

  const additionalImages =
    images?.slice(1) || [];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ==========================================
            BACK
        ========================================== */}

        <Link
          to="/rentals#property-results"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <FaArrowLeft />
          Back to Rentals
        </Link>

        {/* ==========================================
            MAIN PROPERTY IMAGE
        ========================================== */}

        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={mainImage}
            alt={title}
            className="h-[420px] w-full object-cover md:h-[550px]"
          />

          <div className="absolute left-5 top-5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            {propertyType}
          </div>

          {featured && (
            <div className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow">
              Featured
            </div>
          )}

          {!available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-lg bg-red-600 px-6 py-3 text-lg font-bold text-white">
                Not Available
              </span>
            </div>
          )}
        </div>

        {/* ==========================================
            PROPERTY INFORMATION
        ========================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* ==========================================
              MAIN INFORMATION
          ========================================== */}

          <div className="lg:col-span-2">

            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {title}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-gray-500">
              <FaMapMarkerAlt className="text-blue-600" />
              {location}
            </p>

            {/* Price */}

            <div className="mt-5">
              <span className="text-3xl font-bold text-blue-600">
                KSh{" "}
                {Number(price).toLocaleString()}
              </span>

              <span className="ml-2 text-gray-500">
                / month
              </span>
            </div>

            {/* ==========================================
                FEATURES
            ========================================== */}

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-white p-5 shadow-sm sm:grid-cols-4">

              <div className="flex items-center gap-3">
                <FaBed className="text-xl text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Bedrooms
                  </p>

                  <p className="font-semibold text-gray-900">
                    {bedrooms}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaBath className="text-xl text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Bathrooms
                  </p>

                  <p className="font-semibold text-gray-900">
                    {bathrooms}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaRulerCombined className="text-xl text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Area
                  </p>

                  <p className="font-semibold text-gray-900">
                    {Number(area).toLocaleString()} sq ft
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-xl text-blue-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Condition
                  </p>

                  <p className="font-semibold text-gray-900">
                    {furnished
                      ? "Furnished"
                      : "Unfurnished"}
                  </p>
                </div>
              </div>

            </div>

            {/* ==========================================
                DESCRIPTION
            ========================================== */}

            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-bold text-gray-900">
                Property Description
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {description}
              </p>

            </div>

            {/* ==========================================
                PROTECTED INFORMATION
            ========================================== */}

            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

              {!unlocked ? (
                <>

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                      <FaLock className="text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Property Details
                      </h2>

                      <p className="text-sm text-gray-500">
                        Additional information is protected
                      </p>
                    </div>

                  </div>

                  <p className="mt-4 text-gray-600">
                    Unlock the exact location,
                    landlord and caretaker contact
                    information, additional photos,
                    videos and map location by paying
                    the property viewing fee.
                  </p>

                  {/* VIEWING FEE FROM MONGODB */}

                  <button
                    type="button"
                    onClick={openPaymentModal}
                    disabled={
                      !propertyViewingFee ||
                      propertyViewingFee <= 0
                    }
                    className="mt-5 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {propertyViewingFee > 0
                      ? `Pay KSh ${propertyViewingFee.toLocaleString()} Viewing Fee`
                      : "Viewing Fee Not Available"}
                  </button>

                </>
              ) : (

                <>

                  {/* UNLOCKED HEADER */}

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                      <FaCheckCircle className="text-green-600" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Property Details Unlocked
                      </h2>

                      <p className="text-sm text-green-600">
                        Payment successful
                      </p>
                    </div>

                  </div>

                  {/* EXACT LOCATION */}

                  <div className="mt-6 border-t pt-5">

                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <FaMapMarkerAlt className="text-blue-600" />
                      Exact Location
                    </h3>

                    <p className="mt-2 text-gray-600">
                      {location ||
                        "Location not provided"}
                    </p>

                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <FaMapMarkerAlt />
                        Open Location Map
                      </a>
                    )}

                  </div>

                  {/* LANDLORD */}

                  <div className="mt-5 border-t pt-5">

                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <FaUser className="text-blue-600" />
                      Landlord Information
                    </h3>

                    <div className="mt-3 space-y-2 text-gray-600">

                      <p>
                        <span className="font-medium">
                          Name:
                        </span>{" "}
                        {landlordName ||
                          "Not provided"}
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="font-medium">
                          Phone:
                        </span>

                        {landlordPhone ? (
                          <a
                            href={`tel:${landlordPhone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {landlordPhone}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>

                      {landlordEmail && (
                        <p>
                          <span className="font-medium">
                            Email:
                          </span>{" "}
                          {landlordEmail}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* CARETAKER */}

                  <div className="mt-5 border-t pt-5">

                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <FaUser className="text-blue-600" />
                      Caretaker Information
                    </h3>

                    <div className="mt-3 space-y-2 text-gray-600">

                      <p>
                        <span className="font-medium">
                          Name:
                        </span>{" "}
                        {caretakerName ||
                          "Not provided"}
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="font-medium">
                          Phone:
                        </span>

                        {caretakerPhone ? (
                          <a
                            href={`tel:${caretakerPhone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {caretakerPhone}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>

                    </div>

                  </div>

                </>
              )}

            </div>

          </div>

          {/* ==========================================
              SUMMARY CARD
          ========================================== */}

          <div className="h-fit rounded-xl bg-white p-6 shadow-md lg:sticky lg:top-24">

            <h2 className="text-xl font-bold text-gray-900">
              Property Summary
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Property Type
                </span>

                <span className="font-semibold text-gray-900">
                  {propertyType}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Location
                </span>

                <span className="font-semibold text-gray-900">
                  {location}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Bedrooms
                </span>

                <span className="font-semibold text-gray-900">
                  {bedrooms}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">
                  Bathrooms
                </span>

                <span className="font-semibold text-gray-900">
                  {bathrooms}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Area
                </span>

                <span className="font-semibold text-gray-900">
                  {Number(area).toLocaleString()} sq ft
                </span>
              </div>

            </div>

            {!unlocked && (
              <button
                type="button"
                onClick={openPaymentModal}
                disabled={
                  !propertyViewingFee ||
                  propertyViewingFee <= 0
                }
                className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {propertyViewingFee > 0
                  ? `Pay KSh ${propertyViewingFee.toLocaleString()} Viewing Fee`
                  : "Viewing Fee Not Available"}
              </button>
            )}

            {unlocked && (
              <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <FaCheckCircle />
                Details Unlocked
              </div>
            )}

          </div>

        </div>

        {/* ==========================================
            MORE PHOTOS
        ========================================== */}

        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                More Property Photos
              </h2>

              {!unlocked && (
                <p className="mt-1 text-sm text-gray-500">
                  Pay the viewing fee to unlock
                  all property photos.
                </p>
              )}

            </div>

            {!unlocked && (
              <FaLock className="text-xl text-gray-400" />
            )}

          </div>

          <div className="mt-5">

            {unlocked ? (
              <>

                {additionalImages.length > 0 ? (

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                    {additionalImages.map(
                      (image, index) => (

                        <div
                          key={index}
                          className="overflow-hidden rounded-lg"
                        >

                          <img
                            src={image}
                            alt={`${title} ${
                              index + 2
                            }`}
                            className="h-48 w-full object-cover transition duration-300 hover:scale-105"
                          />

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="rounded-lg bg-gray-50 p-8 text-center">

                    <p className="text-gray-500">
                      No additional photos available.
                    </p>

                  </div>

                )}

              </>

            ) : (

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">

                <FaLock className="mx-auto text-4xl text-gray-400" />

                <h3 className="mt-4 font-semibold text-gray-800">
                  Photos Locked
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Complete the viewing fee payment
                  to access all property photos.
                </p>

                <button
                  type="button"
                  onClick={openPaymentModal}
                  disabled={
                    !propertyViewingFee ||
                    propertyViewingFee <= 0
                  }
                  className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {propertyViewingFee > 0
                    ? `Pay KSh ${propertyViewingFee.toLocaleString()} Viewing Fee`
                    : "Viewing Fee Not Available"}
                </button>

              </div>

            )}

          </div>

        </div>

        {/* ==========================================
            VIDEOS
        ========================================== */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <FaVideo className="text-blue-600" />
            Property Videos
          </h2>

          {!unlocked ? (

            <div className="mt-5 rounded-lg bg-gray-100 p-8 text-center">

              <FaLock className="mx-auto text-3xl text-gray-400" />

              <p className="mt-3 font-semibold text-gray-700">
                Property videos are locked
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Pay the viewing fee to access them.
              </p>

              <button
                type="button"
                onClick={openPaymentModal}
                disabled={
                  !propertyViewingFee ||
                  propertyViewingFee <= 0
                }
                className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {propertyViewingFee > 0
                  ? `Pay KSh ${propertyViewingFee.toLocaleString()} Viewing Fee`
                  : "Viewing Fee Not Available"}
              </button>

            </div>

          ) : (

            <>

              {videos?.length > 0 ? (

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                  {videos.map(
                    (video, index) => (

                      <video
                        key={index}
                        src={video}
                        controls
                        className="w-full rounded-lg"
                      />

                    )
                  )}

                </div>

              ) : (

                <div className="mt-5 rounded-lg bg-gray-50 p-8 text-center">

                  <p className="text-gray-500">
                    No property videos available.
                  </p>

                </div>

              )}

            </>

          )}

        </div>

      </section>

      {/* ==========================================
          PAYMENT MODAL
      ========================================== */}

      {showPaymentModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* Close */}

            {!paymentLoading &&
              paymentStatus !== "pending" &&
              !unlockLoading && (

                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                >
                  <FaTimes />
                </button>

              )}

            {/* ==========================================
                PAYMENT SUCCESS
            ========================================== */}

            {paymentStatus ===
              "completed" && unlocked ? (

              <div className="py-8 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">

                  <FaCheckCircle className="text-3xl text-green-600" />

                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                  Payment Successful
                </h2>

                <p className="mt-2 text-gray-600">
                  Your property details have
                  been unlocked.
                </p>

              </div>

            ) : unlockLoading ? (

              /* ==========================================
                  UNLOCKING
              ========================================== */

              <div className="py-8 text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Unlocking property details...
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Your payment was received.
                </p>

              </div>

            ) : paymentStatus ===
              "pending" ? (

              /* ==========================================
                  WAITING FOR PAYMENT
              ========================================== */

              <div className="py-8 text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Waiting for payment
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Check your phone and complete
                  the M-Pesa payment prompt.
                </p>

                <p className="mt-4 text-xs text-gray-400">
                  This page will automatically
                  detect your payment.
                </p>

              </div>

            ) : (

              /* ==========================================
                  PAYMENT FORM
              ========================================== */

              <>

                <div className="pr-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                      <FaMobileAlt className="text-blue-600" />
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        Unlock Property Details
                      </h2>

                      <p className="text-sm text-gray-500">
                        Secure M-Pesa payment
                      </p>

                    </div>

                  </div>

                </div>

                {/* ==========================================
                    AMOUNT FROM MONGODB
                ========================================== */}

                <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center">

                  <p className="text-sm text-gray-600">
                    Property Viewing Fee
                  </p>

                  <p className="mt-1 text-3xl font-bold text-blue-600">
                    KSh{" "}
                    {propertyViewingFee.toLocaleString()}
                  </p>

                </div>

                <form
                  onSubmit={initiatePayment}
                  className="mt-6"
                >

                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    M-Pesa Phone Number
                  </label>

                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) =>
                      setPhoneNumber(
                        event.target.value
                      )
                    }
                    placeholder="07XXXXXXXX"
                    disabled={paymentLoading}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />

                  {paymentError && (
                    <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      paymentLoading ||
                      !propertyViewingFee ||
                      propertyViewingFee <= 0
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {paymentLoading ? (

                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                        Sending STK Push...
                      </>

                    ) : (

                      <>
                        <FaMobileAlt />

                        Pay KSh{" "}
                        {propertyViewingFee.toLocaleString()}{" "}
                        with M-Pesa
                      </>

                    )}

                  </button>

                  <p className="mt-4 text-center text-xs text-gray-400">
                    You will receive an M-Pesa
                    prompt on your phone.
                  </p>

                </form>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default PropertyDetails;