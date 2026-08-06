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
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <NavLink to="/" className="text-2xl font-bold text-slate-900">
          RentEase
        </NavLink>

        {/* Desktop */}

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-blue-600"
                  : "text-slate-700 transition hover:text-blue-600"
              }
            >
              {link.name}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Book Now
          </NavLink>
        </nav>

        {/* Mobile */}

        <button onClick={() => setOpen(!open)} className="text-3xl lg:hidden">
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white lg:hidden">
          <div className="flex flex-col p-6">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className="py-3 text-slate-700"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
