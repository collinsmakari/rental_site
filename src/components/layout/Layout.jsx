import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import WhatsAppButton from "../WhatsAppButton";

const Layout = () => {
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <main className="pt-20">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Layout;
