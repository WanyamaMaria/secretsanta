
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "user_id",
        response.data.user_id
      );

      localStorage.setItem(
        "user_name",
        response.data.name
      );

      navigate("/draw");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 md:px-12">
        <button
          onClick={() => navigate("/")}
          className="text-lg font-bold tracking-tight transition-colors duration-300 hover:text-slate-300 sm:text-xl md:text-2xl"
        >
          Wanyama Secret Santa
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            Back to home
          </button>

          <button
            onClick={() => navigate("/register")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-200"
          >
            Register
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative flex min-h-[calc(100vh-88px)] items-center justify-center overflow-hidden px-6 py-16">
        {/* Background effects */}
        <div className="absolute left-[-150px] top-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="absolute bottom-[-150px] right-[-100px] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Login card */}
          <section className="order-2 mx-auto w-full max-w-xl lg:order-1">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl backdrop-blur md:p-10">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Welcome back
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Back to the investigation
                </h1>

                <p className="mt-3 text-slate-400">
                  Your secret identity is waiting.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="Enter your username"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-white/30 focus:ring-2 focus:ring-white/5"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/forgot-password")
                      }
                      className="text-xs font-medium text-slate-500 transition-colors duration-300 hover:text-slate-300"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 pr-14 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-white/30 focus:ring-2 focus:ring-white/5"
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

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-3 w-full rounded-xl bg-white px-6 py-4 font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-200 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading
                    ? "Checking your identity..."
                    : "Enter the Secret Santa"}
                </button>
              </form>

              <div className="mt-7 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account yet?
                </p>

                <button
                  onClick={() => navigate("/register")}
                  className="mt-2 text-sm font-semibold text-slate-300 transition-colors duration-300 hover:text-white"
                >
                  Create your identity
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-slate-700">
              Identity verified. Investigation continues.
            </p>
          </section>

          {/* Right side */}
          <section className="order-1 hidden lg:order-2 lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Step Two
            </p>

            <h2 className="mt-5 max-w-xl text-6xl font-bold leading-[1.05] tracking-tight">
              The suspects
              <span className="block text-slate-400">
                are waiting.
              </span>
            </h2>

            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
              Everyone has chosen an identity. Someone is hiding
              behind every name on that list.
            </p>

            <div className="mt-10 border-l border-white/10 pl-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-600">
                Your objective
              </p>

              <p className="mt-3 text-slate-300">
                Log in, make your draw, discover your recipient,
                and then say absolutely nothing.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;

