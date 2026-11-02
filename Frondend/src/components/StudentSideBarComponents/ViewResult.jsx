import logo from "../../assets/logo.jpg";

const ViewResult = ({ result, setViewResult }) => {
  const subjectCount = result.subjects.length;

  return (
    <main className="mx-auto max-w-5xl p-4">
      <div className="result-print-actions mb-4 flex justify-between">
        <button
          type="button"
          onClick={() => setViewResult(false)}
          className="btn btn-outline btn-sm"
        >
          Back to results
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn btn-primary btn-sm"
        >
          Print Result
        </button>
      </div>

      <article className="print-result rounded-lg border border-base-300 bg-white p-5 text-slate-900 shadow-md sm:p-8">
        <header className="mb-6 flex flex-col items-center gap-3 border-b-2 border-primary pb-5 text-center sm:flex-row sm:text-left">
          <img
            src={logo}
            alt="School logo"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold uppercase sm:text-2xl">
              Barry&apos;s Junior and Secondary School
            </h1>
            <p className="mt-1 text-sm">Student Academic Report</p>
          </div>
        </header>

        <section className="mb-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          <p>
            <strong>Student name:</strong> {result.student.fullName}
          </p>
          <p>
            <strong>Student ID:</strong> {result.student.studentId}
          </p>
          <p>
            <strong>Class:</strong> {result.className}
          </p>
          <p>
            <strong>Academic year:</strong> {result.academicYear}
          </p>
          <p>
            <strong>Term:</strong> {result.evaluationPeriod}
          </p>
        </section>

        <div className="overflow-x-auto">
          <table className="table table-sm border border-slate-300">
            <thead>
              <tr className="border-b border-slate-300">
                <th>Subject</th>
                <th>Test (30)</th>
                <th>Exam (70)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((subject) => (
                <tr key={subject.name} className="result-subject-row">
                  <td>{subject.name}</td>
                  <td>{subject.testScore}</td>
                  <td>{subject.examScore}</td>
                  <td>{subject.total}</td>
                  <td>
                    {subject.grade} ({subject.gradePoint.toFixed(1)})
                  </td>
                  <td>{subject.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <Summary label="Total marks" value={`${result.totalMarks}`} />
          <Summary
            label="Average marks"
            value={`${result.averageMarks.toFixed(2)} / 100`}
          />
          <Summary
            label={`GPA (${subjectCount} subjects)`}
            value={`${result.gpa.toFixed(2)} / 5.00`}
          />
        </section>

        <p className="mt-6 text-xs text-slate-500">
          GPA grade points: A=5, B=4, C=3, D=2, E=1, F=0. GPA is the average
          grade point across subjects with published results.
        </p>
      </article>
    </main>
  );
};

const Summary = ({ label, value }) => (
  <div className="rounded-md border border-slate-300 p-3">
    <p className="text-sm text-slate-600">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default ViewResult;
