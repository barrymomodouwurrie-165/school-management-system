const ExamsContent = () => {
  const EXAMS_DATA = [
    {
      id: "1",
      exam: "WASSCE",
      exam_date: "May 19 to June 30",
      section: "Senior",
      status: "Completed",
      color: "green",
    },
    {
      id: "2",
      exam: "End of Second Term Exam",
      exam_date: "16th July to 26th july",
      section: "Both",
      status: "Completed",
      color: "green",
    },
    {
      id: "3",
      exam: "G12 Trials Examination",
      exam_date: "5th April to 12th April",
      section: "Senior",
      status: "Completed",
      color: "green",
    },
    {
      id: "4",
      exam: "First term Exam",
      exam_date: "15th Nov to 5th Dec",
      section: "Both",
      status: "Scheduled",
      color: "blue",
    },
    {
      id: "5",
      exam: "Grade 9 trial Exam",
      exam_date: "1st April to 12th April",
      section: "Junior",
      status: "Scheduled",
      color: "blue",
    },
  ];
  return (
    <div className="rounded-md shadow-md">
      <div className="grid grid-cols-4 text-base-content/70 text-sm m-2">
        <span>EXAM</span>
        <span>DATES</span>
        <span>SECTION</span>
        <span>STATUS</span>
      </div>
      {EXAMS_DATA &&
        EXAMS_DATA.map((data) => {
          return (
            <div
              key={data.id}
              className="grid grid-cols-4 gap-6 md:gap-0 text-xs md:text-sm border-t p-2"
            >
              <span>{data.exam}</span>
              <span>{data.exam_date}</span>
              <span>{data.section}</span>
                  <span className={`bg-${data.color}-600 max-w-20 text-center rounded-md text-white`}>{data.status}</span>
            </div>
          );
        })}
    </div>
  );
};

export default ExamsContent;
