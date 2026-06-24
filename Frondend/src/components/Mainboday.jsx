import { FaGraduationCap, FaBuilding, FaRegHeart } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";

const Mainboday = () => {
  return (
    <div className="w-full px-8 py-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold font-serif mb-2">Why choose us?</h1>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 justify-between">
          <div className="card bg-primary/40 p-3 border-primary border-t-2">
            <FaGraduationCap size={24} className="text-primary mb-2" />
            <h2 className="font-bold">Academic excellence</h2>
            <span className="text-base-content/70">
              Consistently strong WASSCE results
            </span>
          </div>
          <div className="card bg-primary/40 p-3 border-primary border-t-2">
            <HiUserGroup size={24} className="text-primary mb-2" />
            <h2 className="font-bold">Experienced faculty</h2>
            <span className="text-base-content/70">
              Qualified, dedicated teaching staff
            </span>
          </div>
          <div className="card bg-primary/40 p-3 border-primary border-t-2">
            <FaBuilding size={24} className="text-primary mb-2" />
            <h2 className="font-bold">Modern facilities</h2>
            <span className="text-base-content/70">
              Labs, library, and ICT center
            </span>
          </div>
          <div className="card bg-primary/40 p-3 border-primary border-t-2">
            <FaRegHeart size={24} className="text-primary mb-2" />
            <h2 className="font-bold">Holistic development</h2>
            <span className="text-base-content/70">
              Sports, clubs, and mentorship
            </span>
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default Mainboday;
