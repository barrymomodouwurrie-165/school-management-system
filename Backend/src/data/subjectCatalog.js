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
    "Applied Electricity",
    "Electronics",
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

const appliedElectricity = seniorSubjects.find(
  (subject) => subject.name === "Applied Electricity",
);
if (appliedElectricity && !appliedElectricity.programs.includes("Science")) {
  appliedElectricity.programs.push("Science");
}

export const SUBJECT_CATALOG = [...juniorSubjects, ...seniorSubjects];

export const getSubjectAvailabilityData = (subject) => {
  const catalogSubject = SUBJECT_CATALOG.find(
    (item) =>
      item.section === subject.section && item.name === subject.name,
  );
  return catalogSubject
    ? {
        ...subject,
        programs: catalogSubject.programs,
        programStreams: catalogSubject.programStreams ?? [],
      }
    : subject;
};

const setProgramStreams = (subjectName, program, streamNumbers) => {
  const subject = SUBJECT_CATALOG.find(
    (item) => item.section === "Senior" && item.name === subjectName,
  );
  if (!subject) return;

  subject.programStreams = [
    ...(subject.programStreams ?? []).filter(
      (item) => item.program !== program,
    ),
    { program, streamNumbers },
  ];
};

setProgramStreams("Health Science", "Science", [2]);
setProgramStreams("Geography", "Science", [2]);
setProgramStreams("Further Mathematics", "Science", [1]);
setProgramStreams("Applied Electricity", "Science", [1]);
setProgramStreams("Electronics", "Science", [1]);

export const isSubjectAvailableForClass = (subject, classroom) => {
  const availabilityData = getSubjectAvailabilityData(subject);
  if (
    availabilityData.section !== classroom.section ||
    !availabilityData.programs?.includes(classroom.program)
  ) {
    return false;
  }

  const programStream = availabilityData.programStreams?.find(
    (item) => item.program === classroom.program,
  );
  return (
    !programStream || programStream.streamNumbers.includes(classroom.stream_number)
  );
};
