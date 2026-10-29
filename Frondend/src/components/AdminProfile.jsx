import { useRef, useState } from "react";
import { FaCamera, FaUserCircle } from "react-icons/fa";
import { updateAdminProfile } from "../utils/adminApi";

const MAX_IMAGE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const AdminProfile = ({ profile, isLoading, loadError, onRetry, onProfileUpdated }) => {
  if (isLoading) {
    return <p className="p-4">Loading admin profile...</p>;
  }

  if (loadError || !profile) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">ADMIN PROFILE</h2>
        <p className="mt-3 text-error" role="alert">
          {loadError || "Admin profile is unavailable."}
        </p>
        <button
          type="button"
          className="btn btn-outline btn-sm mt-3"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <AdminProfileEditor
      key={profile.id}
      profile={profile}
      onProfileUpdated={onProfileUpdated}
    />
  );
};

const AdminProfileEditor = ({ profile, onProfileUpdated }) => {
  const [form, setForm] = useState(() => ({
    fullName: profile.fullName || "",
    username: profile.username || "",
    profilePicture: profile.profilePicture || "",
  }));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInput = useRef(null);
  const [imageError, setImageError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError("");
    setError("");
    setSuccess("");
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Profile images must be 1 MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageError("Unable to read the selected image.");
        return;
      }
      setForm((current) => ({ ...current, profilePicture: reader.result }));
    };
    reader.onerror = () =>
      setImageError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const result = await updateAdminProfile({
        ...form,
        password,
      });
      localStorage.setItem("accessToken", result.accessToken);
      setPassword("");
      setForm(result.profile);
      onProfileUpdated(result.profile);
      setSuccess(result.message);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        username: profile.username || "",
        profilePicture: profile.profilePicture || "",
      });
    }
    setPassword("");
    setError("");
    setSuccess("");
    setImageError("");
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-5">
        <h2 className="text-lg font-bold">ADMIN PROFILE</h2>
        <p className="text-sm text-base-content/70">
          Update your account details and profile picture.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-md md:p-7"
      >
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            {form.profilePicture ? (
              <img
                src={form.profilePicture}
                alt="Admin profile"
                className="h-20 w-20 rounded-full border-2 border-primary/20 object-cover"
              />
            ) : (
              <FaUserCircle
                className="h-20 w-20 rounded-full border-2 border-base-300 text-base-content/40"
                aria-label="No profile picture"
              />
            )}
            <FaCamera
              className="absolute bottom-1 right-0 rounded-full bg-primary p-1 text-white"
              size={22}
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="font-bold">{form.fullName || form.username}</p>
            {form.profilePicture && (
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, profilePicture: "" }))
                }
                className="btn btn-ghost btn-xs mt-1"
              >
                Remove picture
              </button>
            )}
            <p className="mt-1 text-xs text-base-content/60">
              JPEG, PNG, or WebP, up to 1 MB.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="form-control sm:col-span-2">
            <label className="label" htmlFor="admin-profile-picture">
              <span className="label-text font-bold">Profile picture</span>
            </label>
            <input
              ref={fileInput}
              id="admin-profile-picture"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="file-input file-input-bordered file-input-sm w-full"
            />
            {imageError && (
              <p className="mt-2 text-sm text-error" role="alert">
                {imageError}
              </p>
            )}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="admin-full-name">
              <span className="label-text font-bold">Full name</span>
            </label>
            <input
              id="admin-full-name"
              className="input input-bordered input-sm w-full"
              value={form.fullName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  fullName: event.target.value,
                }))
              }
              maxLength={120}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="admin-username">
              <span className="label-text font-bold">Username</span>
            </label>
            <input
              id="admin-username"
              className="input input-bordered input-sm w-full"
              value={form.username}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
              maxLength={64}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-control sm:col-span-2">
            <label className="label" htmlFor="admin-new-password">
              <span className="label-text font-bold">New password</span>
            </label>
            <input
              id="admin-new-password"
              type="password"
              className="input input-bordered input-sm w-full"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Leave blank to keep your current password"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
            />
            <span className="label-text-alt mt-1 text-base-content/60">
              Must be at least 6 characters if changing.
            </span>
          </div>
        </div>

        {error && (
          <p className="alert alert-error mt-4 py-2 text-sm" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="alert alert-success mt-4 py-2 text-sm" role="status">
            {success}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-base-300 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline btn-sm"
          >
            Discard changes
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary btn-sm min-w-32"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
