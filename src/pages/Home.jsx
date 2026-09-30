import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import FeaturedProperties from "../components/home/FeaturedProperties";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";
import Partners from "../components/home/Partners";
import SEO from "../components/common/SEO";


const Home = () => {
  return (
    <>
<SEO
  title="RentMe | Find Rental Properties in Kenya"
  description="Find apartments, houses, bedsitters, studios, maisonettes and commercial properties for rent across Kenya. Browse rental properties by location, property type and price on RentMe."
  keywords="rental properties Kenya, apartments for rent Kenya, houses for rent Kenya, bedsitters for rent Kenya, studios for rent Kenya, maisonettes for rent Kenya, commercial properties for rent Kenya"
/>

      <Hero />
      <Features />
      <FeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <Partners />
    </>
  );
};

export default Home;
