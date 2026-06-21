import { Link } from "react-router";


const Footer = () => {
  return (
    <div className="w-full p-4">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-top justify-between border-primary/50 border-t">
        <div className="flex flex-col">
          <h2 className="text-primary font-bold">Contact</h2>
          <p>Kumasi, Ghana</p>
          <p>info@school.edu.gh</p>
        </div>
        <div className="flex flex-col">
          <h2 className="text-primary font-bold">Quick links</h2>
          <Link>Admissions</Link>
          <Link>Academics</Link>
          <Link>About Us</Link>
        </div>
        <div className="flex flex-col">
          <h2 className="text-primary font-bold">Portal</h2>
          <Link>Admin Login</Link>
          <Link>Student Login</Link>
          <Link>Staff login</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
