const ClassesContent = () => {
    const CLASS_DATA = [
        {   id: "1",
            class: "Grade 7A",
            section: "Junior",
            class_teacher: "Mr. A.Jallow",
            total_students: "60"
        },
        {   id: "2",
            class: "Grade 7B",
            section: "Junior",
            class_teacher: "Ms. A.Njie",
            total_students: "58"
        },
        {   id: "3",
            class: "Grade 8A",
            section: "Junior",
            class_teacher: "Mr. N.Mendy",
            total_students: "60"
        },
        {   id: "4",
            class: "Grade 8B",
            section: "Junior",
            class_teacher: "Mr. K.Samba",
            total_students: "55"
        },
        {   id: "5",
            class: "Grade 9A",
            section: "Junior",
            class_teacher: "Ms. Z.Manga",
            total_students: "60"
        }
    ]
    return (
    <div className="rounded-md shadow-md">
      <div className="grid grid-cols-4 text-base-content/70 text-sm m-2">
        <span>CLASS</span>
        <span>SECTION</span>
        <span>CLASS TEACHER</span>
        <span>#STUDENTS</span>
            </div>
            {CLASS_DATA && CLASS_DATA.map((data) => {
                return (
                  <div key={data.id} className="grid grid-cols-4 text-sm border-t p-2">
                    <span>{data.class}</span>
                    <span>{data.section}</span>
                    <span>{data.class_teacher}</span>
                    <span>{data.total_students}</span>
                  </div>
                );
            })}
      
    </div>
  );
};

export default ClassesContent;
