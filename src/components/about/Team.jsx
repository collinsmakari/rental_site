import { motion } from "framer-motion";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import SectionTitle from "../common/SectionTitle";

const team = [
  {
    name: "John Doe",
    role: "Managing Director",
    image: "/images/team/team1.jpg",
  },
  {
    name: "Jane Smith",
    role: "Property Manager",
    image: "/images/team/team2.jpg",
  },
  {
    name: "Peter Brown",
    role: "Sales Consultant",
    image: "/images/team/team3.jpg",
  },
];

const Team = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <SectionTitle
          subtitle="Our Team"
          title="Meet Our Professionals"
          center
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
                <h3 className="text-xl font-bold">{member.name}</h3>

                <p className="mt-2 text-primary">{member.role}</p>

                <div className="mt-5 flex gap-4 text-lg text-slate-500">
                  <FaFacebook />
                  <FaTwitter />
                  <FaLinkedin />
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
