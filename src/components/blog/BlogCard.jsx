import { Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";

const BlogCard = ({ image, title, excerpt, category, date, slug }) => {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}

      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}

      <div className="p-6">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          {category}
        </span>

        <h3 className="mt-4 text-2xl font-bold text-slate-900 transition group-hover:text-primary">
          {title}
        </h3>

        <p className="mt-4 leading-7 text-slate-600">{excerpt}</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FaCalendarAlt />
            {date}
          </div>

          <Link
            to={`/blog/${slug}`}
            className="flex items-center gap-2 font-semibold text-primary transition hover:gap-3"
          >
            Read More
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
