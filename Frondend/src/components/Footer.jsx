import { Link } from "react-router";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";


const Footer = () => {
  return (
    <footer id="contact" className="w-full px-4 py-4">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 border-t border-primary/50 px-2 py-6 sm:grid-cols-2 sm:px-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-primary">Contact</h2>
          <a
            href="https://maps.google.com/?q=Kumasi%2C+Ghana"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <FaMapMarkerAlt aria-hidden="true" />
            Kumasi, Ghana
          </a>
          <a
            href="mailto:info@school.edu.gh"
            className="flex items-center gap-2 break-all"
          >
            <FaEnvelope aria-hidden="true" />
            info@school.edu.gh
          </a>
        </div>
        <nav aria-label="Quick links" className="flex flex-col items-start gap-2">
          <h2 className="font-bold text-primary">Quick links</h2>
          <a href="/#contact">Admissions information</a>
          <a href="/#academics">Academics</a>
          <a href="/#about">About Us</a>
        </nav>
        <div className="flex flex-col items-start gap-2">
          <h2 className="font-bold text-primary">Portal</h2>
          <Link to="/login?role=admin">Admin Login</Link>
          <Link to="/login?role=student">Student Login</Link>
          <Link to="/login?role=teacher">Staff login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
