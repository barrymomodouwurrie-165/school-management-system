import { FaRegBell, FaBars } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router";
const AdminNavebar = () => {
  return (
    <div className="fixed left-[220px] top-0 right-0 z-50 justify-between border-b border-base-content/30 bg-white px-2 py-4">
      <div className="flex items-center">
        <div className="mx-4">
          <div>School Logo</div>
          <h1>Admin</h1>
        </div>
        <div className=" relative flex-1 max-w-2xl mr-8">
          <FiSearch size={18} className="absolute top-1/3 left-2" />

          <input
            type="text"
            className="input input-bordered max-w-2xl w-full pl-8"
            placeholder="Search students, staff or records..."
          />
        </div>
        <div className="flex gap-1 ">
          <div className="relative">
            <div className="absolute right-1/4 top-1 text-red-600 font-bold">8</div>
            <Link className="btn btn-ghost text-blue-600">
              <FaRegBell size={24} />
            </Link>
          </div>

          <Link className="btn btn-ghost">
            <FaBars size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavebar;
