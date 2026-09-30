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
        title="RentMe Blog | Rental Guides, Property Tips & Investment Advice"
        description="Read RentMe's latest rental guides, property tips, apartment advice, investment insights and property management articles for tenants and landlords in Kenya."
        keywords="RentMe blog, rental guides Kenya, property tips Kenya, apartment rental tips, houses for rent Kenya, property investment Kenya, property management Kenya, tenant tips Kenya, landlord tips Kenya, rental properties Kenya"
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