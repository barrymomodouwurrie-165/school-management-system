import StudentSubmissionPage from "./StudentSubmissionPage";

const ReportStudent = () => (
  <StudentSubmissionPage
    config={{
      type: "student-report",
      title: "Report a Student",
      description:
        "Share a concern about a fellow student with the school administration.",
      submitLabel: "Submit report",
      fields: [
        {
          name: "student",
          label: "Student name or ID",
          placeholder: "Enter the student's name or ID",
          fullWidth: true,
        },
        {
          name: "category",
          label: "Report category",
          type: "select",
          options: [
            { value: "behavior", label: "Behavior" },
            { value: "academic", label: "Academic concern" },
            { value: "attendance", label: "Attendance" },
            { value: "bullying", label: "Bullying or safety" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: "urgency",
          label: "Urgency",
          type: "select",
          options: [
            { value: "standard", label: "Standard" },
            { value: "urgent", label: "Urgent" },
            { value: "very-urgent", label: "Very urgent" },
          ],
        },
        {
          name: "description",
          label: "What would you like to report?",
          type: "textarea",
          placeholder:
            "Describe what happened and include relevant details.",
          maxLength: 3000,
          fullWidth: true,
        },
        {
          name: "notifyGuardian",
          type: "checkbox",
          required: false,
          description: "Recommend notifying a parent or guardian",
          fullWidth: true,
        },
        {
          name: "requestCounselor",
          type: "checkbox",
          required: false,
          description: "Request support from the school counselor",
          fullWidth: true,
        },
      ],
    }}
  />
);

export default ReportStudent;
