import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBath,
  FaBed,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaHome,
  FaImage,
  FaMapMarkerAlt,
  FaPhone,
  FaRulerCombined,
  FaTimes,
  FaUser,
  FaVideo,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const viewingFees = {
  Apartment: 200,
  House: 150,
  Bedsitter: 100,
  Studio: 150,
  Maisonette: 200,
  Commercial: 300,
  Office: 300,
  AirBnB: 150,
};

const propertyTypes = [
  "Apartment",
  "House",
  "Bedsitter",
  "Studio",
  "Maisonette",
  "Commercial",
  "Office",
  "AirBnB",
];

const initialForm = {
  title: "",
  description: "",
  location: "",
  area: "",
  propertyType: "",
  price: "",
  deposit: "",
  bedrooms: "",
  bathrooms: "",
  furnished: "false",
  mapUrl: "",
  landlordName: "",
  landlordPhone: "",
  landlordEmail: "",
  caretakerName: "",
  caretakerPhone: "",
  available: "true",
};

const ListProperty = () => {
  const [form, setForm] = useState(initialForm);

  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const viewingFee = useMemo(() => {
    return form.propertyType
      ? viewingFees[form.propertyType]
      : null;
  }, [form.propertyType]);

  // ==========================================
  // CLEAN IMAGE PREVIEW URLS
  // ==========================================

  useEffect(() => {
    const previews = images.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [images]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // HANDLE IMAGES
  // ==========================================

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const validImages = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImages.length !== selectedFiles.length) {
      setError(
        "Only image files can be added to the photo section."
      );
    }

    const combinedImages = [
      ...images,
      ...validImages,
    ].slice(0, 10);

    setImages(combinedImages);

    event.target.value = "";
  };

  // ==========================================
  // HANDLE VIDEOS
  // ==========================================

  const handleVideoChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const validVideos = selectedFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    if (validVideos.length !== selectedFiles.length) {
      setError(
        "Only video files can be added to the video section."
      );
    }

    const combinedVideos = [
      ...videos,
      ...validVideos,
    ].slice(0, 5);

    setVideos(combinedVideos);

    event.target.value = "";
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  // ==========================================
  // REMOVE VIDEO
  // ==========================================

  const removeVideo = (index) => {
    setVideos((previous) =>
      previous.filter(
        (_, videoIndex) => videoIndex !== index
      )
    );
  };

  // ==========================================
  // ADD AMENITY
  // ==========================================

  const addAmenity = () => {
    const value = amenityInput.trim();

    if (!value) return;

    if (
      amenities.some(
        (amenity) =>
          amenity.toLowerCase() === value.toLowerCase()
      )
    ) {
      setAmenityInput("");
      return;
    }

    setAmenities((previous) => [
      ...previous,
      value,
    ]);

    setAmenityInput("");
  };

  // ==========================================
  // REMOVE AMENITY
  // ==========================================

  const removeAmenity = (index) => {
    setAmenities((previous) =>
      previous.filter(
        (_, amenityIndex) => amenityIndex !== index
      )
    );
  };

  // ==========================================
  // HANDLE AMENITY ENTER KEY
  // ==========================================

  const handleAmenityKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addAmenity();
    }
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Please enter a property title.";
    }

    if (!form.propertyType) {
      return "Please select a property type.";
    }

    if (!form.location.trim()) {
      return "Please enter the property location.";
    }

    if (!form.price) {
      return "Please enter the monthly rent.";
    }

    if (Number(form.price) < 0) {
      return "Monthly rent cannot be negative.";
    }

    if (!form.deposit) {
      return "Please enter the deposit amount.";
    }

    if (Number(form.deposit) < 0) {
      return "Deposit cannot be negative.";
    }

    if (!form.area) {
      return "Please enter the property area.";
    }

    if (Number(form.area) < 0) {
      return "Property area cannot be negative.";
    }

    if (!form.description.trim()) {
      return "Please provide a property description.";
    }

    if (images.length === 0) {
      return "Please upload at least one property image.";
    }

    if (images.length > 10) {
      return "You can upload a maximum of 10 images.";
    }

    if (videos.length > 5) {
      return "You can upload a maximum of 5 videos.";
    }

    if (!form.landlordName.trim()) {
      return "Please enter the landlord name.";
    }

    if (!form.landlordPhone.trim()) {
      return "Please enter the landlord phone number.";
    }

    return null;
  };

  // ==========================================
  // SUBMIT PROPERTY
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // ========================================
      // PROPERTY INFORMATION
      // ========================================

      formData.append("title", form.title.trim());

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "location",
        form.location.trim()
      );

      formData.append("area", form.area);

      formData.append(
        "propertyType",
        form.propertyType
      );

      formData.append("price", form.price);

      formData.append("deposit", form.deposit);

      // ========================================
      // OPTIONAL PROPERTY INFORMATION
      // ========================================

      formData.append(
        "bedrooms",
        form.bedrooms || "0"
      );

      formData.append(
        "bathrooms",
        form.bathrooms || "0"
      );

      formData.append(
        "furnished",
        form.furnished
      );

      formData.append(
        "available",
        form.available
      );

      formData.append(
        "mapUrl",
        form.mapUrl.trim()
      );

      // ========================================
      // LANDLORD INFORMATION
      // ========================================

      formData.append(
        "landlordName",
        form.landlordName.trim()
      );

      formData.append(
        "landlordPhone",
        form.landlordPhone.trim()
      );

      formData.append(
        "landlordEmail",
        form.landlordEmail.trim()
      );

      // ========================================
      // CARETAKER INFORMATION
      // ========================================

      formData.append(
        "caretakerName",
        form.caretakerName.trim()
      );

      formData.append(
        "caretakerPhone",
        form.caretakerPhone.trim()
      );

      // ========================================
      // AMENITIES
      // ========================================

      formData.append(
        "amenities",
        amenities.join(",")
      );

      // ========================================
      // IMAGES
      // ========================================

      images.forEach((image) => {
        formData.append("images", image);
      });

      // ========================================
      // VIDEOS
      // ========================================

      videos.forEach((video) => {
        formData.append("videos", video);
      });

      // ========================================
      // SEND TO BACKEND
      // ========================================

      const response = await fetch(
        `${API_URL}/api/properties`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log(
        "Create property response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to submit property."
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      setSuccess(
        "Your property has been submitted successfully. It is now awaiting approval."
      );

      setForm(initialForm);
      setAmenities([]);
      setAmenityInput("");
      setImages([]);
      setVideos([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submitError) {
      console.error(
        "Property submission error:",
        submitError
      );

      setError(
        submitError.message ||
          "Something went wrong while submitting the property."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ======================================
            BACK LINK
        ====================================== */}

        <div className="mb-6">
          <Link
            to="/rentals"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            <FaArrowLeft />
            Back to Rentals
          </Link>
        </div>

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FaHome className="text-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            List Your Property
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Landlords and caretakers can submit their
            properties for listing on our rental platform.
          </p>
        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            <FaCheckCircle className="mt-1 shrink-0" />

            <div>
              <p className="font-semibold">
                Submission successful
              </p>

              <p className="mt-1 text-sm">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <FaTimes className="mt-1 shrink-0" />

            <div>
              <p className="font-semibold">
                Please check your submission
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ======================================
              BASIC PROPERTY INFORMATION
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Property Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Provide the basic details of your property.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Property Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern 2 Bedroom Apartment"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PROPERTY TYPE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Property Type *
                </label>

                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select property type
                  </option>

                  {propertyTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* VIEWING FEE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Viewing Fee
                </label>

                <div className="flex min-h-[50px] items-center rounded-xl border border-blue-200 bg-blue-50 px-4">
                  {viewingFee ? (
                    <span className="font-bold text-blue-700">
                      KSh {viewingFee}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Select a property type
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  The viewing fee is automatically
                  determined by the property type.
                </p>
              </div>

              {/* LOCATION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Location *
                </label>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Kilimani, Nairobi"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PRICE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Monthly Rent (KSh) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  placeholder="35000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DEPOSIT */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Deposit (KSh) *
                </label>

                <input
                  type="number"
                  name="deposit"
                  value={form.deposit}
                  onChange={handleChange}
                  min="0"
                  placeholder="35000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* AREA */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Area (sq ft) *
                </label>

                <div className="relative">
                  <FaRulerCombined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="number"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    min="0"
                    placeholder="1200"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* BEDROOMS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Bedrooms
                </label>

                <div className="relative">
                  <FaBed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="number"
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                    min="0"
                    placeholder="2"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* BATHROOMS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Bathrooms
                </label>

                <div className="relative">
                  <FaBath className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="number"
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    min="0"
                    placeholder="2"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* FURNISHED */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Furnished
                </label>

                <select
                  name="furnished"
                  value={form.furnished}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="false">
                    No
                  </option>

                  <option value="true">
                    Yes
                  </option>
                </select>
              </div>

              {/* AVAILABILITY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Availability
                </label>

                <select
                  name="available"
                  value={form.available}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="true">
                    Available
                  </option>

                  <option value="false">
                    Not Available
                  </option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Property Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe the property, surroundings, security, nearby amenities, transport, etc."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* ======================================
              AMENITIES
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Amenities
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add features available at the property.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={amenityInput}
                onChange={(event) =>
                  setAmenityInput(event.target.value)
                }
                onKeyDown={handleAmenityKeyDown}
                placeholder="e.g. Parking, Security, Balcony"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={addAmenity}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Add Amenity
              </button>
            </div>

            {amenities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <span
                    key={`${amenity}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    {amenity}

                    <button
                      type="button"
                      onClick={() =>
                        removeAmenity(index)
                      }
                      className="text-blue-500 hover:text-red-500"
                      aria-label={`Remove ${amenity}`}
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ======================================
              PROPERTY PHOTOS
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Property Photos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload up to 10 clear photos. At least
                one photo is required.
              </p>
            </div>

            <label
              htmlFor="property-images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <FaCloudUploadAlt className="mb-3 text-4xl text-blue-500" />

              <span className="font-semibold text-gray-800">
                Click to upload property photos
              </span>

              <span className="mt-1 text-sm text-gray-500">
                JPG, JPEG, PNG, WEBP
              </span>

              <span className="mt-2 text-xs text-gray-400">
                Maximum 10 images
              </span>

              <input
                id="property-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imagePreviews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                  >
                    <img
                      src={preview}
                      alt={`Property preview ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                        Main photo
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <FaImage />
              {images.length} / 10 images selected
            </div>
          </section>

          {/* ======================================
              PROPERTY VIDEOS
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Property Videos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload up to 5 property tour videos.
                Videos will be available after a tenant
                completes the viewing payment.
              </p>
            </div>

            <label
              htmlFor="property-videos"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <FaVideo className="mb-3 text-4xl text-blue-500" />

              <span className="font-semibold text-gray-800">
                Click to upload property videos
              </span>

              <span className="mt-1 text-sm text-gray-500">
                MP4, MOV, AVI and other supported video
                formats
              </span>

              <span className="mt-2 text-xs text-gray-400">
                Maximum 5 videos
              </span>

              <input
                id="property-videos"
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>

            {videos.length > 0 && (
              <div className="mt-6 space-y-3">
                {videos.map((video, index) => (
                  <div
                    key={`${video.name}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <FaVideo className="shrink-0 text-blue-500" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {video.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {(
                            video.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeVideo(index)
                      }
                      className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"
                      aria-label="Remove video"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <FaVideo />
              {videos.length} / 5 videos selected
            </div>
          </section>

          {/* ======================================
              MAP
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Location & Map
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Provide a Google Maps link for the
                property. This information will be
                protected until the viewing payment is
                completed.
              </p>
            </div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Google Maps URL
            </label>

            <input
              type="url"
              name="mapUrl"
              value={form.mapUrl}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* ======================================
              LANDLORD INFORMATION
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Landlord Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These details are protected and are
                only released after the tenant completes
                the viewing payment.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Landlord Name *
                </label>

                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="landlordName"
                    value={form.landlordName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Landlord Phone *
                </label>

                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="tel"
                    name="landlordPhone"
                    value={form.landlordPhone}
                    onChange={handleChange}
                    placeholder="07XXXXXXXX"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Landlord Email
                </label>

                <input
                  type="email"
                  name="landlordEmail"
                  value={form.landlordEmail}
                  onChange={handleChange}
                  placeholder="landlord@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* ======================================
              CARETAKER INFORMATION
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Caretaker Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Optional. Provide caretaker details if
                applicable.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Caretaker Name
                </label>

                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="caretakerName"
                    value={form.caretakerName}
                    onChange={handleChange}
                    placeholder="Caretaker full name"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Caretaker Phone
                </label>

                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="tel"
                    name="caretakerPhone"
                    value={form.caretakerPhone}
                    onChange={handleChange}
                    placeholder="07XXXXXXXX"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ======================================
              SUBMIT
          ====================================== */}

          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="mt-1 shrink-0 text-blue-600" />

              <div>
                <h3 className="font-bold text-gray-900">
                  Before you submit
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Your property will be reviewed by our
                  administration team before it becomes
                  publicly visible. The viewing fee is
                  automatically assigned according to
                  the property type.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting Property...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt />
                  Submit Property for Approval
                </>
              )}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default ListProperty;