import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Statictics from "../components/Statictics";
import Mainboday from "../components/Mainboday";
import LatestNews from "../components/LatestNews";
import Footer from "../components/Footer";

const LandingPage = ({ latestNews, setLatestNews, theme, toggleTheme }) => {
  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(to_bottom,_#111827,_#0f172a)] text-slate-100"
          : "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.07),_transparent_45%),linear-gradient(to_bottom,_#f8fbff,_#ffffff)] text-slate-800"
      }
    >
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Header />
      <Statictics />
      <Mainboday />
      <LatestNews latestNews={latestNews} setLatestNews={setLatestNews} />
      <Footer />
    </div>
  );
};

export default LandingPage;
