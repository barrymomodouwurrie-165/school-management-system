import { Link } from "react-router";
import { FaArrowRight, FaBookOpen, FaHeart, FaLightbulb } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import admissionImage from "../assets/admission.avif";
import graduationImage from "../assets/graduation.avif";
import athleticsImage from "../assets/athletic.jpg";

const AboutUsPage = ({ theme, toggleTheme }) => (
  <div
    className={
      theme === "dark"
        ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(to_bottom,_#111827,_#0f172a)] text-slate-100"
        : "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.07),_transparent_45%),linear-gradient(to_bottom,_#f8fbff,_#ffffff)] text-slate-800"
    }
  >
    <Navbar theme={theme} toggleTheme={toggleTheme} />

    <main className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:pt-32">
      <section className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-white via-primary/5 to-white p-6 shadow-[0_20px_60px_rgba(37,99,235,0.10)] md:grid-cols-[1.05fr_0.95fr] md:p-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            About our school
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-black leading-tight text-slate-800 sm:text-5xl">
            Growing capable minds and confident futures.
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-slate-600">
            Barry&apos;s Junior and Secondary School is a place for students to
            learn, discover their strengths, and build the knowledge and
            character to take their next steps with confidence.
          </p>
          <Link
            to="/#academics"
            className="btn btn-primary mt-7 rounded-full px-6"
          >
            Explore academics <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="relative">
          <img
            src={admissionImage}
            alt="Placeholder: students and school community"
            className="h-64 w-full rounded-3xl object-cover shadow-lg sm:h-80"
          />
          <div className="absolute -bottom-3 -left-2 rounded-2xl border border-primary/10 bg-white/95 px-4 py-3 shadow-lg sm:-left-5">
            <p className="text-sm font-bold text-slate-800">
              Learn. Grow. Lead.
            </p>
            <p className="text-xs text-slate-500">A community for every learner</p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-labelledby="school-purpose">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            What guides us
          </p>
          <h2
            id="school-purpose"
            className="mt-2 text-3xl font-black text-slate-800 sm:text-4xl"
          >
            Our vision and mission
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-primary/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FaLightbulb aria-hidden="true" size={21} />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-800">Our Vision</h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              To nurture a generation of knowledgeable, responsible, and
              compassionate young people who are prepared to contribute
              positively to their communities and the wider world.
            </p>
          </article>
          <article className="rounded-3xl border border-primary/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <FaBookOpen aria-hidden="true" size={21} />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-800">Our Mission</h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              To provide inclusive, engaging education that develops academic
              ability, integrity, discipline, creativity, and a lifelong love
              of learning in every student.
            </p>
          </article>
        </div>
      </section>

      <section className="grid items-center gap-8 rounded-[2rem] bg-slate-900 p-6 text-white sm:p-10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="grid grid-cols-2 gap-3">
          <img
            src={graduationImage}
            alt="Placeholder: students celebrating learning"
            className="h-44 w-full rounded-2xl object-cover sm:h-56"
          />
          <img
            src={athleticsImage}
            alt="Placeholder: students participating in school activities"
            className="mt-7 h-44 w-full rounded-2xl object-cover sm:h-56"
          />
        </div>
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-200">
            <FaHeart aria-hidden="true" size={20} />
          </div>
          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            Learning beyond the classroom
          </h2>
          <p className="mt-4 leading-relaxed text-slate-300">
            We believe a strong school experience brings together thoughtful
            teaching, curiosity, positive relationships, and opportunities to
            explore. Our goal is to help students build confidence, discover
            their interests, and support one another as they grow.
          </p>
        </div>
      </section>

      <section className="py-14 text-center sm:py-16">
        <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Discover what learning here can look like.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Visit our landing page to learn more about academics, admissions, and
          school updates.
        </p>
        <Link to="/" className="btn btn-outline btn-primary mt-5 rounded-full">
          Back to home
        </Link>
      </section>
    </main>

    <Footer />
  </div>
);

export default AboutUsPage;
