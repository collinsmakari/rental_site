const properties = [
  {
    id: 1,

    // ================= PUBLIC INFORMATION =================

    title: "Modern 2 Bedroom Apartment",
    category: "Apartment",

    image: "/properties/property-1.jpg",

    location: "Kilimani, Nairobi",

    price: 35000,
    period: "month",

    bedrooms: 2,
    bathrooms: 2,
    area: "1,200",

    description:
      "A modern and spacious two-bedroom apartment located in a secure and convenient neighborhood. The property offers comfortable living spaces, quality finishes and easy access to shopping centers, schools, restaurants and major roads.",

    amenities: [
      "Parking",
      "24/7 Security",
      "Water Supply",
      "Wi-Fi",
      "CCTV",
      "Backup Generator",
    ],

    // ================= PROTECTED INFORMATION =================
    // These should eventually come from your backend
    // after successful payment.

    images: [
      "/properties/property-1.jpg",
      "/properties/property-2.jpg",
      "/properties/property-3.jpg",
    ],

    video: "/videos/property-1.mp4",

    mapUrl:
      "https://www.google.com/maps/embed?pb=YOUR_EXACT_PROPERTY_MAP_LINK",

    landlord: {
      name: "John Doe",
      phone: "+254 700 000 000",
      email: "john@example.com",
    },
  },

  // ============================================================
  // PROPERTY 2
  // ============================================================

  {
    id: 2,

    // PUBLIC INFORMATION

    title: "Spacious 3 Bedroom Family House",
    category: "House",

    image: "/properties/property-2.jpg",

    location: "Runda, Nairobi",

    price: 85000,
    period: "month",

    bedrooms: 3,
    bathrooms: 3,
    area: "2,400",

    description:
      "A spacious family home situated in a quiet and secure residential neighborhood. The house features generous living areas, modern finishes, ample parking and a private outdoor space suitable for family living.",

    amenities: [
      "Private Parking",
      "24/7 Security",
      "Garden",
      "Water Supply",
      "CCTV",
      "Servant Quarter",
    ],

    // PROTECTED INFORMATION

    images: [
      "/properties/property-2.jpg",
      "/properties/property-1.jpg",
      "/properties/property-3.jpg",
    ],

    video: "/videos/property-2.mp4",

    mapUrl:
      "https://www.google.com/maps/embed?pb=YOUR_EXACT_PROPERTY_MAP_LINK",

    landlord: {
      name: "Jane Smith",
      phone: "+254 711 000 000",
      email: "jane@example.com",
    },
  },

  // ============================================================
  // PROPERTY 3
  // ============================================================

  {
    id: 3,

    // PUBLIC INFORMATION

    title: "Affordable Bedsitter",
    category: "Bedsitter",

    image: "/properties/property-3.jpg",

    location: "Kasarani, Nairobi",

    price: 12000,
    period: "month",

    bedrooms: 1,
    bathrooms: 1,
    area: "450",

    description:
      "An affordable and conveniently located bedsitter ideal for students, young professionals and individuals looking for comfortable accommodation at an affordable price.",

    amenities: [
      "Water Supply",
      "Security",
      "Parking",
      "Wi-Fi",
      "Electricity",
    ],

    // PROTECTED INFORMATION

    images: [
      "/properties/property-3.jpg",
      "/properties/property-1.jpg",
      "/properties/property-2.jpg",
    ],

    video: "/videos/property-3.mp4",

    mapUrl:
      "https://www.google.com/maps/embed?pb=YOUR_EXACT_PROPERTY_MAP_LINK",

    landlord: {
      name: "Peter Brown",
      phone: "+254 722 000 000",
      email: "peter@example.com",
    },
  },

  // ============================================================
  // PROPERTY 4
  // ============================================================

  {
    id: 4,

    // PUBLIC INFORMATION

    title: "Luxury 4 Bedroom Maisonette",
    category: "Maisonette",

    image: "/properties/property-4.jpg",

    location: "Lavington, Nairobi",

    price: 150000,
    period: "month",

    bedrooms: 4,
    bathrooms: 4,
    area: "3,500",

    description:
      "A luxurious four-bedroom maisonette designed for modern family living. The property offers spacious bedrooms, elegant finishes, a large living area and excellent security in a prestigious residential neighborhood.",

    amenities: [
      "Private Garden",
      "Garage",
      "24/7 Security",
      "CCTV",
      "Backup Generator",
      "Borehole",
      "Servant Quarter",
    ],

    // PROTECTED INFORMATION

    images: [
      "/properties/property-4.jpg",
      "/properties/property-1.jpg",
      "/properties/property-2.jpg",
      "/properties/property-3.jpg",
    ],

    video: "/videos/property-4.mp4",

    mapUrl:
      "https://www.google.com/maps/embed?pb=YOUR_EXACT_PROPERTY_MAP_LINK",

    landlord: {
      name: "Michael Mwangi",
      phone: "+254 733 000 000",
      email: "michael@example.com",
    },
  },

  // ============================================================
  // PROPERTY 5
  // ============================================================

  {
    id: 5,

    // PUBLIC INFORMATION

    title: "Modern Studio Apartment",
    category: "Studio",

    image: "/properties/property-5.jpg",

    location: "Westlands, Nairobi",

    price: 28000,
    period: "month",

    bedrooms: 1,
    bathrooms: 1,
    area: "650",

    description:
      "A stylish modern studio apartment located in the heart of Westlands. The apartment is ideal for professionals looking for convenience, security and easy access to business and entertainment facilities.",

    amenities: [
      "Gym",
      "Swimming Pool",
      "Parking",
      "24/7 Security",
      "CCTV",
      "Elevator",
      "Backup Generator",
    ],

    // PROTECTED INFORMATION

    images: [
      "/properties/property-5.jpg",
      "/properties/property-1.jpg",
      "/properties/property-2.jpg",
    ],

    video: "/videos/property-5.mp4",

    mapUrl:
      "https://www.google.com/maps/embed?pb=YOUR_EXACT_PROPERTY_MAP_LINK",

    landlord: {
      name: "Sarah Wanjiku",
      phone: "+254 744 000 000",
      email: "sarah@example.com",
    },
  },

  // ============================================================
  // PROPERTY 6
  // ============================================================

  {
    id: 6,

    // PUBLIC INFORMATION

    title: "Commercial Office Space",
    category: "Commercial",

    image: "/properties/property-6.jpg",

    location: "Upper Hill, Nairobi",

    price: 120000,
    period: "month",

    bedrooms: 0,
    bathrooms: 2,
    area: "2,000",

    description:
      "A modern commercial office space located in Nairobi's Upper Hill business district. The space is suitable for companies, professional offices, startups and organizations looking for a prestigious business address.",

    amenities: [
      "Reception Area",
      "Parking",
      "Security",
      "CCTV",
      "Elevator",
      "Backup Generator",
      "High-Speed Internet",
    ],

    // PROTECTED INFORMATION

    images: [
      "/properties/property-6.jpg",
      "/properties/property-1.jpg",
      "/properties/property-2.jpg",
    ],

    video: "/videos/property-6.mp4",

    mapUrl:
      "https://www.google.com/maps/embed?pb=YOUR_EXACT_PROPERTY_MAP_LINK",

    landlord: {
      name: "Collins Makari",
      phone: "+254 755 000 000",
      email: "info@example.com",
    },
  },
];

export default properties;