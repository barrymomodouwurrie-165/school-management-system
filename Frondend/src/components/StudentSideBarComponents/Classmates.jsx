import StudentsData from "./StudentsData";

const students = [
  {
    id: "1",
    initials: "AB",
    name: "Amadou Baldeh",
    address: "Serrekunda, Kanifing",
    contact: "2203456781",
    email: "amadou.baldeh@gmail.com",
  },
  {
    id: "2",
    initials: "FJ",
    name: "Fatou Jallow",
    address: "Bakau, Kanifing",
    contact: "2203456782",
    email: "fatou.jallow@gmail.com",
  },
  {
    id: "3",
    initials: "LC",
    name: "Lamin Ceesay",
    address: "Brikama, West Coast",
    contact: "2203456783",
    email: "lamin.ceesay@gmail.com",
  },
  {
    id: "4",
    initials: "MS",
    name: "Mariama Sanyang",
    address: "Banjul, Banjul",
    contact: "2203456784",
    email: "mariama.sanyang@gmail.com",
  },
  {
    id: "5",
    initials: "ET",
    name: "Ebrima Touray",
    address: "Sukuta, Kanifing",
    contact: "2203456785",
    email: "ebrima.touray@gmail.com",
  },
  {
    id: "6",
    initials: "AB",
    name: "Awa Bojang",
    address: "Gunjur, West Coast",
    contact: "2203456786",
    email: "awa.bojang@gmail.com",
  },
  {
    id: "7",
    initials: "MJ",
    name: "Momodou Jatta",
    address: "Farafenni, North Bank",
    contact: "2203456787",
    email: "momodou.jatta@gmail.com",
  },
  {
    id: "8",
    initials: "IS",
    name: "Isatou Sowe",
    address: "Lamin, West Coast",
    contact: "2203456788",
    email: "isatou.sowe@gmail.com",
  },
  {
    id: "9",
    initials: "OD",
    name: "Ousman Darboe",
    address: "Basse, Upper River",
    contact: "2203456789",
    email: "ousman.darboe@gmail.com",
  },
  {
    id: "10",
    initials: "BM",
    name: "Binta Manneh",
    address: "Kanifing, Kanifing",
    contact: "2203456790",
    email: "binta.manneh@gmail.com",
  },
];

const Classmates = () => {
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
        <h2 className="mt-4 mb-2 font-bold">KNOW YOUR CLASSMATES</h2>
        <div className="max-w-4xl px-4">
          {students &&
            students.map((student) => {
              return (
                <StudentsData key={student.id} student={student} />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Classmates;
