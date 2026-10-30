const JUNIOR_PROGRAMS = [..."ABCDEFGHIJKLM"];
const JUNIOR_PROGRAMS_EXCEPT_C = JUNIOR_PROGRAMS.filter(
  (program) => program !== "C",
);
const SENIOR_PROGRAMS = [
  "Science",
  "Arts",
  "Commerce",
  "Agric",
  "Home Economics",
  "Technical",
];

const juniorSubjects = [
  "English Language",
  "Mathematics",
  "Social and Environmental Studies",
  "General Science",
  "Agricultural Science",
  "Technical Drawing",
  "Metal Work",
  "French",
  "Home Science",
  "Wood Work",
].map((name) => ({
  name,
  section: "Junior",
  programs: JUNIOR_PROGRAMS,
}));

juniorSubjects.push(
  { name: "I.R.K", section: "Junior", programs: JUNIOR_PROGRAMS_EXCEPT_C },
  { name: "C.R.K", section: "Junior", programs: ["C"] },
);

const seniorSubjectsByProgram = {
  Science: [
    "Physics",
    "Chemistry",
    "Further Mathematics",
    "Geography",
    "Biology",
    "Health Science",
  ],
  Arts: [
    "History",
    "Government",
    "Geography",
    "Literature in English",
    "Visual Arts",
    "Physical Education",
    "French",
    "C.R.K",
    "I.R.K",
    "General Science",
  ],
  Commerce: [
    "Financial Accounting",
    "Cost Accounting",
    "Commerce",
    "Insurance",
    "Marketing",
    "Business Management",
  ],
  Technical: [
    "Technical Drawing",
    "Metal Work",
    "Electronics",
    "Applied Electricity",
    "Wood Work",
    "Auto Mechanics",
  ],
  Agric: [
    "Animal Husbandry",
    "Crop Husbandry",
    "Aqua Culture",
    "Geography",
    "General Science",
    "Physical Education",
    "I.R.K",
    "C.R.K",
  ],
  "Home Economics": [
    "Food and Nutrition",
    "Clothing and Textile",
    "Home Management",
    "Health Science",
    "General Science",
    "I.R.K",
    "C.R.K",
  ],
};

const seniorSubjectPrograms = new Map();
for (const [program, names] of Object.entries(seniorSubjectsByProgram)) {
  for (const name of names) {
    const programs = seniorSubjectPrograms.get(name) ?? [];
    programs.push(program);
    seniorSubjectPrograms.set(name, programs);
  }
}

const seniorSubjects = [
  ...["English Language", "Mathematics", "Civic Education"].map((name) => ({
    name,
    section: "Senior",
    programs: SENIOR_PROGRAMS,
  })),
  ...[...seniorSubjectPrograms].map(([name, programs]) => ({
    name,
    section: "Senior",
    programs,
  })),
];

export const SUBJECT_CATALOG = [...juniorSubjects, ...seniorSubjects];

export const isSubjectAvailableForClass = (subject, classroom) =>
  subject.section === classroom.section &&
  subject.programs.includes(classroom.program);
