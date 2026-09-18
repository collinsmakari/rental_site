import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "254710997033";

  const message = encodeURIComponent(
    "Hello, I am interested in one of the properties listed on your website."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-green-500
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-110
        hover:bg-green-600
        sm:h-16
        sm:w-16
      "
    >
      <FaWhatsapp className="text-3xl sm:text-4xl" />
    </a>
  );
};

export default WhatsAppButton;