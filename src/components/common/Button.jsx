import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const Button = ({
  children,
  to,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",

    secondary: "bg-slate-900 text-white hover:bg-slate-800",

    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",

    light: "bg-white text-slate-900 hover:bg-slate-100",
  };

  const styles = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-xl
    px-6
    py-3
    font-semibold
    transition-all
    duration-300
    disabled:cursor-not-allowed
    disabled:opacity-50
    ${variants[variant]}
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={styles}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
