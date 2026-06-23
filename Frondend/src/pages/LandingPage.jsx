import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Statictics from "../components/Statictics";
import Mainboday from "../components/Mainboday";
import LatestNews from "../components/LatestNews";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Header />
      <Statictics />
      <Mainboday />
      <LatestNews />
      <Footer />
    </div>
  );
};

export default LandingPage;
