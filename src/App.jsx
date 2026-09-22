import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PropertyDetails from "./pages/PropertyDetails";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Rentals from "./pages/Rentals";
import ListProperty from "./pages/ListProperty";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/blog/understanding-rental-agreements" element={<Blog />} />
          <Route path="/blog" element={<Blog />} />
          <Route
  path="/list-property"
  element={<ListProperty />}
/>
<Route
  path="/properties/:id"
  element={<PropertyDetails />}
/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/rentals" element={<Rentals />} />
        </Route>
<Route
  path="/admin/login"
  element={<AdminLogin />}
/>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
