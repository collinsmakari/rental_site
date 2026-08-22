import SectionTitle from "../common/SectionTitle";
import BlogCard from "./BlogCard";

const BlogGrid = ({ posts }) => {
  return (
    <section className="bg-slate-200 py-20">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionTitle
          subtitle="Latest Articles"
          title="Learn More About Real Estate"
          align="center"
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
              url={post.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;