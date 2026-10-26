import { useState } from "react";
import {
  FaUserCircle,
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const TeacherProfilePage = () => {
  const [preview, setPreview] = useState(null);
  const [profile, setProfile] = useState({
    id: "100001",
    name: "N.A Mendy",
    email: "nicola@gmail.com",
    phone: "+220833986565",
    department: "Mathematics",
    subject: "Mathematics",
  });

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      image: preview || prev.image,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-1">
        <p className="text-base-content/70">Academic Session: 2024/2025</p>
        <p className="Text-lg">My profile</p>
        <p className="text-base-content/70 text-sm md:text-base">
          Manage your personal contact details, staff credentials, and school
          profile details
        </p>
      </div>
      <div className="p-4 rounded-md shadow-md my-4">
        <div className="">
          <form action="">
            <div className="flex items-center gap-3 mb-4">
              <div className="form-control">
                <label className="label cursor-pointer" htmlFor="image">
                  {preview ? (
                    <div className="relative">
                      <img
                        className="rounded-full h-[80px] w-[80px] border-4 border-blue-600/20"
                        src={preview}
                        alt={preview}
                      />
                      <FaCamera
                        className="absolute bottom-0 left-14 text-blue-600"
                        size={14}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <FaUserCircle className="rounded-full h-[80px] w-[80px] border-2" />
                      <FaCamera
                        className="absolute bottom-0 left-14 text-blue-600"
                        size={14}
                      />
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  onChange={handleImage}
                  accept="image/*"
                  className="hidden cursor-pointer"
                  name=""
                  id="image"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Mr. {profile.name}</span>
                <p className="text-base-content/70">
                  {profile.subject} Teacher
                </p>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600/10 text-blue-600/70 p-1 rounded-md">
                    {profile.department} Department
                  </span>
                  <span className="bg-blue-600/10 text-blue-600/70 p-1 rounded-md">
                    ID: {profile.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="form-control rounded-md shadow-sm">
              <label className="label" htmlFor="name">
                <span className="label-text">Full Name</span>
              </label>
              <div className="relative">
                <input
                  onChange={handleFieldChange("name")}
                  value={profile.name}
                  className="input input-ghost input-sm w-1/2 rounded-md pl-8"
                  type="text"
                  id="name"
                />
                <FaUser className="relative bottom-6 left-2" />
              </div>
            </div>
            <div className="form-control rounded-md shadow-sm">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <input
                  onChange={handleFieldChange("email")}
                  value={profile.email}
                  className="input input-ghost input-sm w-1/2 rounded-md pl-8"
                  type="text"
                  id="email"
                />
                <FaEnvelope className="relative bottom-6 left-2" />
              </div>
            </div>
            <div className="form-control rounded-md shadow-sm">
              <label className="label" htmlFor="phone">
                <span className="label-text">Tel Number</span>
              </label>
              <div className="relative">
                <input
                  onChange={handleFieldChange("phone")}
                  value={profile.phone}
                  className="input input-ghost input-sm w-1/2 rounded-md pl-8"
                  type="text"
                  id="phone"
                />
                <FaPhone className="relative bottom-6 left-2" />
              </div>
            </div>
            <p className="mt-4 text-lg text-blue-600/70">
              INSTITUTIONAL ASSIGNMENT (READ ONLY)
            </p>
            <div className="rounded-md bg-blue-600/10 flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <p>Department</p>
                <span className="p-1 rounded-lg text-bold bg-blue-600/30">
                  Mathematics
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p>Assigned Classes</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="p-1 rounded-md bg-white">10 Agic one</span>
                  <span className="p-1 rounded-md bg-white">
                    11 Science one
                  </span>
                  <span className="p-1 rounded-md bg-white">
                    12 science one
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-end my-4">
              <button className="btn btn-outline btn-sm rounded-md">
                Discard Changes
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary btn-sm rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
