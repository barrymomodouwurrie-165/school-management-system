const OPENAI_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions";
const MAX_HISTORY_MESSAGES = 8;
const MAX_HISTORY_MESSAGE_LENGTH = 6000;

const getProviderError = async (response) => {
  try {
    const body = await response.json();
    return {
      code:
        typeof body.error?.code === "string" ? body.error.code : "",
      type:
        typeof body.error?.type === "string" ? body.error.type : "",
    };
  } catch {
    return { code: "", type: "" };
  }
};

const getRateLimitMessage = (code, retryAfter) => {
  if (
    code === "insufficient_quota" ||
    code === "credit_balance_exhausted" ||
    code === "billing_hard_limit_reached"
  ) {
    return "The OpenAI API account has no available quota. Check that API billing or credits are active and that the project's usage limit has not been reached.";
  }

  if (code === "rate_limit_exceeded") {
    const retrySeconds = Number(retryAfter);
    const waitMessage =
      Number.isFinite(retrySeconds) && retrySeconds > 0
        ? ` Wait about ${Math.ceil(retrySeconds)} seconds before trying again.`
        : " Wait a short time before trying again.";
    return `The OpenAI API request limit was reached.${waitMessage} If this continues, check your project's rate limits.`;
  }

  return "OpenAI temporarily rejected the study coach request. Please try again shortly; if the issue continues, check your API project's quota and rate limits.";
};

class StudyCoachError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "StudyCoachError";
    this.statusCode = statusCode;
  }
}

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) {
    throw new StudyCoachError("Conversation history must be a list.", 400);
  }

  return history.slice(-MAX_HISTORY_MESSAGES).map((message) => {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      !message.content.trim() ||
      message.content.length > MAX_HISTORY_MESSAGE_LENGTH
    ) {
      throw new StudyCoachError(
        "Conversation history contains an invalid message.",
        400,
      );
    }

    return { role: message.role, content: message.content.trim() };
  });
};

const createStudyCoachReply = async ({
  subject,
  gradeLevel,
  term,
  mode,
  message,
  history,
}) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new StudyCoachError(
      "The study coach is not configured. Ask your school administrator to set up its AI service.",
      503,
    );
  }

  const previousMessages = normalizeHistory(history);
  const modeInstructions =
    mode === "quiz"
      ? "Create a five-question practice quiz for the selected subject and learner level. Use a mix of appropriate question types. Put the answer key after a clear separator at the end so the learner can try first. Briefly explain the answers."
      : "Tutor the learner interactively. Explain ideas clearly at the learner's level, use examples, and ask a short check-for-understanding question when useful. Help the learner reason rather than simply doing graded work for them.";
  const systemPrompt = [
    "You are a supportive school study coach.",
    `The learner selected ${subject}.`,
    `Learner level: ${gradeLevel}.`,
    `Current academic period: ${term}.`,
    modeInstructions,
    "Stay focused on the selected subject. If the learner asks about another subject, invite them to choose it in the subject selector.",
    "Do not claim access to a specific textbook, lesson plan, or school syllabus. If a question depends on course materials that were not provided, say so and ask the learner to share the topic or excerpt.",
    "Use age-appropriate language, avoid asking for personal information, and never present uncertain information as fact.",
  ].join(" ");

  let response;
  try {
    response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...previousMessages,
          { role: "user", content: message },
        ],
        max_tokens: 1200,
        temperature: 0.6,
      }),
    });
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new StudyCoachError(
        "The study coach took too long to respond. Please try again.",
        504,
      );
    }
    throw new StudyCoachError(
      "The study coach service could not be reached. Please try again shortly.",
      502,
    );
  }

  if (!response.ok) {
    const providerError = await getProviderError(response);
    const requestId = response.headers.get("x-request-id");
    console.error("Study coach provider request failed:", {
      status: response.status,
      code: providerError.code || "unknown",
      type: providerError.type || "unknown",
      requestId: requestId || "unavailable",
    });

    if (response.status === 429) {
      throw new StudyCoachError(
        getRateLimitMessage(
          providerError.code,
          response.headers.get("retry-after"),
        ),
        429,
      );
    }

    throw new StudyCoachError(
      "The study coach could not complete your request. Please try again later.",
      502,
    );
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new StudyCoachError(
      "The study coach returned an unreadable response. Please try again.",
      502,
    );
  }
  const reply = result.choices?.[0]?.message?.content;
  if (typeof reply !== "string" || !reply.trim()) {
    throw new StudyCoachError(
      "The study coach returned an empty response. Please try again.",
      502,
    );
  }

  return reply.trim();
};

export { createStudyCoachReply, StudyCoachError };
