import { useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../assets/logo.jpg";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "/about-us" },
  { label: "Academics", href: "#academics" },
  { label: "Admissions", href: "#contact" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

const Navbar = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const getItemHref = (href) =>
    pathname === "/" || href === "/about-us" ? href : `/${href}`;

  return (
    <div className="w-full px-4 pt-4">
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="relative mx-auto max-w-6xl rounded-b-2xl border border-primary/20 bg-white/85 px-3 py-2 shadow-[0_10px_30px_rgba(37,99,235,0.08)] backdrop-blur-md sm:px-4 sm:py-3 md:px-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 p-1 shadow-sm sm:h-12 sm:w-12">
                <img
                  src={logo}
                  alt="School logo"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="developer-credit hidden text-sm text-base-content/70 sm:block">
                  Designed and Developed by BarryDev-HUB
                </p>
                <span className="block text-sm font-bold leading-tight text-slate-800 sm:text-base">
                  Barry's Junior and Secondary School
                </span>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
              <nav
                aria-label="Main navigation"
                className="hidden items-center gap-1 text-primary md:flex"
              >
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={getItemHref(item.href)}
                    className="btn btn-ghost btn-sm rounded-full px-3 text-sm font-medium transition-all duration-300 hover:bg-primary/5 hover:shadow-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                className="btn btn-ghost btn-sm rounded-full border border-primary/20 bg-primary/5 px-2 text-primary shadow-sm md:hidden"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-main-navigation"
              >
                {isMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
                <span className="sr-only">
                  {isMenuOpen ? "Close menu" : "Menu"}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm rounded-full border border-primary/20 bg-primary/5 px-3 text-primary shadow-sm transition-all duration-300 hover:bg-primary/10"
                aria-label="Toggle theme"
              >
                {theme === "corporate" ? (
                  <FaMoon size={14} />
                ) : (
                  <FaSun size={14} />
                )}
                <span className="hidden sm:inline">
                  {theme === "corporate" ? "Dark" : "Light"}
                </span>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <nav
              id="mobile-main-navigation"
              aria-label="Mobile main navigation"
              className="mt-2 grid gap-1 border-t border-primary/10 pt-2 md:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={getItemHref(item.href)}
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-ghost btn-sm justify-start rounded-lg text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
