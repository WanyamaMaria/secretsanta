import { useNavigate } from "react-router-dom";

const family = [
  {
    photo: "/family/family-01.jpg",
    
  },
  {
    photo: "/family/family-02.jpg",
    
  },
  {
    photo: "/family/family-03.jpg",
    
  },
  {
    photo: "/family/family-04.jpg",
    
  },
  {
    photo: "/family/family-05.jpg",
    
  },
  {
    photo: "/family/family-06.jpg",
    
  },
  {
    photo: "/family/family-07.jpg",
    
  },
  {
    photo: "/family/family-08.jpg",
    
  },
  {
    photo: "/family/family-09.jpg",
    
  },
  {
    photo: "/family/family-10.jpg",
    
  },
  {
    photo: "/family/family-11.jpeg",
  
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">

          <div>
            <p className="text-lg font-black tracking-tight">
              WANYAMA
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Annual Secret Santa
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-200"
            >
              Join the family
            </button>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.20),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.14),_transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              The family game of the year
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              WANYAMA
              <span className="block text-slate-400">
                ANNUAL SECRET SANTA
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-relaxed text-slate-300">
              11 people. 11 secret identities. One very questionable amount
              of guess work.
            </p>

            <p className="mt-4 max-w-lg text-slate-500">
              Pick an identity nobody would ever guess is you.
              Then find out who your secret santa is!!.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/register")}
                className="rounded-2xl bg-white px-7 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-slate-200"
              >
                Enter the investigation
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* HERO PHOTO */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-white/5 blur-2xl" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
              <img
                src="/family/gift.jpeg"
                alt="Family member"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-8 pt-24">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  Your identity is your disguise
                </p>

                <p className="mt-2 text-2xl font-black">
                  Be unpredictable.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SUSPECTS */}
      <section className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">
              Meet the suspects
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              You know them.
              <span className="block text-slate-500">
                You think you know them.
              </span>
            </h2>

            <p className="mt-6 leading-relaxed text-slate-400">
              But this year, everyone has an unknown identity. Nobody knows who is
              hiding behind which identity.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {family.map((person, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 transition duration-500 hover:-translate-y-2 hover:border-white/20"
              >

                <div className="relative aspect-[4/5] overflow-hidden bg-slate-800">

                  {person.photo ? (
                    <img
                      src={person.photo}
                      alt={person.label}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-3 h-12 w-12 rounded-full border border-dashed border-slate-600" />
                        <p className="text-xs text-slate-600">
                          Photo coming soon
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-bold text-white">
                      {person.label}
                    </p>

                    
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1">
            <p className="text-sm font-black text-slate-600">01</p>

            <h3 className="mt-6 text-xl font-bold">
              Create your disguise
            </h3>

            <p className="mt-3 leading-relaxed text-slate-500">
              Register your real details and choose a secret identity.
              Everyone else will only see the identity.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1">
            <p className="text-sm font-black text-slate-600">02</p>

            <h3 className="mt-6 text-xl font-bold">
              Pick a suspect
            </h3>

            <p className="mt-3 leading-relaxed text-slate-500">
              Browse the available identities and select one.
              
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1">
            <p className="text-sm font-black text-slate-600">03</p>

            <h3 className="mt-6 text-xl font-bold">
              Discover your mission
            </h3>

            <p className="mt-3 leading-relaxed text-slate-500">
              Once you make your selection, the real person is revealed
              only to you.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">
            The investigation and secrecy begin?
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Come for the gifts.
            <span className="block text-slate-500">
              Stay for the investigation.
            </span>
          </h2>

          <button
            onClick={() => navigate("/register")}
            className="mt-10 rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-slate-200"
          >
            Create your account
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-600 sm:flex-row">
          <p>Wanyama Annual Secret Santa</p>
          <p>Family only. Secrets strictly enforced.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;
