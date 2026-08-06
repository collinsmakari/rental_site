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
        title="ABC Rentals | Apartments, Houses & Commercial Properties"
        description="Find apartments, houses and commercial rental properties across Kenya."
        keywords="apartments for rent Kenya, rental homes, houses, office space"
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
