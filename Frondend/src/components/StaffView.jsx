
const StaffView = ({ Staff }) => {
  return (
    Staff &&
    Staff.map((staff) => {
      return (
        <div
          key={staff.id}
          className="grid grid-cols-3  items-center justify-between px-4 py-2 border-t border-base-content/20"
        >
          <span className=" text-xs md:text-base">{staff.subject}</span>
          <span className=" text-xs md:text-base">{staff.name}</span>
          <span className=" text-xs md:text-base">{staff.count}</span>
        </div>
      );
    })
  );
};

export default StaffView;
