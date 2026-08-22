const SectionTitle = ({
  subtitle,
  title,
  align = "center",
}) => {
  return (
     <div
      className={
        align === "left"
          ? "text-center lg:text-left"
          : "text-center"
      }
    >
      <h2 className="mb-3 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        {subtitle}
      </span>

    </div>
  );
};

export default SectionTitle;