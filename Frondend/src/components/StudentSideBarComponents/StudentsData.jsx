import { useState } from "react";
import { Link } from "react-router";
import {
  FaChevronDown,
  FaChevronRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";


const StudentsData = ({ student }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Link>
        <div
          key={student.id}
          className="flex flex-col border-b-2 border-b-primary/20 py-2"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
              {student.initials}
            </div>
            <p className="flex-1 font-bold">{student.name}</p>
            <button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              {isOpen ? < FaChevronDown />: <FaChevronRight />}
            </button>
          </div>
          {isOpen && (
            <div className="flex flex-col pl-10 pt-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-base-content/70">
                  <FaMapMarkerAlt size={12} />
                  Address
                </span>
                <span className="text-sm font-bold">{student.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-base-content/70">
                  <FaPhoneAlt size={12} />
                  Contact
                </span>
                <span className="text-sm font-bold">{student.contact}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-base-content/70">
                  <FaEnvelope size={12} />
                  Email
                </span>
                <span className="text-sm font-bold">{student.email}</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default StudentsData
