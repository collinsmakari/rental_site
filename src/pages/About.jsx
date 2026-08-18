import SEO from "../components/common/SEO";
import CompanyStory from "../components/about/CompanyStory";
import MissionVision from "../components/about/MissionVision";
import Statistics from "../components/about/Statistics";
import Team from "../components/about/Team";

const About = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn more about our rental company, our mission, values, experienced team and why thousands trust us."
      />

      <CompanyStory />
      <MissionVision />
      <Statistics />
      <Team />
    </>
  );
};

export default About;