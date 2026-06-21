import admission from "../assets/admission.avif"
import athletic from "../assets/athletic.jpg"
import exam from "../assets/exam.jpg"
import graduation from "../assets/graduation.avif"

const LatestNews = () => {
  return (
    <div className="w-full px-8 py-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-2">Lastest news</h1>
        <div className="flex flex-col">
          <div className="flex items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img
                src={admission}
                alt=""
                className="w-[300px] h-[200px] position-fit"
              />
            </div>
            <p className="flex-1">2026 admission forms now available</p>
            <span>June 18, 2026</span>
          </div>
          <div className="flex items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img src={exam} alt="" className="w-[300px] h-[200px]" />
            </div>
            <p className="flex-1">Grade 9s begin mock exams</p>
            <span>June 10, 2026</span>
          </div>
          <div className="flex items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img src={athletic} alt="" className="w-[300px] h-[200px]" />
            </div>
            <p className="flex-1">Inter-house sports day announced</p>
            <span>June 3, 2026</span>
          </div>
          <div className="flex items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2">
            <div>
              <img src={graduation} alt="" className="w-[300px] h-[200px]" />
            </div>
            <p className="flex-1">Grade 12 graduation date announced</p>
            <span>May 15, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
