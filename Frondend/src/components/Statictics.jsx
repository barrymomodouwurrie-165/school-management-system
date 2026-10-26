const Statictics = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Established", value: "1998" },
          { label: "Students", value: "1,200+" },
          { label: "Pass rate", value: "93%" },
          { label: "Teaching staff", value: "85" },
        ].map((item, index) => (
          <div
            key={item.label}
            className="card-animate rounded-2xl border border-primary/10 bg-white p-4 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(37,99,235,0.10)] md:p-7"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-primary/80">
              {item.label}
            </span>
            <span className="mt-3 block text-2xl font-black text-slate-800 md:text-3xl">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statictics;
