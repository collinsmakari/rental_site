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
    bg-orange-500
    px-6
    py-3
    font-semibold
    text-white
    transition-all
    duration-300
    
    hover:shadow-lg
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