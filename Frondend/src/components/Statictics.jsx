import { useEffect, useState } from "react";
import { getPublicSchoolOverview } from "../utils/communicationApi";

const STATISTICS = [
  { key: "students", label: "Active students" },
  { key: "teachingStaff", label: "Teaching staff" },
  { key: "activeClassrooms", label: "Active classes" },
  { key: "subjects", label: "Subjects offered" },
];

const Statictics = () => {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getPublicSchoolOverview()
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-8 md:px-8"
      aria-label="School statistics"
    >
      {error && (
        <p className="mb-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATISTICS.map((item, index) => (
          <div
            key={item.key}
            className="card-animate rounded-2xl border border-primary/10 bg-base-100 p-4 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(37,99,235,0.10)] md:p-7"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              {item.label}
            </span>
            <span className="mt-3 block text-2xl font-black text-base-content md:text-3xl">
              {overview ? overview[item.key].toLocaleString() : "--"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statictics;
