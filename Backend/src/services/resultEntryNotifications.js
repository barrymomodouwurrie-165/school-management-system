import { randomUUID } from "node:crypto";
import Announcement from "../models/announcement.js";
import ResultEntryWindow from "../models/resultEntryWindow.js";

const formatDeadline = (deadlineAt) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(deadlineAt));

export const publishResultEntryAnnouncement = async ({
  academicYear,
  evaluationPeriod,
  action,
  deadlineAt,
  systemEventKey,
}) => {
  const messages = {
    opened: `Student marks entry is now open for ${evaluationPeriod}, ${academicYear}. The deadline is ${formatDeadline(deadlineAt)} UTC.`,
    closed: `Student marks entry for ${evaluationPeriod}, ${academicYear} has been closed by the administrator.`,
    deadline: `The marks-entry deadline for ${evaluationPeriod}, ${academicYear} has been reached. Marks entry is now closed.`,
  };
  const subjects = {
    opened: "Student marks entry is now open",
    closed: "Student marks entry has been closed",
    deadline: "Student marks-entry deadline reached",
  };

  return Announcement.create({
    author: "Administration",
    subject: subjects[action],
    content: messages[action],
    recipients: ["staff"],
    systemEventKey:
      systemEventKey ??
      `result-entry:${academicYear}:${evaluationPeriod}:${action}:${randomUUID()}`,
  });
};

export const publishDueResultEntryAnnouncements = async () => {
  const now = new Date();
  const dueWindows = await ResultEntryWindow.find({
    isOpen: true,
    deadlineAt: { $ne: null, $lte: now },
    deadlineAnnouncementSentAt: null,
  })
    .select("_id academicYear evaluationPeriod deadlineAt")
    .lean();

  for (const window of dueWindows) {
    const systemEventKey = `result-entry:${window._id}:deadline:${new Date(
      window.deadlineAt,
    ).getTime()}`;
    try {
      await publishResultEntryAnnouncement({
        academicYear: window.academicYear,
        evaluationPeriod: window.evaluationPeriod,
        action: "deadline",
        systemEventKey,
      });
    } catch (error) {
      if (error.code !== 11000) {
        console.error(
          "Result entry deadline announcement failed:",
          error.message,
        );
        continue;
      }
    }

    await ResultEntryWindow.updateOne(
      {
        _id: window._id,
        deadlineAt: { $lte: now },
        deadlineAnnouncementSentAt: null,
      },
      {
        $set: {
          isOpen: false,
          deadlineAnnouncementSentAt: now,
        },
      },
    );
  }
};
