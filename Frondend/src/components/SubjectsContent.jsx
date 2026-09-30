const SubjectsContent = () => {
    const SUBJECTS_DATA = [
      {
        id: "1",
        subject: "English Language",
        subject_code: "ENG",
        lead_teacher: "Mr. M.Jallow",
        offered_at: "Both",
      },
      {
        id: "2",
        subject: "Mathematics",
        subject_code: "MTH",
        lead_teacher: "Ms. S.Njie",
        offered_at: "Both",
      },
      {
        id: "3",
        subject: "Geography",
        subject_code: "GEO",
        lead_teacher: "Mr. E.Colley",
        offered_at: "Senior",
      },
      {
        id: "4",
        subject: "G.Science",
        subject_code: "GSC",
        lead_teacher: "Mr. K.Samba",
        offered_at: "Both",
      },
      {
        id: "5",
        subject: "Financial Accounting",
        subject_code: "FAC",
        lead_teacher: "Ms. O.Njie",
        offered_at: "Senior",
      },
    ];
    return (
      <div className="rounded-md shadow-md">
        <div className="grid grid-cols-4 text-base-content/70 text-sm m-2">
          <span>SUBJECT</span>
          <span>CODE</span>
          <span>LEAD TEACHER</span>
          <span>TAUGHT IN</span>
        </div>
        {SUBJECTS_DATA &&
          SUBJECTS_DATA.map((data) => {
            return (
              <div
                key={data.id}
                className="grid grid-cols-4 text-sm border-t p-2"
              >
                <span>{data.subject}</span>
                <span>{data.subject_code}</span>
                <span>{data.lead_teacher}</span>
                <span>{data.offered_at}</span>
              </div>
            );
          })}
      </div>
    );
};

export default SubjectsContent;
