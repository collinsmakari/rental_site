import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "RentMe | Find Rental Properties in Kenya",
  description = "Find apartments, houses, bedsitters, studios, maisonettes and other rental properties across Kenya with RentMe.",
  keywords = "rental properties Kenya, houses for rent Kenya, apartments for rent Kenya, bedsitters Kenya, houses for rent, apartments for rent",
  image = "/images/seo.jpg",
  url,
  noindex = false,
}) => {
  // Production domain
  const siteUrl = "https://rental-site-eta-six.vercel.app/";

  // Current page URL
  const currentUrl =
    url || `${siteUrl}${window.location.pathname}`;

  // Make social image URL absolute
  const imageUrl = image.startsWith("http")
    ? image
    : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* ========================================
          BASIC SEO
      ======================================== */}

      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      {keywords && (
        <meta
          name="keywords"
          content={keywords}
        />
      )}

      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow"
        }
      />

      <link
        rel="canonical"
        href={currentUrl}
      />

      {/* ========================================
          OPEN GRAPH
      ======================================== */}

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={currentUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      <meta
        property="og:image:alt"
        content={title}
      />

      <meta
        property="og:site_name"
        content="RentMe"
      />

      <meta
        property="og:locale"
        content="en_KE"
      />

      {/* ========================================
          TWITTER / X
      ======================================== */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={imageUrl}
      />

      {/* ========================================
          MOBILE
      ======================================== */}

      <meta
        name="theme-color"
        content="#0f172a"
      />
    </Helmet>
  );
};

export default SEO;