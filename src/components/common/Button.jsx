
import { Link } from "react-router-dom";

const Button = ({
  children,
  to,
  type = "button",
  className = "",
  onClick,
}) => {
  const styles = `
    inline-flex
    items-center
    justify-center
    rounded-xl
    bg-blue-500
    px-6
    py-3
    font-semibold
    text-white
    transition-colors
    duration-300
    hover:!bg-blue-700
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-blue-500
    focus-visible:ring-offset-2
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
      className={styles}
    >
      {children}
    </button>
  );
};

export default Button;
