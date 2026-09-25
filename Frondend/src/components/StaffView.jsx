import { BiEdit } from "react-icons/bi";
import { Link } from "react-router";

const StaffView = ({ Staff }) => {
  return (
    Staff &&
    Staff.map((staff) => {
      return (
        <div
          key={staff.id}
          className="grid grid-cols-5 gap-8 md:gap-1 items-center justify-between px-4 py-2 border-t border-base-content/20"
        >
          <span className=" text-xs md:text-base">{staff.subject}</span>
          <span className=" text-xs md:text-base">{staff.name}</span>
          <span className=" text-xs md:text-base">{staff.count}</span>
          <span
            className={`text-${staff.color}-600 text-xs`}
          >
            {staff.schedule}
          </span>
          <div>
            <Link className="btn btn-ghost">
              <BiEdit size={24} className="text-primary" />
            </Link>
          </div>
        </div>
      );
    })
  );
};

export default StaffView;
