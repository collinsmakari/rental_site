import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const buttonRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);

  // Calculate the initial position immediately
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

  // Button now has a position immediately instead of waiting for useEffect
  const [position, setPosition] = useState(getDefaultPosition);

  // Keep the default position responsive when the window is resized
  useEffect(() => {
    const handleResize = () => {
      // Only reset position when the button isn't being dragged
      if (!draggingRef.current) {
        setPosition(getDefaultPosition());
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePointerDown = (event) => {
    if (!buttonRef.current) return;

    draggingRef.current = true;
    movedRef.current = false;

    const rect = buttonRef.current.getBoundingClientRect();

    buttonRef.current.setPointerCapture?.(event.pointerId);

    buttonRef.current.dataset.offsetX =
      event.clientX - rect.left;

    buttonRef.current.dataset.offsetY =
      event.clientY - rect.top;
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current || !buttonRef.current) return;

    movedRef.current = true;

    const offsetX = Number(
      buttonRef.current.dataset.offsetX
    );

    const offsetY = Number(
      buttonRef.current.dataset.offsetY
    );

    const buttonWidth = buttonRef.current.offsetWidth;
    const buttonHeight = buttonRef.current.offsetHeight;

    let x = event.clientX - offsetX;
    let y = event.clientY - offsetY;

    // Keep button inside viewport
    const maxX = window.innerWidth - buttonWidth;
    const maxY = window.innerHeight - buttonHeight;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    setPosition({
      x,
      y,
    });
  };

  const handlePointerUp = (event) => {
    if (!draggingRef.current) return;

    draggingRef.current = false;

    buttonRef.current?.releasePointerCapture?.(
      event.pointerId
    );

    // Give the click event a chance to detect the drag
    setTimeout(() => {
      movedRef.current = false;
    }, 50);
  };

  const handleClick = (event) => {
    // Don't open WhatsApp when the button was dragged
    if (movedRef.current) {
      event.preventDefault();
    }
  };

  const phoneNumber = "254710997933";

  const message = encodeURIComponent(
    "Hello, I am interested in the properties listed on your website."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      ref={buttonRef}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      className="
        fixed
        z-[9999]
        flex
        h-10
        w-10
        cursor-grab
        touch-none
        select-none
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
        active:cursor-grabbing
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