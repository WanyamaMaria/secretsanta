import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Draw() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [identities, setIdentities] = useState([]);
  const [recipient, setRecipient] = useState("");

  const [hasDrawn, setHasDrawn] = useState(false);
  const [waitingForParticipants, setWaitingForParticipants] =
    useState(false);

  const [participantCount, setParticipantCount] = useState(0);
  const [remainingIdentityCount, setRemainingIdentityCount] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState("");

  const totalParticipants = 11;

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDrawData();
  }, [navigate, token]);

  const fetchDrawData = async () => {
    try {
      setLoading(true);
      setError("");
      setWaitingForParticipants(false);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      /*
       * Get the logged-in user's real name.
       */
      const profileResponse = await api.get("/me", {
        headers,
      });

      setName(profileResponse.data.name);

      /*
       * Ask the backend for the draw information.
       */
      const response = await api.get("/draw/available", {
        headers,
      });

      /*
       * If this person has already drawn,
       * the backend returns:
       *
       * {
       *   has_drawn: true,
       *   recipient: "John"
       * }
       */
      if (response.data.has_drawn === true) {
        setHasDrawn(true);
        setRecipient(response.data.recipient);
        setRemainingIdentityCount(response.data.available_count ?? null);
        setIdentities([]);
        return;
      }

      /*
       * If the draw is open, the backend returns
       * an array of available identities.
       */
      setHasDrawn(false);
      setRecipient("");
      setRemainingIdentityCount(null);
      setIdentities(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Draw loading error:", error);

      const detail = error.response?.data?.detail || "";

      /*
       * When fewer than 11 people are registered,
       * the backend intentionally returns 400.
       *
       * This is NOT really an error for the user.
       * It simply means the draw isn't open yet.
       */
      const match = detail.match(/(\d+)\s*\/\s*(\d+)/);

      if (
        error.response?.status === 400 &&
        (match || detail.toLowerCase().includes("draw cannot open yet"))
      ) {
        const count = match ? Number(match[1]) : 0;

        setParticipantCount(count);
        setWaitingForParticipants(true);

        setHasDrawn(false);
        setRecipient("");
        setRemainingIdentityCount(null);
        setIdentities([]);
        setError("");

        return;
      }

      /*
       * Authentication failure.
       */
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");

        navigate("/login");
        return;
      }

      /*
       * Any other backend error.
       */
      setError(
        detail ||
          "Unable to load the Secret Santa dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDraw = async (identityId) => {
    if (selecting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to choose this identity? You cannot change your choice afterwards."
    );

    if (!confirmed) {
      return;
    }

    const currentToken =
      localStorage.getItem("access_token");

    setSelecting(true);
    setError("");

    try {
      const response = await api.post(
        `/draw/${identityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      /*
       * Send the user to the result page.
       */
      navigate("/result", {
        state: {
          recipient: response.data.recipient,
        },
      });
    } catch (error) {
      console.error("Draw error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to complete your draw."
      );

      setSelecting(false);

      /*
       * Refresh the identities in case another
       * family member picked one while this page
       * was open.
       */
      fetchDrawData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");

    navigate("/login");
  };

  /*
   * Loading screen
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white" />

          <p className="mt-5 text-sm text-slate-500">
            Loading your Secret Santa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <div>
            <h1 className="text-lg font-bold tracking-tight md:text-xl">
              WANYAMA ANNUAL SECRET SANTA
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Logout
          </button>

        </div>
      </header>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="relative overflow-hidden px-6 py-8 md:px-10 md:py-12">

        {/* Background decoration */}

        <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-200px] left-[-150px] h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />


        <div className="relative mx-auto max-w-7xl">

          {/* =================================================
              WELCOME
          ================================================== */}

          <section>
            <p className="text-sm font-medium text-slate-500">
              Welcome back,
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              {name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Your Secret Santa mission is right here.
              Choose carefully and keep your assignment private.
            </p>
          </section>


          {/* =================================================
              STATS
          ================================================== */}

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Draw status */}

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Draw status
                </p>

                <span
                  className={`h-2 w-2 rounded-full ${
                    hasDrawn
                      ? "bg-green-400"
                      : waitingForParticipants
                      ? "bg-yellow-400"
                      : "bg-blue-400"
                  }`}
                />

              </div>

              <p className="mt-4 text-2xl font-bold">

                {hasDrawn
                  ? "Completed"
                  : waitingForParticipants
                  ? "Waiting"
                  : "Open"}

              </p>

              <p className="mt-1 text-xs text-slate-600">

                {hasDrawn
                  ? "Your recipient has been assigned"
                  : waitingForParticipants
                  ? "Waiting for all family members"
                  : "Choose your secret identity"}

              </p>

            </div>


            {/* Participants */}

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

              <p className="text-sm text-slate-500">
                {waitingForParticipants
                  ? "People registered"
                  : "Identities available"}
              </p>

              <p className="mt-4 text-2xl font-bold">

                {hasDrawn
                  ? remainingIdentityCount ?? "—"
                  : waitingForParticipants
                  ? `${participantCount} / ${totalParticipants}`
                  : identities.length}

              </p>

              <p className="mt-1 text-xs text-slate-600">

                {waitingForParticipants
                  ? `${totalParticipants - participantCount} more to unlock the draw`
                  : hasDrawn
                  ? "Secret identities not yet picked"
                  : "Secret identities remaining"}

              </p>

            </div>


            {/* Mission */}

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:col-span-2 lg:col-span-1">

              <p className="text-sm text-slate-500">
                Mission
              </p>

              <p className="mt-4 text-2xl font-bold">

                {hasDrawn
                  ? "Protect the secret"
                  : waitingForParticipants
                  ? "Be patient"
                  : "Make your draw"}

              </p>

              <p className="mt-1 text-xs text-slate-600">

                {hasDrawn
                  ? "Nobody needs to know"
                  : waitingForParticipants
                  ? "The family is still assembling"
                  : "One choice. No changes."}

              </p>

            </div>

          </section>


          {/* =================================================
              ALREADY DRAWN
          ================================================== */}

          {hasDrawn ? (

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">

              {/* Assignment */}

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 md:p-9">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      Your assignment
                    </p>

                    <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                      You have your person.
                    </h2>

                  </div>

                  <div className="rounded-lg border border-green-400/20 bg-green-400/5 px-3 py-2 text-xs text-green-400">
                    COMPLETE
                  </div>

                </div>


                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950 p-7">

                  <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
                    Your Secret Santa recipient
                  </p>

                  <p className="mt-4 break-words text-3xl font-bold tracking-tight md:text-5xl">
                    {recipient}
                  </p>

                  <p className="mt-4 max-w-lg text-sm leading-6 text-slate-500">
                    This is your secret. Keep it private
                    and start thinking about what gift would
                    suit them.
                  </p>

                </div>


                <button
                  onClick={() => navigate("/result")}
                  className="mt-6 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-200 hover:shadow-xl"
                >
                  View Full Result
                </button>

              </div>


              {/* Mission */}

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Your mission
                </p>

                <h2 className="mt-4 text-xl font-bold">
                  Keep them guessing.
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Your assignment is secret. Don't reveal
                  who you picked even if someone claims they
                  already know.
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">

                  <p className="text-xs uppercase tracking-[0.2em] text-slate-700">
                    Status
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-300">
                    Secret Santa complete
                  </p>

                </div>

              </div>

            </section>

          ) : waitingForParticipants ? (

            /* =================================================
               WAITING FOR 11 PEOPLE
            ================================================== */

            <section className="mt-8">

              <div className="overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-b from-slate-900 via-slate-900 to-yellow-950/20 shadow-2xl shadow-black/20">

                <div className="px-7 py-12 text-center md:px-12 md:py-16">

                  {/* Status indicator */}

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 shadow-[0_0_45px_rgba(250,204,21,0.12)]">

                    <div className="h-4 w-4 animate-pulse rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.8)]" />

                  </div>


                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300/70">
                    Draw opens at 11 people
                  </p>


                  <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                    Waiting for 11 people
                  </h2>


                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                    The draw will become available once all 11
                    family members have registered.
                  </p>


                  {/* Progress */}

                  <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-left">

                    <div className="flex items-end justify-between">

                      <p className="text-sm font-medium text-slate-300">
                        People registered
                      </p>

                      <p className="text-sm font-bold text-white">
                        {participantCount} / {totalParticipants}
                      </p>

                    </div>


                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            (participantCount /
                              totalParticipants) *
                              100,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* Message */}

                  <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-yellow-400/15 bg-yellow-400/5 px-6 py-6">

                    <p className="text-sm font-semibold text-white">
                      {totalParticipants -
                        participantCount}{" "}
                      more{" "}
                      {totalParticipants -
                        participantCount ===
                      1
                        ? "person"
                        : "people"}{" "}
                      to go.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Secret identities will appear here as soon as
                      the group reaches 11 people.
                    </p>

                  </div>


                  {/* Refresh */}

                  <button
                    onClick={fetchDrawData}
                    className="mt-7 rounded-xl border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-100"
                  >
                    Check again
                  </button>

                </div>

              </div>

            </section>

          ) : (

            /* =================================================
               DRAW OPEN
            ================================================== */

            <section className="mt-8">

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 md:p-9">

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      Make your draw
                    </p>

                    <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                      Choose a secret identity
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                      Every identity belongs to someone in the
                      family. Choose one to discover who you're
                      buying for.
                    </p>

                  </div>


                  <div className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3">

                    <p className="text-xs text-slate-600">
                      AVAILABLE
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {identities.length}
                    </p>

                  </div>

                </div>


                {/* Error */}

                {error && (

                  <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
                    {error}
                  </div>

                )}


                {/* Identity cards */}

                {identities.length === 0 ? (

                  <div className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">

                    <p className="text-sm text-slate-500">
                      No identities are currently available.
                    </p>

                    <button
                      onClick={fetchDrawData}
                      className="mt-5 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                      Refresh
                    </button>

                  </div>

                ) : (

                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {identities.map(
                      (identity, index) => (

                        <button
                          key={identity.id}
                          onClick={() =>
                            handleDraw(identity.id)
                          }
                          disabled={selecting}
                            className="group rounded-2xl border border-white/10 bg-slate-950 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        >

                          <div className="flex items-center justify-between">

                            <span className="text-xs font-semibold text-slate-700">
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <span className="text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-300">
                              →
                            </span>

                          </div>


                          <p className="mt-8 break-words text-lg font-semibold text-slate-200 transition-colors duration-300 group-hover:text-white">
                            {identity.name}
                          </p>


                          <p className="mt-1 text-xs text-slate-600">
                            Secret identity
                          </p>

                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

            </section>

          )}


          {/* =================================================
              BOTTOM INFORMATION
          ================================================== */}

          <section className="mt-8 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                Secret Santa rules
              </p>

              <ul className="mt-4 space-y-3 text-sm text-slate-500">

                <li>
                  One person. One recipient.
                </li>

                <li>
                  Your draw cannot be changed.
                </li>

                <li>
                  Nobody sees your assignment.
                </li>

                <li>
                  Do not reveal your recipient.
                </li>

              </ul>

            </div>


            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                Family investigation
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Everyone is hiding behind an identity.
                The fun part is figuring out who is who
                without giving yourself away.
              </p>

            </div>

          </section>

        </div>

      </main>


      {/* =====================================================
          DRAWING OVERLAY
      ====================================================== */}

      {selecting && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-6 backdrop-blur-md">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-white" />

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
              Processing
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Opening your assignment...
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your identity has been selected. We're revealing
              your Secret Santa recipient.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Draw;