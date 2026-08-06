const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
  textarea = false,
  rows = 5,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition duration-300
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-blue-600"
          }`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition duration-300
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-blue-600"
          }`}
        />
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
