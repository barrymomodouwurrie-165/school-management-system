import { useEffect, useState } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
import ChatMessages from "./ChatMessages";
import {
  askStudentStudyCoach,
  getStudentStudyCoachContext,
} from "../../utils/studentApi";

const getTime = () =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

const AiAssistance = () => {
  const [context, setContext] = useState(null);
  const [subject, setSubject] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("chat");
  const [hasPrivacyConsent, setHasPrivacyConsent] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [contextError, setContextError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentStudyCoachContext()
      .then((result) => {
        if (!active) return;
        setContext(result);
        setSubject(result.subjects[0]?.name ?? "");
      })
      .catch((loadError) => {
        if (active) setContextError(loadError.message);
      })
      .finally(() => {
        if (active) setIsLoadingContext(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const appendMessage = (sender, text, role) => ({
    id: `${Date.now()}-${Math.random()}`,
    sender,
    text,
    role,
    content: text,
    time: getTime(),
  });

  const sendMessage = async (event) => {
    event.preventDefault();
    const prompt = message.trim();
    if (
      !prompt ||
      !subject ||
      isSending ||
      !context?.isConfigured ||
      !hasPrivacyConsent
    ) {
      return;
    }

    const conversation = messages
      .filter((item) => item.role)
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));
    const userMessage = appendMessage("user", prompt, "user");
    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setError("");
    setIsSending(true);

    try {
      const result = await askStudentStudyCoach({
        subject,
        message: prompt,
        mode,
        history: conversation,
      });
      setMessages((current) => [
        ...current,
        appendMessage("robot", result.reply, "assistant"),
      ]);
    } catch (requestError) {
      setMessages((current) =>
        current.filter((item) => item.id !== userMessage.id),
      );
      setError(requestError.message);
      setMessage(prompt);
    } finally {
      setIsSending(false);
    }
  };

  const selectSubject = (event) => {
    setSubject(event.target.value);
    setMessages([]);
    setError("");
  };

  const quickPrompts = subject
    ? [
        `Explain a key idea in ${subject} using a simple example.`,
        `Help me practise a topic from ${subject}.`,
        `What should I review to understand ${subject} better?`,
      ]
    : [];

  return (
    <main className="mx-auto max-w-4xl px-4">
      <section className="overflow-hidden rounded-xl border border-base-content/15 bg-base-100 shadow-sm">
        <header className="bg-primary px-5 py-4 text-primary-content">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <FaRobot size={22} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-bold">AI Study Coach</h1>
              <p className="text-sm opacity-80">
                Ask, explore, and practise one of your school subjects.
              </p>
            </div>
          </div>
        </header>

        {isLoadingContext ? (
          <p role="status" className="p-8 text-center">
            Loading your subjects...
          </p>
        ) : contextError ? (
          <p role="alert" className="m-4 alert alert-error">
            {contextError}
          </p>
        ) : !context?.subjects.length ? (
          <p className="m-4 rounded-lg border border-base-content/15 p-5 text-center text-sm text-base-content/70">
            No active subjects are available for your class yet.
          </p>
        ) : (
          <div className="p-4 sm:p-5">
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Study subject</span>
                <select
                  className="select select-bordered select-sm w-full"
                  value={subject}
                  onChange={selectSubject}
                  disabled={isSending}
                >
                  {context.subjects.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col justify-end text-sm text-base-content/70">
                <span>
                  {context.className} · {context.gradeLevel}
                </span>
                <span>
                  {context.term} · {context.academicYear}
                </span>
              </div>
            </div>

            <div className="mb-4 rounded-md border border-info/20 bg-info/5 p-3 text-xs text-base-content/80">
              Your selected subject, grade level, term, question, and recent
              conversation are sent to OpenAI to generate responses. Your name,
              student ID, guardian information, attendance, and marks are not
              sent. Avoid sharing personal or sensitive information.
              <label className="mt-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs mt-0.5"
                  checked={hasPrivacyConsent}
                  onChange={(event) =>
                    setHasPrivacyConsent(event.target.checked)
                  }
                />
                <span>
                  I understand that my study questions and recent chat will be
                  sent to OpenAI.
                </span>
              </label>
            </div>

            {!context.isConfigured && (
              <p role="status" className="mb-4 rounded-md bg-warning/10 p-3 text-sm">
                The AI service is not configured yet. Ask your school
                administrator to add the OpenAI API key to the backend.
              </p>
            )}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="join" aria-label="Choose a study mode">
                <button
                  type="button"
                  className={`btn btn-sm join-item ${
                    mode === "chat" ? "btn-primary" : "btn-outline"
                  }`}
                  aria-pressed={mode === "chat"}
                  onClick={() => setMode("chat")}
                >
                  Study chat
                </button>
                <button
                  type="button"
                  className={`btn btn-sm join-item ${
                    mode === "quiz" ? "btn-primary" : "btn-outline"
                  }`}
                  aria-pressed={mode === "quiz"}
                  onClick={() => setMode("quiz")}
                >
                  Practice quiz
                </button>
              </div>
              <span className="text-xs text-base-content/60">
                {mode === "quiz"
                  ? "Ask for a topic; the coach creates a quiz with answers at the end."
                  : "Ask a question or tell the coach what you are learning."}
              </span>
            </div>

            <ChatMessages
              messages={messages}
              subject={subject}
              isLoading={isSending}
            />

            {error && (
              <p role="alert" className="mb-3 text-sm text-error">
                {error}
              </p>
            )}

            <form onSubmit={sendMessage} className="flex items-end gap-2">
              <label className="sr-only" htmlFor="study-coach-message">
                Your question or topic
              </label>
              <textarea
                id="study-coach-message"
                className="textarea textarea-bordered min-h-12 flex-1 resize-y"
                placeholder={`Ask about ${subject}...`}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={2000}
                rows={2}
                required
                disabled={
                  !context.isConfigured || !hasPrivacyConsent || isSending
                }
              />
              <button
                type="submit"
                className="btn btn-primary btn-square"
                aria-label={isSending ? "Sending question" : "Send question"}
                disabled={
                  !context.isConfigured ||
                  !hasPrivacyConsent ||
                  isSending ||
                  !message.trim() ||
                  !subject
                }
              >
                <FaPaperPlane aria-hidden="true" />
              </button>
            </form>

            <section className="mt-4">
              <h2 className="mb-2 text-sm font-semibold">Try asking</h2>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="btn btn-outline btn-xs h-auto whitespace-normal py-2 text-left"
                    disabled={
                      !context.isConfigured || !hasPrivacyConsent || isSending
                    }
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
};

export default AiAssistance;
