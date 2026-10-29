import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FaBars } from "react-icons/fa";
import StaffContentCard from "./StaffContentCard";
import StaffEditForm from "./StaffEditForm";
import { getAdminStaff } from "../utils/adminApi";

const getInitials = (staff) =>
  `${staff.first_name?.[0] ?? ""}${staff.last_name?.[0] ?? ""}`.toUpperCase();

const StaffContent = ({
  isOpen,
  setIsOpen,
  setAssign,
  setStaffName,
  setStaffId,
}) => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStaff, setEditingStaff] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;
    getAdminStaff()
      .then((result) => {
        if (active) setStaff(result);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Unable to load staff records.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return staff;

    return staff.filter((member) =>
      [
        `${member.first_name ?? ""} ${member.last_name ?? ""}`,
        member.first_name,
        member.last_name,
        member.staff_id,
        member.email,
        member.department,
        member.staff_position,
        member.subject_taught,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [staff, search]);

  const staffCards = visibleStaff.map((member) => ({
    ...member,
    id: member._id,
    initials: getInitials(member),
    staff_name: `${member.first_name} ${member.last_name}`,
    role: member.staff_position,
    phone: member.phone_number,
  }));

  if (editingStaff) {
    return (
      <StaffEditForm
        staff={editingStaff}
        onCancel={() => setEditingStaff(null)}
        onSaved={(updatedStaff, message) => {
          setStaff((current) =>
            current.map((member) =>
              member._id === updatedStaff._id ? updatedStaff : member,
            ),
          );
          setEditingStaff(null);
          setSuccessMessage(message || "Staff details updated successfully.");
        }}
      />
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">STAFF DATA</h2>
          <p className="text-base-content/70">
            {isLoading
              ? "Loading staff records..."
              : `${visibleStaff.length} of ${staff.length} staff members shown`}
          </p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={24} />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="mr-2 max-w-[500px] flex-1">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, ID, email or department"
            aria-label="Search staff"
            className="input input-bordered w-full rounded-lg"
          />
        </div>
        <button
          type="button"
          className="btn btn-outline rounded-lg"
          onClick={() => setSearch("")}
        >
          Show all
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      )}
      {successMessage && (
        <p role="status" className="mt-4 text-sm text-success">
          {successMessage}
        </p>
      )}
      {isLoading ? (
        <p role="status" className="py-8 text-center">
          Loading staff records...
        </p>
      ) : staffCards.length ? (
        <div className="my-4 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
          {staffCards.map((data) => (
            <div key={data.id} className="card self-start p-3 shadow-md">
              <StaffContentCard
                data={data}
                setAssign={setAssign}
                setStaffName={setStaffName}
                setStaffId={setStaffId}
                onEdit={(member) => {
                  setSuccessMessage("");
                  setEditingStaff(member);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="my-4 rounded-lg p-6 text-center text-base-content/70 shadow-md">
          {staff.length
            ? "No staff match your search."
            : "No staff records have been registered yet."}
        </p>
      )}
    </div>
  );
};

export default StaffContent;
