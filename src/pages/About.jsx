import SEO from "../components/common/SEO";
import CompanyStory from "../components/about/CompanyStory";
import MissionVision from "../components/about/MissionVision";
import Statistics from "../components/about/Statistics";
import Team from "../components/about/Team";

const About = () => {
  return (
    <>
      {/* ===============================
          ABOUT PAGE SEO
      =============================== */}

      <SEO
        title="About RentMe | Rental Properties in Kenya"
        description="Learn about RentMe, a Kenyan rental property platform helping tenants find apartments, houses, bedsitters, studios and other properties while connecting landlords with prospective tenants."
        keywords="about RentMe, RentMe Kenya, rental property company Kenya, rental platform Kenya, property rentals Kenya, apartments Kenya, houses for rent Kenya"
      />

      {/* ===============================
          COMPANY STORY
      =============================== */}

      <CompanyStory />

      {/* ===============================
          MISSION & VISION
      =============================== */}

      <MissionVision />

      {/* ===============================
          STATISTICS
      =============================== */}

      <Statistics />

      {/* ===============================
          TEAM
      =============================== */}

      <Team />
    </>
  );
};

export default About;