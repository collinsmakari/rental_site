import { NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "Rentals", path: "/rentals" },
    { name: "List Your Property", path: "/list-property" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div
        className="
          mx-auto
          flex
          h-16
          w-full
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:h-18
          sm:px-6
          lg:h-20
          lg:px-8
        "
      >
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="
            shrink-0
            whitespace-nowrap
            text-xl
            font-bold
            text-slate-900
            sm:text-2xl
          "
        >
          RentMe
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `
                whitespace-nowrap
                text-sm
                transition
                ${
                  isActive
                    ? "font-semibold text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                }
              `
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Book Now */}
          <NavLink
            to="/contact"
            className="
              shrink-0
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Book Now
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-2xl
            text-slate-800
            transition
            hover:bg-slate-100
            lg:hidden
          "
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="w-full border-t border-slate-200 bg-white shadow-lg lg:hidden">
          <nav className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  block
                  w-full
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  transition
                  ${
                    isActive
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  }
                `
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Book Now */}
            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="
                mt-3
                block
                w-full
                rounded-lg
                bg-blue-600
                px-5
                py-3
                text-center
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Book Now
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;