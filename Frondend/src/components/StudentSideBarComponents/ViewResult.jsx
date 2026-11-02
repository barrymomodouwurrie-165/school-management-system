import logo from "../../assets/logo.jpg";

const getTeacherRemark = (averageMarks) => {
  if (averageMarks >= 80) {
    return "Excellent performance. Keep up the outstanding work.";
  }
  if (averageMarks >= 70) {
    return "Very good performance. Keep working hard to achieve even more.";
  }
  if (averageMarks >= 60) {
    return "Good effort. Continue to practice and build on this progress.";
  }
  if (averageMarks >= 40) {
    return "You passed. More consistent study will help improve your results.";
  }
  return "You need to improve. Please seek support and devote more time to your studies.";
};

const ViewResult = ({ result, setViewResult }) => {
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

        <section className="mb-6 grid gap-3 border-y border-slate-300 py-3 sm:grid-cols-3">
          <Summary
            label={
              result.section === "Junior"
                ? "Credit Subjects (A1-C6)"
                : "Subjects with Credit (A-D)"
            }
            value={result.subjectCounts.credits}
          />
          <Summary
            label={
              result.section === "Junior"
                ? "Passed Subjects (D7-E8)"
                : "Subjects Passed (E)"
            }
            value={result.subjectCounts.passed}
          />
          <Summary
            label={
              result.section === "Junior"
                ? "Failed Subjects (F9)"
                : "Subjects Failed (F)"
            }
            value={result.subjectCounts.failed}
          />
        </section>

        <div className="overflow-x-auto">
          <table className="result-mark-table table table-sm">
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
                    {result.section === "Junior"
                      ? subject.grade
                      : `${subject.grade} (${subject.gradePoint.toFixed(1)})`}
                  </td>
                  <td>{subject.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-6 flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="w-full pt-8 text-center sm:w-64">
            <div className="mb-2 h-10 border-b border-slate-700" />
            <p className="font-semibold">{result.publishingAdminName}</p>
            <p className="text-sm text-slate-600">Administrator</p>
            <p className="mt-1 text-xs text-slate-500">Authorized Signature</p>
            <p className="mt-4 text-xs italic text-slate-600">
              This result is unofficial without the Administrator&apos;s
              signature.
            </p>
          </div>

          <div className="w-full space-y-2 sm:w-80">
            <h2 className="border-b border-slate-400 pb-2 text-right font-bold">
              Result Summary
            </h2>
            <Summary label="Total Subjects" value={result.subjects.length} />
            {result.section === "Junior" ? (
              <Summary
                label="Aggregate"
                value={
                  result.aggregate.aggregate === null
                    ? "Incomplete"
                    : result.aggregate.aggregate
                }
              />
            ) : (
              <Summary label="GPA" value={`${result.gpa.toFixed(2)} / 5.00`} />
            )}
            <Summary
              label="Average Marks"
              value={`${result.averageMarks.toFixed(2)} / 100`}
            />
            <Summary label="Remark" value={result.averageRemark} />
            <Summary
              label="Teacher's Remark"
              value={getTeacherRemark(result.averageMarks)}
            />
            {result.section !== "Junior" && (
              <Summary
                label="CGPA"
                value={`${result.cgpa.toFixed(2)} / 5.00`}
              />
            )}
            {result.section === "Junior" &&
              result.aggregate.defaultedCoreSubjects.length > 0 && (
                <p className="pt-2 text-xs text-red-700">
                  Missing core subjects are recorded as a dash and F9
                  (aggregate 9):{" "}
                  {result.aggregate.defaultedCoreSubjects.join(", ")}.
                </p>
              )}
            {result.section === "Junior" &&
              result.aggregate.aggregate === null && (
                <p className="pt-2 text-xs text-red-700">
                  {result.aggregate.additionalSubjectsNeeded > 0 &&
                    "At least one additional subject result is required."}
                </p>
              )}
          </div>
        </section>

      </article>
    </main>
  );
};

const Summary = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-200 py-2">
    <p className="text-sm text-slate-600">{label}</p>
    <p className="text-right text-sm font-bold">{value}</p>
  </div>
);

export default ViewResult;
