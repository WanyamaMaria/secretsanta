import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Result() {
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(true);

  const userName =
    localStorage.getItem("user_name") || "Family Member";

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/draw/my-assignment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!response.data.has_drawn) {
          navigate("/draw");
          return;
        }

        setRecipient(response.data.recipient);
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading your assignment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-slate-900 lg:block">

        <div className="p-7">
          <p className="text-xl font-black">WANYAMA</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
            Secret Santa
          </p>
        </div>

        <div className="px-4">

          <button
            onClick={() => navigate("/draw")}
            className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </button>

          <div className="mt-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold">
            My Assignment
          </div>

        </div>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={logout}
            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Log out
          </button>
        </div>

      </aside>

      <main className="lg:ml-64">

        <header className="border-b border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-600">
            Family Secret Santa
          </p>

          <h1 className="mt-1 text-xl font-bold">
            Your assignment
          </h1>
        </header>

        <div className="mx-auto max-w-5xl px-6 py-12">

          <div className="mb-10">
            <p className="text-sm text-slate-500">
              Welcome back, {userName}.
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Your secret has been revealed.
            </h2>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900">

            <div className="p-8 sm:p-12">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                Your Secret Santa recipient
              </p>

              <h3 className="mt-5 break-words text-4xl font-black tracking-tight sm:text-6xl">
                {recipient}
              </h3>

              <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
                This person is your mission for this year's Secret Santa.
                Keep it private. The mystery only works if everyone plays
                their part.
              </p>

            </div>

            <div className="border-t border-white/10 bg-white/[0.03] p-8">

              <div className="grid gap-4 sm:grid-cols-3">

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">
                    Status
                  </p>
                  <p className="mt-2 font-bold text-white">
                    Assignment complete
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">
                    Mission
                  </p>
                  <p className="mt-2 font-bold text-white">
                    Find the perfect gift
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600">
                    Rule
                  </p>
                  <p className="mt-2 font-bold text-white">
                    Keep it secret
                  </p>
                </div>

              </div>

            </div>

          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                Operation
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Don't get caught.
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Your recipient knows nothing. Your family knows nothing.
                Keep your assignment to yourself.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
                Next step
              </p>

              <h3 className="mt-3 text-xl font-bold">
                Start investigating.
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Think about what your recipient likes, what they need,
                and what gift would completely surprise them.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Result;
