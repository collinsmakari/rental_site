import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-bold">RentMe</h2>

          <p className="mt-4 text-slate-400">
            Premium rental solutions for apartments, houses, offices, and
            commercial properties.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">Quick Links</h3>

          <ul className="space-y-3 text-slate-400">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">Contact</h3>

          <ul className="space-y-3 text-slate-400">
            <li>Nairobi, Kenya</li>
            <li>info@rentme.co.ke</li>
            <li>+254 700 000000</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">Follow Us</h3>

          <div className="flex gap-4 text-xl">
            <FaFacebookF />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} RentMe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
