import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const TeacherSideBarNav = ({
  NAV_PAGES,
  activePage,
  onNavigate,
  setOpen,
  open,
  //   setIsClick,
}) => {
  const [openMenu, setOpenMenu] = useState(null);

  const HandleNavigate = (id) => {
    onNavigate(id);
    // setIsClick(id !== "admin");
    setOpen?.(!open);
  };

  return (
    <>
      {NAV_PAGES &&
        NAV_PAGES.map((item) => {
          if (item.children) {
            const isOpen = openMenu === item.id;
            const childActive = item.children.some((c) => c.id === activePage);

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setOpenMenu(isOpen ? null : item.id);
                  }}
                  className={`btn btn-ghost w-full justify-start ${childActive ? "btn-active" : ""}`}
                >
                  <item.logo size={18} />
                  {item.label}
                  <FaChevronDown
                    size={12}
                    className={`ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="flex flex-col ml-6 border-l border-white/20">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => HandleNavigate(child.id)}
                        className={`btn btn-ghost btn-sm justify-start ${
                          activePage === child.id ? "btn-active" : ""
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={item.id}>
              <button
                onClick={() => HandleNavigate(item.id)}
                className={`btn btn-ghost w-full justify-start ${
                  activePage === item.id ? "btn-active" : ""
                }`}
              >
                <item.logo size={18} />
                {item.label}
              </button>
            </div>
          );
        })}
    </>
  );
};

export default TeacherSideBarNav;
