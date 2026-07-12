import { Link } from "react-router";
import {
  FaChevronDown,
  FaChevronRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useState } from "react";

const Classmates = () => {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="py-2 px-4">
        <div className="max-w-4xl border rounded-md">
          <input
            type="text"
            placeholder="Search for a student"
            className="input input-bordered w-full max-w-4xl pl-4 rounded-md"
          />
        </div>
        <div className="max-w-4xl py-8 px-4">
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  AB
                </div>
                <p className="flex-1 font-bold">Amadou Baldeh</p>
                <button onClick={()=>{setIsOpen(!isOpen)}}>
                  {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                </button>
              </div>
              {isOpen && (
                <div className="flex flex-col pl-10 pt-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-base-content/70">
                      <FaMapMarkerAlt size={12} />
                      Address
                    </span>
                    <span className="text-sm font-bold">Adum,Kumasi</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-base-content/70">
                      <FaPhoneAlt size={12} />
                      Contact
                    </span>
                    <span className="text-sm font-bold">0201219101</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-base-content/70">
                      <FaEnvelope size={12} />
                      Email
                    </span>
                    <span className="text-sm font-bold">amadou@gmail.com</span>
                  </div>
                </div>
              )}
              
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  FJ
                </div>
                <p className="flex-1 font-bold">Fatou Jallow</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  LC
                </div>
                <p className="flex-1 font-bold">Lamin Ceesay</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  AT
                </div>
                <p className="flex-1 font-bold">Awa Touray</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  MS
                </div>
                <p className="flex-1 font-bold">Modou Sanneh</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  IJ
                </div>
                <p className="flex-1 font-bold">Isatou Jobe</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  OB
                </div>
                <p className="flex-1 font-bold">Ousman Bah</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  HN
                </div>
                <p className="flex-1 font-bold">Haddy Njie</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  EC
                </div>
                <p className="flex-1 font-bold">Ebrima Camara</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  BD
                </div>
                <p className="flex-1 font-bold">Binta Darboe</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  SM
                </div>
                <p className="flex-1 font-bold">Sainey Manneh</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  NF
                </div>
                <p className="flex-1 font-bold">Nyima Faal</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  KG
                </div>
                <p className="flex-1 font-bold">Kebba Gaye</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  RS
                </div>
                <p className="flex-1 font-bold">Ramatoulie Sowe</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col border-b-2 border-b-primary/20 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary p-1">
                  YJ
                </div>
                <p className="flex-1 font-bold">Yankuba Jatta</p>
                <button>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Classmates;
