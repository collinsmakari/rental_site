import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!form.username || !form.password) {
    setError("Please enter your username and password.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      `${API_URL}/api/admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await response.json();

    console.log("Admin login response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Admin login failed."
      );
    }

    if (!data.token) {
      throw new Error(
        "Login succeeded but no authentication token was returned."
      );
    }

    // Store JWT
    localStorage.setItem(
      "adminToken",
      data.token
    );

    // Store admin information
    localStorage.setItem(
      "adminUser",
      JSON.stringify(data.admin)
    );

    console.log(
      "Admin token saved:",
      localStorage.getItem("adminToken")
    );

    navigate("/admin");
  } catch (error) {
    console.error("Admin login error:", error);

    setError(
      error.message ||
        "Unable to connect to the admin server."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Logo / Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage rental properties
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter admin username"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter admin password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-slate-500 transition hover:text-blue-600"
            >
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;