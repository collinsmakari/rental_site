import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Executive",
    image: "/images/testimonials/client-1.jpg",
    rating: 5,
    review:
      "The apartment was exactly as advertised. Clean, modern and located close to everything we needed. Booking was simple and customer service was outstanding.",
  },
  {
    id: 2,
    name: "David Kimani",
    role: "Software Engineer",
    image: "/images/testimonials/client-2.jpg",
    rating: 5,
    review:
      "Professional team and excellent communication throughout the rental process. I would definitely recommend them to anyone looking for quality accommodation.",
  },
  {
    id: 3,
    name: "Grace Wanjiku",
    role: "Interior Designer",
    image: "/images/testimonials/client-3.jpg",
    rating: 5,
    review:
      "Beautiful property with premium finishes. The check-in process was smooth and the support team was always available whenever we needed assistance.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Testimonials
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            What Our Clients Say
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            We take pride in delivering exceptional rental experiences for
            families, professionals, and businesses.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              {/* Stars */}
              <div className="mb-6 flex gap-1 text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              {/* Review */}
              <p className="mb-8 leading-8 text-slate-600">
                "{testimonial.review}"
              </p>

              {/* User */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-semibold text-slate-900">
                    {testimonial.name}
                  </h4>

                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statistics */}
        <div className="mt-20 grid gap-8 rounded-3xl bg-emerald-600 px-8 py-12 text-center text-white md:grid-cols-4">
          <div>
            <h3 className="text-4xl font-bold">5K+</h3>
            <p className="mt-2">Happy Clients</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">300+</h3>
            <p className="mt-2">Rental Properties</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">98%</h3>
            <p className="mt-2">Customer Satisfaction</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="mt-2">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
