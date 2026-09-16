import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const API_URL = import.meta.env.VITE_API_URL;

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Unlock states
  const [unlocked, setUnlocked] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  // --------------------------------------------------
  // FETCH PUBLIC PROPERTY DETAILS
  // --------------------------------------------------
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/properties/${id}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load property details."
          );
        }

        console.log("Property loaded:", data.property);
        console.log(
          "Viewing fee from MongoDB:",
          data.property?.viewingFee
        );

        setProperty(data.property);
      } catch (err) {
        console.error("Property fetch error:", err);
        setError(err.message || "Failed to load property.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // --------------------------------------------------
  // VIEWING FEE FROM MONGODB
  // --------------------------------------------------
  const propertyViewingFee = Number(property?.viewingFee || 0);

  // --------------------------------------------------
  // INITIATE M-PESA PAYMENT
  // --------------------------------------------------
  const initiatePayment = async (e) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      setPaymentError("Please enter your M-Pesa phone number.");
      return;
    }

    if (!property?._id) {
      setPaymentError("Property information is not available.");
      return;
    }

    if (!propertyViewingFee || propertyViewingFee <= 0) {
      setPaymentError("Viewing fee is not available for this property.");
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError("");
      setPaymentStatus(null);

      console.log("Initiating payment...");
      console.log("Property ID:", property._id);
      console.log("Viewing fee:", propertyViewingFee);

      const response = await fetch(`${API_URL}/api/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property._id,
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const data = await response.json();

      console.log("Payment initiation response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to initiate M-Pesa payment."
        );
      }

      setPaymentId(data.paymentId);
      setPaymentStatus(data.status || "pending");

      console.log("Payment initiated successfully.");
      console.log("Payment ID:", data.paymentId);
      console.log("Payment amount:", data.amount);
      console.log("Checkout Request ID:", data.checkoutRequestId);
    } catch (err) {
      console.error("Payment initiation error:", err);

      setPaymentError(
        err.message || "Failed to initiate M-Pesa payment."
      );
      setPaymentStatus("failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  // --------------------------------------------------
  // UNLOCK PROPERTY AFTER SUCCESSFUL PAYMENT
  // --------------------------------------------------
  const unlockProperty = async (completedPaymentId) => {
    if (!completedPaymentId || !id) {
      console.error("Missing payment ID or property ID.");
      return false;
    }

    try {
      setUnlockLoading(true);
      setPaymentError("");

      const unlockUrl = `${API_URL}/api/properties/${id}/unlocked?paymentId=${completedPaymentId}`;

      console.log("=================================");
      console.log("UNLOCKING PROPERTY");
      console.log("Property ID:", id);
      console.log("Payment ID:", completedPaymentId);
      console.log("Unlock URL:", unlockUrl);

      const response = await fetch(unlockUrl);

      console.log("Unlock response status:", response.status);

      const data = await response.json();

      console.log("Unlock response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to unlock property details."
        );
      }

      const protectedDetails = data.protectedDetails;

      if (!protectedDetails) {
        throw new Error(
          "Payment was successful, but protected property details were not returned."
        );
      }

      console.log("Protected details received:", protectedDetails);

      // Merge protected details into the existing property
      setProperty((currentProperty) => ({
        ...currentProperty,

        images:
          protectedDetails.images?.length > 0
            ? protectedDetails.images
            : currentProperty?.images || [],

        videos:
          protectedDetails.videos?.length > 0
            ? protectedDetails.videos
            : currentProperty?.videos || [],

        mapUrl:
          protectedDetails.mapUrl ||
          currentProperty?.mapUrl ||
          null,

        landlordName:
          protectedDetails.landlordName ||
          currentProperty?.landlordName ||
          null,

        landlordPhone:
          protectedDetails.landlordPhone ||
          currentProperty?.landlordPhone ||
          null,

        landlordEmail:
          protectedDetails.landlordEmail ||
          currentProperty?.landlordEmail ||
          null,

        caretakerName:
          protectedDetails.caretakerName ||
          currentProperty?.caretakerName ||
          null,

        caretakerPhone:
          protectedDetails.caretakerPhone ||
          currentProperty?.caretakerPhone ||
          null,
      }));

      setUnlocked(true);

      console.log("=================================");
      console.log("PROPERTY UNLOCKED SUCCESSFULLY");
      console.log("=================================");

      return true;
    } catch (err) {
      console.error("Property unlock error:", err);

      setPaymentError(
        err.message ||
          "Payment was successful, but the property details could not be unlocked."
      );

      return false;
    } finally {
      setUnlockLoading(false);
    }
  };

  // --------------------------------------------------
  // CHECK M-PESA PAYMENT STATUS
  // --------------------------------------------------
  useEffect(() => {
    if (!paymentId) return;

    let interval = null;
    let stopped = false;

    const checkStatus = async () => {
      try {
        const statusUrl = `${API_URL}/api/payments/status/${paymentId}`;

        console.log("Checking payment status...");
        console.log("Payment status URL:", statusUrl);

        const response = await fetch(statusUrl);

        const data = await response.json();

        console.log("Payment status response:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to check payment status."
          );
        }

        const status = data.payment?.status;

        console.log("Current payment status:", status);

        if (stopped) return;

        setPaymentStatus(status);

        // ---------------------------------------------
        // PAYMENT COMPLETED
        // ---------------------------------------------
        if (status === "completed") {
          console.log("Payment completed.");

          // Stop polling immediately
          if (interval) {
            clearInterval(interval);
            interval = null;
          }

          if (stopped) return;

          // Unlock the property
          const unlockedSuccessfully = await unlockProperty(paymentId);

          if (unlockedSuccessfully) {
            console.log("Unlock completed successfully.");

            // Give user time to see success message
            setTimeout(() => {
              setShowPaymentModal(false);
            }, 1500);
          }

          return;
        }

        // ---------------------------------------------
        // PAYMENT FAILED
        // ---------------------------------------------
        if (status === "failed") {
          console.log("Payment failed.");

          if (interval) {
            clearInterval(interval);
            interval = null;
          }

          setPaymentError(
            data.payment?.resultDescription ||
              "Payment failed or was cancelled."
          );

          return;
        }
      } catch (err) {
        console.error("Payment status error:", err);

        if (!stopped) {
          setPaymentError(
            err.message || "Unable to check payment status."
          );
        }
      }
    };

    // Check immediately
    checkStatus();

    // Continue checking every 3 seconds
    interval = setInterval(checkStatus, 3000);

    return () => {
      stopped = true;

      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, [paymentId]);

  // --------------------------------------------------
  // OPEN PAYMENT MODAL
  // --------------------------------------------------
  const openPaymentModal = () => {
    setPaymentError("");
    setPaymentStatus(null);
    setPaymentId(null);
    setPhoneNumber("");
    setShowPaymentModal(true);
  };

  // --------------------------------------------------
  // CLOSE PAYMENT MODAL
  // --------------------------------------------------
  const closePaymentModal = () => {
    if (paymentLoading || unlockLoading) {
      return;
    }

    setShowPaymentModal(false);
    setPaymentError("");
  };

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-400">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-5">
            {error || "Property not found."}
          </p>

          <Link
            to="/rentals"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
          >
            <FaArrowLeft />
            Back to Rentals
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PROPERTY DATA
  // --------------------------------------------------
  const {
    title,
    propertyType,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    furnished,
    featured,
    description,
    amenities = [],
    images = [],
    videos = [],
    mapUrl,
    landlordName,
    landlordPhone,
    landlordEmail,
    caretakerName,
    caretakerPhone,
    available,
  } = property;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* --------------------------------------------- */}
      {/* HEADER */}
      {/* --------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/rentals#property-results"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition mb-6"
        >
          <FaArrowLeft />
          Back to Rentals
        </Link>
      </div>

      {/* --------------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* --------------------------------------------- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Main Image */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-8">
          <img
            src={
              images?.[0]
                ? images[0].startsWith("http")
                  ? images[0]
                  : images[0]
                : "/images/placeholder.jpg"
            }
            alt={title}
            className="w-full h-[300px] sm:h-[450px] object-cover"
          />

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {propertyType}
            </span>

            {featured && (
              <span className="bg-yellow-500 text-gray-950 px-3 py-1.5 rounded-full text-sm font-medium">
                Featured
              </span>
            )}

            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                available
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {available ? "Available" : "Not Available"}
            </span>
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* TITLE + LOCATION */}
        {/* --------------------------------------------- */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {title}
          </h1>

          <div className="flex items-center gap-2 text-gray-400">
            <FaMapMarkerAlt className="text-blue-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* PROPERTY INFO */}
        {/* --------------------------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-900 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-blue-400">
                <FaBed />
              </span>
              <span className="text-gray-400 text-sm">
                Bedrooms
              </span>
            </div>

            <p className="text-xl font-semibold">
              {bedrooms ?? "N/A"}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-blue-400">
                <FaBath />
              </span>
              <span className="text-gray-400 text-sm">
                Bathrooms
              </span>
            </div>

            <p className="text-xl font-semibold">
              {bathrooms ?? "N/A"}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-blue-400">
                <FaRulerCombined />
              </span>
              <span className="text-gray-400 text-sm">
                Area
              </span>
            </div>

            <p className="text-xl font-semibold">
              {area ? `${area} sq ft` : "N/A"}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-blue-400">
                <FaCheckCircle />
              </span>
              <span className="text-gray-400 text-sm">
                Furnished
              </span>
            </div>

            <p className="text-xl font-semibold">
              {furnished ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* PRICE + VIEWING FEE */}
        {/* --------------------------------------------- */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">
                Property Description
              </h2>

              <p className="text-gray-400 leading-7">
                {description ||
                  "No description available for this property."}
              </p>
            </section>

            {/* Amenities */}
            {amenities.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-5">
                  Amenities
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <FaCheckCircle className="text-blue-400" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ----------------------------------------- */}
            {/* PROTECTED INFORMATION */}
            {/* ----------------------------------------- */}
            <section className="bg-gray-900 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Contact & Viewing Information
                </h2>

                {!unlocked && (
                  <FaLock className="text-gray-500 text-xl" />
                )}
              </div>

              {!unlocked ? (
                <div className="text-center py-6">
                  <FaLock className="text-4xl text-gray-600 mx-auto mb-4" />

                  <h3 className="text-xl font-semibold mb-2">
                    Contact details are locked
                  </h3>

                  <p className="text-gray-400 mb-6">
                    Pay the viewing fee to unlock the landlord,
                    caretaker, location, map, photos and videos.
                  </p>

                  <button
                    onClick={openPaymentModal}
                    disabled={propertyViewingFee <= 0}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition"
                  >
                    {propertyViewingFee > 0
                      ? `Pay KSh ${propertyViewingFee.toLocaleString()} Viewing Fee`
                      : "Viewing Fee Not Available"}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Landlord */}
                  {landlordName && (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <FaUser className="text-blue-400" />

                        <h3 className="font-semibold">
                          Landlord
                        </h3>
                      </div>

                      <p className="text-gray-300">
                        {landlordName}
                      </p>

                      {landlordPhone && (
                        <a
                          href={`tel:${landlordPhone}`}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-2"
                        >
                          <FaPhone />
                          {landlordPhone}
                        </a>
                      )}

                      {landlordEmail && (
                        <a
                          href={`mailto:${landlordEmail}`}
                          className="block text-gray-400 hover:text-blue-400 mt-2"
                        >
                          {landlordEmail}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Caretaker */}
                  {caretakerName && (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <FaUser className="text-blue-400" />

                        <h3 className="font-semibold">
                          Caretaker
                        </h3>
                      </div>

                      <p className="text-gray-300">
                        {caretakerName}
                      </p>

                      {caretakerPhone && (
                        <a
                          href={`tel:${caretakerPhone}`}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-2"
                        >
                          <FaPhone />
                          {caretakerPhone}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Map */}
                  {mapUrl && (
                    <div>
                      <h3 className="font-semibold mb-3">
                        Exact Location
                      </h3>

                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg transition"
                      >
                        <FaMapMarkerAlt />
                        Open Location Map
                      </a>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ----------------------------------------- */}
            {/* MORE PHOTOS */}
            {/* ----------------------------------------- */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold mb-5">
                More Photos
              </h2>

              {!unlocked ? (
                <div className="bg-gray-900 rounded-xl p-8 text-center">
                  <FaLock className="text-3xl text-gray-600 mx-auto mb-3" />

                  <p className="text-gray-400">
                    Additional property photos are available after
                    payment.
                  </p>
                </div>
              ) : images.length > 1 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${title} ${index + 2}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No additional photos available.
                </p>
              )}
            </section>

            {/* ----------------------------------------- */}
            {/* VIDEOS */}
            {/* ----------------------------------------- */}
            <section className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <FaVideo className="text-blue-400" />

                <h2 className="text-2xl font-bold">
                  Property Videos
                </h2>
              </div>

              {!unlocked ? (
                <div className="bg-gray-900 rounded-xl p-8 text-center">
                  <FaLock className="text-3xl text-gray-600 mx-auto mb-3" />

                  <p className="text-gray-400">
                    Property videos are available after payment.
                  </p>
                </div>
              ) : videos.length > 0 ? (
                <div className="space-y-5">
                  {videos.map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full rounded-xl bg-black"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No videos available for this property.
                </p>
              )}
            </section>
          </div>

          {/* ------------------------------------------- */}
          {/* SIDEBAR */}
          {/* ------------------------------------------- */}
          <aside>
            <div className="bg-gray-900 rounded-2xl p-6 sticky top-24">
              <p className="text-gray-400 text-sm mb-1">
                Monthly Rent
              </p>

              <p className="text-3xl font-bold text-blue-400 mb-6">
                KSh {Number(price || 0).toLocaleString()}
              </p>

              <div className="border-t border-gray-800 pt-5 mb-6">
                <p className="text-gray-400 text-sm mb-1">
                  Viewing Fee
                </p>

                <p className="text-xl font-semibold">
                  {propertyViewingFee > 0
                    ? `KSh ${propertyViewingFee.toLocaleString()}`
                    : "Not Available"}
                </p>
              </div>

              {!unlocked && (
                <button
                  onClick={openPaymentModal}
                  disabled={propertyViewingFee <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-5 rounded-lg transition"
                >
                  {propertyViewingFee > 0
                    ? `Pay KSh ${propertyViewingFee.toLocaleString()} to View`
                    : "Viewing Fee Not Available"}
                </button>
              )}

              {unlocked && (
                <div className="flex items-center justify-center gap-2 bg-green-600/10 text-green-400 border border-green-600/30 rounded-lg py-3">
                  <FaCheckCircle />
                  Property Details Unlocked
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* ================================================= */}
      {/* PAYMENT MODAL */}
      {/* ================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Close */}
            <button
              onClick={closePaymentModal}
              disabled={paymentLoading || unlockLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
            >
              <FaTimes />
            </button>

            {/* ----------------------------------------- */}
            {/* SUCCESS */}
            {/* ----------------------------------------- */}
            {paymentStatus === "completed" && unlocked ? (
              <div className="text-center py-6">
                <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-5" />

                <h2 className="text-2xl font-bold mb-3">
                  Payment Successful
                </h2>

                <p className="text-gray-400">
                  Your property viewing details have been
                  unlocked successfully.
                </p>
              </div>
            ) : unlockLoading ? (
              /* ----------------------------------------- */
              /* UNLOCKING */
              /* ----------------------------------------- */
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>

                <h2 className="text-xl font-bold mb-2">
                  Unlocking Property Details...
                </h2>

                <p className="text-gray-400">
                  Your payment has been received. Please wait while
                  we unlock the property information.
                </p>
              </div>
            ) : paymentStatus === "pending" ? (
              /* ----------------------------------------- */
              /* PAYMENT PENDING */
              /* ----------------------------------------- */
              <div className="text-center py-6">
                <FaMobileAlt className="text-5xl text-blue-400 mx-auto mb-5" />

                <h2 className="text-2xl font-bold mb-3">
                  Waiting for Payment
                </h2>

                <p className="text-gray-400 mb-5">
                  Check your phone and complete the M-Pesa payment
                  request.
                </p>

                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">
                    Viewing Fee
                  </p>

                  <p className="text-xl font-bold text-blue-400">
                    KSh{" "}
                    {propertyViewingFee.toLocaleString()}
                  </p>
                </div>

                <div className="mt-5 flex justify-center">
                  <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              /* ----------------------------------------- */
              /* PAYMENT FORM */
              /* ----------------------------------------- */
              <>
                <div className="text-center mb-7">
                  <FaMobileAlt className="text-4xl text-blue-400 mx-auto mb-4" />

                  <h2 className="text-2xl font-bold mb-2">
                    Pay Viewing Fee
                  </h2>

                  <p className="text-gray-400">
                    Enter your M-Pesa number to receive the payment
                    prompt.
                  </p>
                </div>

                {/* Viewing Fee */}
                <div className="bg-gray-800 rounded-xl p-4 mb-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Property Viewing Fee
                  </p>

                  <p className="text-2xl font-bold text-blue-400 mt-1">
                    KSh{" "}
                    {propertyViewingFee.toLocaleString()}
                  </p>
                </div>

                <form onSubmit={initiatePayment}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    M-Pesa Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value)
                    }
                    placeholder="e.g. 0712345678"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
                    disabled={paymentLoading}
                  />

                  {paymentError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      paymentLoading ||
                      propertyViewingFee <= 0
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                  >
                    {paymentLoading
                      ? "Sending M-Pesa Request..."
                      : `Pay KSh ${propertyViewingFee.toLocaleString()}`}
                  </button>
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