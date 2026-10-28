import StudentSubmissionPage from "./StudentSubmissionPage";

const SendSuggestion = () => (
  <StudentSubmissionPage
    config={{
      type: "suggestion",
      title: "Send a Suggestion",
      description:
        "Share a constructive idea to improve learning or school life.",
      submitLabel: "Send suggestion",
      fields: [
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            { value: "learning", label: "Learning and curriculum" },
            { value: "facilities", label: "Facilities" },
            { value: "activities", label: "Student activities" },
            { value: "wellbeing", label: "Student wellbeing" },
            { value: "other", label: "Other" },
          ],
        },
        {
          name: "subject",
          label: "Suggestion title",
          placeholder: "Summarize your idea",
        },
        {
          name: "details",
          label: "Suggestion and expected impact",
          type: "textarea",
          placeholder:
            "Describe your idea and how it could improve school life.",
          maxLength: 3000,
          fullWidth: true,
        },
        {
          name: "anonymous",
          type: "checkbox",
          required: false,
          description: "Submit this suggestion anonymously",
          fullWidth: true,
        },
      ],
    }}
  />
);

export default SendSuggestion;
