import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const AdminSidebarNav = ({
  NAV_PAGES,
  activePage,
  onNavigate,
  setIsOpen,
  isOpen,
  setIsClick,
}) => {
  const [openMenu, setOpenMenu] = useState(null);

  const HandleNavigate = (id) => {
    onNavigate(id);
    setIsClick(id !== "admin"); 
    setIsOpen?.(!isOpen);
  };

  return (
    <>
      {NAV_PAGES &&
        NAV_PAGES.map((item) => {
          if (item.children) {
            const open = openMenu === item.id;
            const childActive = item.children.some((c) => c.id === activePage);

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setOpenMenu(open ? null : item.id);
                  }}
                  className={`btn btn-ghost w-full justify-start ${childActive ? "btn-active" : ""}`}
                >
                  <item.logo size={18} />
                  {item.label}
                  <FaChevronDown
                    size={12}
                    className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="flex flex-col ml-6 border-l border-white/20">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => HandleNavigate(child.id)
                          
                        }
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

export default AdminSidebarNav;
