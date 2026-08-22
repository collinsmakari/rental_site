import { motion } from "framer-motion";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import SectionTitle from "../common/SectionTitle";

const team = [
  {
    name: "Collins Makari",
    role: "Managing Director",
    image: "/properties/property-1.jpg",
    social: {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/",
    },
  },
  {
    name: "Wayne ladislaus",
    role: "Property Manager",
    image: "/properties/property-2.jpg",
    social: {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/",
    },
  },
  {
    name: "Monica Shiko",
    role: "Sales Consultant",
    image: "/properties/property-3.jpg",
    social: {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/",
    },
  },
];

const Team = () => {
  return (
    <section className="bg-slate-200 py-20">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Team"
          title="Meet Our Professionals"
          align="center"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="overflow-hidden rounded-2xl bg-white shadow-lg"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-96 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {member.name}
                </h3>

                <p className="mt-2 text-primary">
                  {member.role}
                </p>

                <div className="mt-5 flex gap-4 text-lg text-slate-500">
                  {/* Facebook */}
                  <a
                    href={member.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} Facebook`}
                    className="transition hover:text-blue-600"
                  >
                    <FaFacebook />
                  </a>

                  {/* Twitter */}
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} Twitter`}
                    className="transition hover:text-sky-500"
                  >
                    <FaTwitter />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} LinkedIn`}
                    className="transition hover:text-blue-700"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;