import StudentSubmissionPage from "./StudentSubmissionPage";

const SendComplaint = () => (
  <StudentSubmissionPage
    config={{
      type: "complaint",
      title: "Send a Complaint",
      description:
        "Let the school administration know about a problem that needs attention.",
      submitLabel: "Send complaint",
      fields: [
        {
          name: "category",
          label: "Complaint category",
          type: "select",
          options: [
            { value: "academic", label: "Academic matter" },
            { value: "staff", label: "Staff conduct" },
            { value: "student", label: "Student conduct" },
            { value: "facilities", label: "Facilities or resources" },
            { value: "safety", label: "Safety or wellbeing" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: "subject",
          label: "Complaint title",
          placeholder: "Summarize the issue",
        },
        {
          name: "details",
          label: "Describe your concern",
          type: "textarea",
          placeholder:
            "Explain what happened, when it happened, and what support you need.",
          maxLength: 3000,
          fullWidth: true,
        },
        {
          name: "confidential",
          type: "checkbox",
          required: false,
          description: "Please handle this complaint confidentially",
          fullWidth: true,
        },
      ],
    }}
  />
);

export default SendComplaint;
