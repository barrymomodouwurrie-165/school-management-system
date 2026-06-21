import { Link } from "react-router";
const Navbar = () => {
  return (
    <div className="w-full p-4">
      <div className="max-w-6xl mx-auto py-2 px-4 flex flex-col  md:flex-row justify-between items-center border-b border-primary/50">
        <div className="flex items-center gap-2">
          <div className="border border-primary px-2 py-4"> School Logo</div>
          <span className="font-bold">Barry's Junior and Secondary School</span>
        </div>
        <div className="flex items-center text-primary">
          <Link className="btn btn-ghost">Home</Link>
          <Link className="btn btn-ghost">About</Link>
          <Link className="btn btn-ghost">Academics</Link>
          <Link className="btn btn-ghost">Admissions</Link>
          <Link className="btn btn-ghost">News</Link>
          <Link className="btn btn-ghost">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
