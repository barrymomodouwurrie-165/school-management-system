const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const WEEK_IN_MILLISECONDS = 7 * DAY_IN_MILLISECONDS;
const TERM_WEEKS = 13;
const BREAK_WEEKS = 2;
const TERM_CYCLE_WEEKS = TERM_WEEKS + BREAK_WEEKS;
export const TERMS = ["First Term", "Second Term", "Third Term"];

const getUtcDate = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
};

export const getAcademicPeriod = (value = new Date()) => {
  const date = getUtcDate(value);
  const currentYearStart = new Date(Date.UTC(date.getUTCFullYear(), 8, 16));
  const startYear =
    date >= currentYearStart ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
  const academicStart = new Date(Date.UTC(startYear, 8, 16));
  const firstAcademicWeek = new Date(academicStart);
  firstAcademicWeek.setUTCDate(
    firstAcademicWeek.getUTCDate() - firstAcademicWeek.getUTCDay(),
  );
  const currentWeekStart = new Date(date);
  currentWeekStart.setUTCDate(
    currentWeekStart.getUTCDate() - currentWeekStart.getUTCDay(),
  );
  const elapsedWeeks = Math.floor(
    (currentWeekStart - firstAcademicWeek) / WEEK_IN_MILLISECONDS,
  );
  const termIndex = Math.floor(elapsedWeeks / TERM_CYCLE_WEEKS);
  const academicYear = `${startYear}/${String(startYear + 1).slice(-2)}`;

  if (termIndex >= TERMS.length) {
    return {
      academicYear,
      term: null,
      isTermOpen: false,
      periodLabel: "School break",
    };
  }

  const weekWithinCycle = elapsedWeeks % TERM_CYCLE_WEEKS;
  const term = TERMS[termIndex];
  const periodLabel =
    weekWithinCycle < TERM_WEEKS
      ? `${term}, Week ${weekWithinCycle + 1}`
      : `${term} break (${weekWithinCycle - TERM_WEEKS + 1} of ${BREAK_WEEKS} weeks)`;

  return {
    academicYear,
    term,
    isTermOpen: weekWithinCycle < TERM_WEEKS,
    periodLabel,
  };
};
