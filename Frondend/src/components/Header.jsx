import { Link } from "react-router";
import { FiArrowUpRight } from "react-icons/fi";

const Header = () => {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-8 pt-28 md:pt-32">
      <div className="hero-animate overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-white via-primary/5 to-white p-6 shadow-[0_20px_60px_rgba(37,99,235,0.10)] md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Since 1998
            </span>

            <h1 className="max-w-xl font-serif text-4xl font-black leading-tight text-slate-800 md:text-5xl lg:text-6xl">
              Shaping tomorrow's leaders, today.
            </h1>

            <p className="mt-5 max-w-lg text-base text-slate-600 md:text-lg">
              A junior and senior secondary school dedicated to academic excellence,
              character, and discipline — empowering every learner to thrive with
              confidence and purpose.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <Link
                to="/login"
                className="btn btn-primary rounded-full px-6 shadow-[0_12px_24px_rgba(37,99,235,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(37,99,235,0.25)]"
              >
                Portal Login
                <FiArrowUpRight size={18} />
              </Link>
              <Link
                to="/"
                className="btn btn-outline btn-primary rounded-full px-6 transition-all duration-300 hover:-translate-y-0.5"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="card-animate flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-[1.75rem] border border-primary/15 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
              <div className="rounded-[1.5rem] bg-primary/5 p-5">
                <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
                      Academic Standard
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-800">93%</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl text-white shadow-lg shadow-primary/20">
                    ✦
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    { label: "Student Success", value: "1,200+" },
                    { label: "Teaching Staff", value: "85" },
                    { label: "WASSCE Performance", value: "A-Grade" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white px-4 py-3"
                    >
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
