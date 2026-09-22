import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "/admin/login";
  };

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/properties/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load pending properties."
        );
      }

      setProperties(data.properties || []);
    } catch (error) {
      console.error(
        "Fetch pending properties error:",
        error
      );

      setError(
        error.message ||
          "Failed to load pending properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const approveProperty = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      const token = getToken();

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/properties/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to approve property."
        );
      }

      setProperties((current) =>
        current.filter(
          (property) => property._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Approve property error:",
        error
      );

      setError(
        error.message ||
          "Failed to approve property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const rejectProperty = async (id) => {
    const reason = window.prompt(
      "Enter the reason for rejecting this property:"
    );

    if (reason === null) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const token = getToken();

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/properties/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reject property."
        );
      }

      setProperties((current) =>
        current.filter(
          (property) => property._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Reject property error:",
        error
      );

      setError(
        error.message ||
          "Failed to reject property."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage submitted rental properties
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchPendingProperties}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900">
            Pending Properties
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review properties submitted by landlords.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-slate-500">
              Loading pending properties...
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              No pending properties
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              All submitted properties have been reviewed.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {properties.map((property) => {
              const image =
                property.images?.[0] || null;

              const isProcessing =
                actionLoading === property._id;

              return (
                <article
                  key={property._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={property.title}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-slate-200 text-slate-500">
                      No image available
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {property.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {property.location}
                        </p>
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Property Type
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {property.propertyType}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Monthly Rent
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          KSh{" "}
                          {Number(
                            property.price || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Deposit
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          KSh{" "}
                          {Number(
                            property.deposit || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Viewing Fee
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          KSh{" "}
                          {Number(
                            property.viewingFee || 0
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {property.description}
                    </p>

                    <div className="mt-5 rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Landlord
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {property.landlordName ||
                          "Not provided"}
                      </p>

                      <p className="text-sm text-slate-500">
                        {property.landlordPhone ||
                          "No phone provided"}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          approveProperty(
                            property._id
                          )
                        }
                        className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          rejectProperty(
                            property._id
                          )
                        }
                        className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;