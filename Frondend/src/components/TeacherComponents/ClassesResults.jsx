import { useState } from "react";

const ClassesResults = ({ data }) => {
  const [test, setTest] = useState("");
  const [exam, setExam] = useState("");

  const handleChange = (setter, max) => (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setter(digits === "" ? "" : String(Math.min(Number(digits), max)));
  };

  const total = (Number(test) || 0) + (Number(exam) || 0);
  return (
    <div className="grid grid-cols-5 text-xs md:text-base px-2 py-2 border-b">
      <span>{data.id}</span>
      <span>{data.name}</span>
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={handleChange(setTest, 30)}
        value={test}
        type="text"
        className="input input-bordered input-xs max-w-12"
      />
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={handleChange(setExam, 70)}
        value={exam}
        type="text"
        className="input input-bordered input-xs max-w-12"
      />
      <input
        value={total}
        type="text"
        className="input input-bordered input-xs max-w-12"
        readOnly
      />
    </div>
  );
};

export default ClassesResults;
