const ClassesResults = ({ data, marks, onMarkChange }) => {
  const test = marks.testScore;
  const exam = marks.examScore;
  const total =
    test !== "" && exam !== ""
      ? Number((Number(test) + Number(exam)).toFixed(2))
      : "";
  const grade =
    total === ""
      ? ""
      : total >= 80
        ? "A"
        : total >= 70
          ? "B"
          : total >= 60
            ? "C"
            : total >= 50
              ? "D"
              : total >= 40
                ? "E"
                : "F";

  return (
    <div className="grid min-w-[680px] grid-cols-6 text-xs md:text-base px-2 py-2 border-b hover:bg-blue-600/10">
      <span>{data.studentId}</span>
      <span>{data.name}</span>
      <input
        aria-label={`Test score for ${data.name}`}
        inputMode="decimal"
        min="0"
        max="30"
        step="any"
        onChange={(event) =>
          onMarkChange(data.id, "testScore", event.target.value)
        }
        value={test}
        type="number"
        className="input input-bordered input-xs max-w-16"
      />
      <input
        aria-label={`Exam score for ${data.name}`}
        inputMode="decimal"
        min="0"
        max="70"
        step="any"
        onChange={(event) =>
          onMarkChange(data.id, "examScore", event.target.value)
        }
        value={exam}
        type="number"
        className="input input-bordered input-xs max-w-16"
      />
      <span className="py-1">{total}</span>
      <span className="py-1">{grade}</span>
    </div>
  );
};

export default ClassesResults;
