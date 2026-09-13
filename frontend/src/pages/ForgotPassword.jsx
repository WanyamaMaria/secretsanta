import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          username,
        }
      );

      setMessage(response.data.message);

      if (response.data.reset_link) {
        window.location.href = response.data.reset_link;
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">

        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 lg:grid-cols-2">

          <div className="hidden p-12 lg:block">

            <p className="text-sm font-black tracking-[0.25em]">
              WANYAMA
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-600">
              Annual Secret Santa
            </p>

            <div className="mt-32">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-600">
                Lost the key?
              </p>

              <h1 className="mt-4 text-5xl font-black leading-tight">
                Get back into
                <span className="block text-slate-500">
                  the investigation.
                </span>
              </h1>

              <p className="mt-6 max-w-md leading-relaxed text-slate-500">
                Enter your username and we'll help you regain access
                to your Secret Santa account.
              </p>
            </div>

          </div>

          <div className="border-l border-white/10 p-8 sm:p-12">

            <button
              onClick={() => navigate("/login")}
              className="mb-12 text-sm text-slate-500 transition hover:text-white"
            >
              Back to login
            </button>

            <h2 className="text-3xl font-black">
              Forgot password?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Enter your username to create a password reset request.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-700 focus:border-white/30"
                  placeholder="Enter your username"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-200 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : "Create reset request"}
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

    </div>
  );
}

export default ForgotPassword;
