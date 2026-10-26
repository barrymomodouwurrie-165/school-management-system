import { Link } from "react-router";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  return (
    <div className="w-full px-4 pt-4">
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-6xl rounded-b-2xl border border-primary/20 bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(37,99,235,0.08)] backdrop-blur-md md:px-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/5 p-1 shadow-sm">
                <img src={logo} alt="School logo" className="h-full w-full rounded-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
                  School
                </p>
                <span className="text-base font-bold text-slate-800">
                  Barry's Junior and Secondary School
                </span>
              </div>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-1 text-primary">
              {[
                "Home",
                "About",
                "Academics",
                "Admissions",
                "News",
                "Contact",
              ].map((item) => (
                <Link
                  key={item}
                  className="btn btn-ghost btn-sm rounded-full px-3 text-sm font-medium transition-all duration-300 hover:bg-primary/5 hover:shadow-sm"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
