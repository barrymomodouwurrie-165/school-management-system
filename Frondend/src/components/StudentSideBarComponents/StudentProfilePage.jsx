import { FaUserCircle } from "react-icons/fa";

const formatDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
};

const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const showValue = (value) => value || "Not provided";

const StudentProfilePage = ({ profile, isLoading, error }) => {
  if (isLoading) {
    return <p className="mx-auto max-w-4xl p-4">Loading your profile...</p>;
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-4xl p-4">
        <h1 className="text-lg font-bold">MY PROFILE</h1>
        <p className="mt-3 text-error" role="alert">
          {error || "Your student profile is unavailable."}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="mb-5">
        <h1 className="text-lg font-bold">MY PROFILE</h1>
        <p className="text-sm text-base-content/70">
          Your personal details and school information.
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
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-base-300 bg-primary/10 text-xl font-bold text-primary">
              {getInitials(profile.fullName) || (
                <FaUserCircle
                  className="h-16 w-16 text-base-content/40"
                  aria-hidden="true"
                />
              )}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{profile.fullName}</h2>
            <p className="text-sm text-base-content/70">
              Student ID: {showValue(profile.studentId)}
            </p>
          </div>
        </div>

        <ProfileSection title="School information">
          <ProfileDetail label="Student ID" value={showValue(profile.studentId)} />
          <ProfileDetail label="Section" value={showValue(profile.section)} />
          <ProfileDetail label="Class" value={showValue(profile.className)} />
          <ProfileDetail
            label="Enrollment date"
            value={formatDate(profile.enrollmentDate)}
          />
          <ProfileDetail label="Status" value={showValue(profile.status)} />
          <ProfileDetail
            label="Previous school"
            value={showValue(profile.previousSchool)}
          />
          <ProfileDetail
            label="Class teacher"
            value={showValue(profile.classTeacher?.name)}
          />
          <ProfileDetail
            label="Class teacher phone"
            value={showValue(profile.classTeacher?.phoneNumber)}
          />
          <ProfileDetail
            label="Class teacher email"
            value={showValue(profile.classTeacher?.email)}
          />
        </ProfileSection>

        <ProfileSection title="Personal information">
          <ProfileDetail label="Gender" value={showValue(profile.gender)} />
          <ProfileDetail
            label="Date of birth"
            value={formatDate(profile.dateOfBirth)}
          />
          <ProfileDetail
            label="Nationality"
            value={showValue(profile.nationality)}
          />
          <ProfileDetail
            label="Phone"
            value={showValue(profile.phoneNumber)}
          />
          <ProfileDetail
            label="Ethnicity"
            value={showValue(profile.ethnicity)}
          />
          <ProfileDetail label="Religion" value={showValue(profile.religion)} />
        </ProfileSection>

        <ProfileSection title="Guardian information">
          <ProfileDetail
            label="Guardian"
            value={showValue(profile.guardian?.name)}
          />
          <ProfileDetail
            label="Guardian phone"
            value={showValue(profile.guardian?.phoneNumber)}
          />
          <ProfileDetail
            label="Guardian email"
            value={showValue(profile.guardian?.email)}
          />
          <ProfileDetail
            label="Guardian address"
            value={showValue(profile.guardian?.address)}
          />
        </ProfileSection>
      </section>
    </main>
  );
};

const ProfileSection = ({ title, children }) => (
  <section className="mb-6 last:mb-0">
    <h3 className="mb-3 font-semibold">{title}</h3>
    <div className="grid gap-3 sm:grid-cols-2">{children}</div>
  </section>
);

const ProfileDetail = ({ label, value }) => (
  <div className="rounded-md border border-base-300 p-3">
    <p className="text-xs font-semibold uppercase text-base-content/60">
      {label}
    </p>
    <p className="mt-1 break-words font-medium">{value}</p>
  </div>
);

export default StudentProfilePage;
