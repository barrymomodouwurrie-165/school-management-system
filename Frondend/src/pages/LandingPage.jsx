import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import SchoolNoticeBoard from "../components/SchoolNoticeBoard";
import Statictics from "../components/Statictics";
import Mainboday from "../components/Mainboday";
import LatestNews from "../components/LatestNews";
import LandingAdminProfile from "../components/LandingAdminProfile";
import Footer from "../components/Footer";

const LandingPage = ({ theme, toggleTheme }) => {
  const revealRoot = useRef(null);

  useEffect(() => {
    const root = revealRoot.current;
    if (!root) return;

    const targets = root.querySelectorAll("[data-scroll-reveal]");
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion) {
      targets.forEach((target) => target.classList.add("is-visible"));
      root.classList.add("scroll-reveal-ready");
      return;
    }

    root.classList.add("scroll-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -48px 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRoot}
      className={
        theme === "dark"
          ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(to_bottom,_#111827,_#0f172a)] text-slate-100"
          : "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.07),_transparent_45%),linear-gradient(to_bottom,_#f8fbff,_#ffffff)] text-slate-800"
      }
    >
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Header />
      <SchoolNoticeBoard />
      <Statictics />
      <Mainboday />
      <LatestNews />
      <LandingAdminProfile />
      <Footer />
    </div>
  );
};

export default LandingPage;
