import { FaWifi, FaCar, FaSwimmingPool, FaShieldAlt } from "react-icons/fa";

const amenities = [
  {
    icon: <FaWifi />,
    name: "WiFi",
  },
  {
    icon: <FaCar />,
    name: "Parking",
  },
  {
    icon: <FaSwimmingPool />,
    name: "Swimming Pool",
  },
  {
    icon: <FaShieldAlt />,
    name: "24/7 Security",
  },
];

const PropertyAmenities = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {amenities.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-3 rounded-lg bg-gray-100 p-4"
        >
          <span className="text-blue-600">{item.icon}</span>

          {item.name}
        </div>
      ))}
    </div>
  );
};

export default PropertyAmenities;
