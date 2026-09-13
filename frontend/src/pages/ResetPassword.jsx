import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          new_password: password,
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1800);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto flex min-h-screen max-w-lg items-center px-6">

        <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900 p-8 sm:p-10">

          <button
            onClick={() => navigate("/login")}
            className="mb-10 text-sm text-slate-500 transition hover:text-white"
          >
            Back to login
          </button>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-600">
            Wanyama Secret Santa
          </p>

          <h1 className="mt-4 text-3xl font-black">
            Create a new password
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Choose a new password for your Secret Santa account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                New password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-14 outline-none transition focus:border-white/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border p-2 transition ${
                    showPassword
                      ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
                      : "border-white/10 bg-white/5 text-slate-300"
                  } hover:border-yellow-300/40 hover:bg-yellow-300/10 hover:text-yellow-100`}
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    {showPassword ? (
                      <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.7 4 10 8a11.8 11.8 0 0 1-3.1 4.8M6.2 6.2A12.6 12.6 0 0 0 2 12c1.3 4 5 8 10 8 1.1 0 2.1-.2 3-.6" />
                    ) : (
                      <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="2.5" /></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-14 outline-none transition focus:border-white/30"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border p-2 transition ${
                    showConfirmPassword
                      ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
                      : "border-white/10 bg-white/5 text-slate-300"
                  } hover:border-yellow-300/40 hover:bg-yellow-300/10 hover:text-yellow-100`}
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    {showConfirmPassword ? (
                      <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.7 4 10 8a11.8 11.8 0 0 1-3.1 4.8M6.2 6.2A12.6 12.6 0 0 0 2 12c1.3 4 5 8 10 8 1.1 0 2.1-.2 3-.6" />
                    ) : (
                      <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="2.5" /></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-200 disabled:opacity-50"
            >
              {loading
                ? "Updating password..."
                : "Set new password"}
            </button>

          </form>

          {message && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;
