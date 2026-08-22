import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Contact Information
        </h2>

        <p className="mt-3 text-slate-600">
          Have questions? Reach out to our friendly team.
        </p>
      </div>

      <InfoCard
        icon={<FaMapMarkerAlt />}
        title="Office Address"
        text="Donholm, Nairobi, Kenya"
      />

      <InfoCard icon={<FaPhoneAlt />} title="Phone" text="+254 700 123 456" />

      <InfoCard
        icon={<FaEnvelope />}
        title="Email"
        text="info@rentmerentals.com"
      />

      <InfoCard
        icon={<FaClock />}
        title="Working Hours"
        text="Mon - Sat: 8:00 AM - 6:00 PM"
      />
    </div>
  );
};

const InfoCard = ({ icon, title, text }) => (
  <div className="flex gap-5 rounded-2xl bg-white p-6 shadow-md">
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
      {icon}
    </div>

    <div>
      <h3 className="font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-slate-600">{text}</p>
    </div>
  </div>
);

export default ContactInfo;
