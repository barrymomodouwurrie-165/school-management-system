import { FaGraduationCap, FaBuilding, FaRegHeart } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";

const Mainboday = () => {
  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              Why choose us
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-slate-800 md:text-4xl">
              A school built for progress.
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: FaGraduationCap,
              title: "Academic excellence",
              text: "Consistently strong WASSCE results",
            },
            {
              icon: HiUserGroup,
              title: "Experienced faculty",
              text: "Qualified, dedicated teaching staff",
            },
            {
              icon: FaBuilding,
              title: "Modern facilities",
              text: "Labs, library, and ICT center",
            },
            {
              icon: FaRegHeart,
              title: "Holistic development",
              text: "Sports, clubs, and mentorship",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="card-animate rounded-[1.5rem] border border-primary/10 bg-primary/5 p-5 shadow-[0_16px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary/10 hover:shadow-[0_24px_40px_rgba(37,99,235,0.12)]"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-primary/10">
                <item.icon size={22} />
              </div>
              <h2 className="mb-2 text-lg font-bold text-slate-800">
                {item.title}
              </h2>
              <span className="text-sm leading-6 text-slate-600">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mainboday;
