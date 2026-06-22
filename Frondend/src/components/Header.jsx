import { Link } from "react-router";
import { FiArrowUpRight } from "react-icons/fi";
const Header = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold font-serif text-center">
        Shapping tomorrow's leaders, today
      </h1>
      <p className="max-w-[35rem] text-center">
        A junior and senior secondary school dedicated to academic exellence,
        character, and discipline since 1998.
      </p>
      <div>
        <Link to="/login" className="btn btn-primary">
          Portal login
          <FiArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Header;
