import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PropertyDetails from "./pages/PropertyDetails";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Rentals from "./pages/Rentals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/blog" element={<Blog />} />
<Route
  path="/properties/:id"
  element={<PropertyDetails />}
/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/rentals" element={<Rentals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
