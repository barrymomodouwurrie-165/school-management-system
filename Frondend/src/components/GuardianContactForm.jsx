const GuardianContactForm = ({
  children,
  contact,
  fieldClass,
  isDark,
  isUpdating,
  mutedClass,
  onChange,
  onSubmit,
  surfaceClass,
}) => (
  <section
    className={`scroll-mt-24 rounded-2xl border p-5 shadow-xl sm:p-6 ${surfaceClass}`}
  >
    <h3 className="mb-1 text-xl font-bold tracking-tight">
      Contact the school
    </h3>
    <p className={`mb-5 text-sm ${mutedClass}`}>
      Send a question or concern to the school office about your child.
    </p>
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="form-control">
        <span
          className={`label-text mb-1 text-sm font-semibold ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          Child
        </span>
        <select
          className={`select select-bordered ${fieldClass}`}
          value={contact.studentId}
          onChange={(event) => onChange("studentId", event.target.value)}
          required
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.fullName}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control">
        <span
          className={`label-text mb-1 text-sm font-semibold ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          Message type
        </span>
        <select
          className={`select select-bordered ${fieldClass}`}
          value={contact.type}
          onChange={(event) => onChange("type", event.target.value)}
        >
          <option value="suggestion">Question or suggestion</option>
          <option value="complaint">Concern</option>
        </select>
      </label>

      <label className="form-control">
        <span
          className={`label-text mb-1 text-sm font-semibold ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          Topic
        </span>
        <select
          className={`select select-bordered ${fieldClass}`}
          value={contact.category}
          onChange={(event) => onChange("category", event.target.value)}
        >
          <option>Progress</option>
          <option>Attendance</option>
          <option>Exams</option>
          <option>General inquiry</option>
        </select>
      </label>

      <label className="form-control">
        <span
          className={`label-text mb-1 text-sm font-semibold ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          Subject
        </span>
        <input
          className={`input input-bordered ${fieldClass}`}
          value={contact.subject}
          onChange={(event) => onChange("subject", event.target.value)}
          maxLength={160}
          required
        />
      </label>

      <label className="form-control md:col-span-2">
        <span
          className={`label-text mb-1 text-sm font-semibold ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          Message
        </span>
        <textarea
          className={`textarea textarea-bordered min-h-28 ${fieldClass}`}
          value={contact.details}
          onChange={(event) => onChange("details", event.target.value)}
          maxLength={3000}
          required
        />
      </label>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isUpdating}
          className="btn btn-primary"
        >
          {isUpdating ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  </section>
);

export default GuardianContactForm;
