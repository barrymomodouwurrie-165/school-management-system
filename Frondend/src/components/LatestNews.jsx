import admission from "../assets/admission.avif";
import athletic from "../assets/athletic.jpg";
import exam from "../assets/exam.jpg";
import graduation from "../assets/graduation.avif";

const LatestNews = () => {
  return (
    <div className="w-full px-8 py-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-2">Lastest news</h1>
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img
                src={admission}
                alt=""
                className="w-[300px] h-[200px] position-fit"
              />
            </div>
            <p className="flex-1">
              <b>
                Headline: 🎓 Admissions Open for the 2026/2027 Academic Year at
                Bright Future Academy
              </b>
              <br />
              News: Bright Future Academy is pleased to announce that admissions
              for the 2026/2027 academic year are now open. Applications are
              invited for Kindergarten, Primary, and Junior High School levels.
              Interested parents and guardians are encouraged to obtain
              admission forms from the school office before the application
              deadline.
            </p>
            <span>June 18, 2026</span>
          </div>
          <div className="flex flex-col md:flex-row items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img src={exam} alt="" className="w-[300px] h-[200px]" />
            </div>
            <p className="flex-1">
              <b>
                Headline: 📝 Grade 9 Mock Examinations to Commence Next Week
              </b>
              <br />
              News: The school administration wishes to inform all Grade 9
              students that the mock examinations will commence next week.
              Students are encouraged to complete their revisions, adhere to
              examination regulations, and arrive punctually for each paper. The
              mock exams are designed to prepare candidates for their final
              assessments.
            </p>
            <span>June 10, 2026</span>
          </div>
          <div className="flex flex-col md:flex-row items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img src={athletic} alt="" className="w-[300px] h-[200px]" />
            </div>
            <p className="flex-1">
              <b>Headline: 🏆 Annual Inter-House Sports Day Announced</b>
              <br />
              News: The school is excited to announce that the Annual
              Inter-House Sports Day will be held later this month. Students
              from all houses will compete in various track and field events.
              Parents and guardians are warmly invited to attend and support
              participants as they showcase their talents and sportsmanship.
            </p>
            <span>June 3, 2026</span>
          </div>
          <div className="flex flex-col md:flex-row items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img src={graduation} alt="" className="w-[300px] h-[200px]" />
            </div>
            <p className="flex-1">
              <b>Headline: 🎓 Grade 12 Graduation Ceremony Announced</b>
              <br />
              News: The school proudly announces that the Grade 12 Graduation
              Ceremony will be held next month to celebrate the achievements of
              the graduating class. Students, parents, staff, and invited guests
              are encouraged to attend this memorable occasion as graduates mark
              the successful completion of their secondary education journey.
            </p>
            <span>May 15, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
