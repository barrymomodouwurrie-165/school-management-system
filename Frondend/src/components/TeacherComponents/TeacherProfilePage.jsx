import { FaEnvelope, FaPhone, FaUserCircle } from "react-icons/fa";

const TeacherProfilePage = ({ profile, isLoading, error }) => {
  if (isLoading) {
    return <p className="mx-auto max-w-4xl p-4">Loading your profile...</p>;
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-4xl p-4">
        <h1 className="text-lg font-bold">MY PROFILE</h1>
        <p className="mt-3 text-error" role="alert">
          {error || "Your teacher profile is unavailable."}
        </p>
      </main>
    );
  }

  const assignedSubjects = profile.assignedSubjects.length
    ? profile.assignedSubjects
    : profile.primarySubject
      ? [profile.primarySubject]
      : [];
  const showValue = (value) => value || "Not provided";

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="mb-5">
        <h1 className="text-lg font-bold">MY PROFILE</h1>
        <p className="text-sm text-base-content/70">
          Your staff details and teaching assignments.
        </p>
      </header>

      <section className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-md md:p-7">
        <div className="mb-6 flex items-center gap-4 border-b border-base-300 pb-5">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={`${profile.fullName} profile`}
              className="h-20 w-20 rounded-full border-2 border-primary/20 object-cover"
            />
          ) : (
            <FaUserCircle
              className="h-20 w-20 rounded-full border-2 border-base-300 text-base-content/40"
              aria-hidden="true"
            />
          )}
          <div>
            <h2 className="text-xl font-bold">{profile.fullName}</h2>
            <p className="text-sm text-base-content/70">
              {showValue(profile.position)} · Staff ID: {profile.staffId}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileDetail
            icon={<FaEnvelope aria-hidden="true" />}
            label="Email"
            value={showValue(profile.email)}
          />
          <ProfileDetail
            icon={<FaPhone aria-hidden="true" />}
            label="Phone"
            value={showValue(profile.phoneNumber)}
          />
          <ProfileDetail label="Gender" value={showValue(profile.gender)} />
          <ProfileDetail label="Section" value={showValue(profile.section)} />
          <ProfileDetail
            label="Department"
            value={showValue(profile.department)}
          />
          <ProfileDetail
            label="Primary subject"
            value={showValue(profile.primarySubject)}
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <AssignmentList
            title="Teaching subjects"
            items={assignedSubjects}
          />
          <AssignmentList
            title="Teaching classes"
            items={profile.assignedClasses}
          />
          <AssignmentList
            title="Class teacher for"
            items={profile.classTeacherClasses}
          />
        </div>
      </section>
    </main>
  );
};

const ProfileDetail = ({ icon, label, value }) => (
  <div className="rounded-md border border-base-300 p-3">
    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-base-content/60">
      {icon}
      {label}
    </p>
    <p className="mt-1 break-words font-medium">{value}</p>
  </div>
);

const AssignmentList = ({ title, items = [] }) => (
  <section className="rounded-md border border-base-300 p-3">
    <h3 className="mb-2 font-semibold">{title}</h3>
    {items.length ? (
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-md bg-primary/10 px-2 py-1 text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-base-content/60">No assignments</p>
    )}
  </section>
);

export default TeacherProfilePage;
