import SectionTitle from "../common/SectionTitle";
import BlogCard from "./BlogCard";

const BlogGrid = ({ posts }) => {
  return (
    <section className="py-20 bg-slate-200">
      <div className="container-custom">
        <SectionTitle
          subtitle="Latest Articles"
          title="Learn More About Real Estate"
          center
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              image={post.image}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              date={post.date}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;
