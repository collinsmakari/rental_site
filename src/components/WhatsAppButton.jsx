import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "254710997933";

  const message = encodeURIComponent(
    "Hello, I am interested in the properties listed on your website."
  );

  // WhatsApp app link
  const whatsappAppUrl =
    `whatsapp://send?phone=${phoneNumber}&text=${message}`;

  // WhatsApp web fallback
  const whatsappWebUrl =
    `https://wa.me/${phoneNumber}?text=${message}`;

  const getDefaultPosition = () => {
    const isSmallScreen = window.innerWidth < 640;

    const buttonSize = isSmallScreen ? 40 : 64;
    const rightOffset = isSmallScreen ? 32 : 28;
    const bottomOffset = isSmallScreen ? 110 : 90;

    return {
      x: window.innerWidth - buttonSize - rightOffset,
      y: window.innerHeight - buttonSize - bottomOffset,
    };
  };

  const [position, setPosition] = useState(getDefaultPosition);

  useEffect(() => {
    const handleResize = () => {
      setPosition(getDefaultPosition());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleWhatsAppClick = (event) => {
    // On mobile/tablets, allow the WhatsApp app to open directly.
    if (window.innerWidth < 768) {
      event.preventDefault();

      window.location.href = whatsappAppUrl;
      return;
    }

    // Desktop uses the normal WhatsApp Web link.
    event.currentTarget.href = whatsappWebUrl;
  };

  return (
    <a
      href={whatsappWebUrl}
      onClick={handleWhatsAppClick}
      aria-label="Chat with us on WhatsApp"
      className="
        fixed
        z-[9999]
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-green-500
        text-white
        shadow-xl
        transition-transform
        duration-200
        hover:scale-110
        hover:bg-green-600
        active:scale-95
        sm:h-16
        sm:w-16
      "
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <FaWhatsapp className="text-3xl sm:text-4xl" />

      <span
        className="
          pointer-events-none
          absolute
          right-full
          mr-3
          hidden
          whitespace-nowrap
          rounded-lg
          bg-gray-900
          px-3
          py-2
          text-sm
          text-white
          shadow-lg
          sm:block
        "
      >
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;