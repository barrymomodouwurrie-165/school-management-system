import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getPublicAdminProfile } from "../utils/adminApi";

const LandingAdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublicAdminProfile()
      .then((adminProfile) => {
        if (active) setProfile(adminProfile);
      })
      .catch((loadFailure) => {
        if (active) setError(loadFailure.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      aria-labelledby="landing-admin-profile-heading"
      className="w-full px-6 py-12 sm:px-8"
    >
      <div className="w-full py-4">
        <div className="text-left">
          <p className="text-lg font-semibold uppercase tracking-[0.2em] text-primary">
            School leadership
          </p>
        </div>
        {isLoading ? (
          <p className="mt-8 text-left text-base-content/70">
            Loading admin profile...
          </p>
        ) : error ? (
          <p role="alert" className="mt-8 text-left text-error">
            {error}
          </p>
        ) : profile ? (
          <div className="mt-8 flex flex-col items-start text-left">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={`${profile.fullName || "Admin"} profile picture`}
                className="h-72 w-72 rounded-2xl border border-base-300 object-cover shadow-xl shadow-primary/10 sm:h-80 sm:w-80"
              />
            ) : (
              <div
                role="img"
                aria-label="Admin profile picture not provided"
                className="flex h-72 w-72 items-center justify-center rounded-2xl border border-base-300 bg-base-200 text-base-content/40 shadow-xl shadow-primary/10 sm:h-80 sm:w-80"
              >
                <FaUserCircle className="h-28 w-28" aria-hidden="true" />
              </div>
            )}
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                The Principal
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {"Mr. " + profile.fullName || "Full name not provided"}
              </h3>
              {!profile.fullName && (
                <p className="mt-2 text-sm text-base-content/70">
                  The administrator can add their full name in their profile.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default LandingAdminProfile;
