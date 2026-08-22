import { useState } from "react";
import SEO from "../components/common/SEO";
import BlogGrid from "../components/blog/BlogGrid";
import Categories from "../components/blog/Categories";
import blogPosts from "../data/blogData";

const categories = [
  "All",
  "Apartments",
  "Guides",
  "Investment",
  "Property Management",
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <>
      <SEO
        title="Real Estate Blog"
        description="Read the latest articles, property investment tips, rental guides, and real estate insights."
      />

      <section className="bg-white py-10">
        <div className="container-custom">
          <Categories
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <BlogGrid posts={filteredPosts} />
        </div>
      </section>
    </>
  );
};

export default Blog;
