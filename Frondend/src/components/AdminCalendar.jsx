import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const getDateKey = (date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const AdminCalendar = ({ isOpen }) => {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const today = new Date();
  const todayKey = getDateKey(today);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const calendarDays = Array.from({ length: 42 }, (_, index) =>
    new Date(year, month, index - firstDayOfMonth.getDay() + 1),
  );
  const calendarWeeks = Array.from({ length: 6 }, (_, weekIndex) =>
    calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7),
  );

  const changeMonth = (offset) => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + offset,
          1,
        ),
    );
  };

  const goToCurrentMonth = () => {
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <main className={`${isOpen ? "" : "pt-[82px]"} px-4 py-6`}>
      <section className="mx-auto max-w-5xl rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">School Calendar</h1>
            <p className="mt-1 text-sm text-base-content/70">
              Today:{" "}
              {today.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToCurrentMonth}
              className="btn btn-ghost btn-sm"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="btn btn-outline btn-square btn-sm"
              aria-label="Previous month"
            >
              <FaChevronLeft aria-hidden="true" />
            </button>
            <h2
              className="min-w-36 text-center text-lg font-semibold"
              aria-live="polite"
            >
              {visibleMonth.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="btn btn-outline btn-square btn-sm"
              aria-label="Next month"
            >
              <FaChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className="mt-6"
          role="grid"
          aria-label={visibleMonth.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        >
          <div
            className="grid grid-cols-7 border-b border-base-300 pb-2 text-center text-xs font-semibold uppercase text-base-content/60 sm:text-sm"
            role="row"
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} role="columnheader">
                {day}
              </div>
            ))}
          </div>
          {calendarWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7" role="row">
              {week.map((date) => {
                const isCurrentMonth = date.getMonth() === month;
                const isToday = getDateKey(date) === todayKey;
                return (
                  <div
                    key={getDateKey(date)}
                    role="gridcell"
                    aria-label={date.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    aria-current={isToday ? "date" : undefined}
                    className={`flex min-h-16 items-start justify-center border-b border-base-200 py-2 sm:min-h-24 sm:justify-end sm:px-3 ${
                      isCurrentMonth ? "" : "text-base-content/35"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                        isToday
                          ? "bg-primary font-bold text-primary-content"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminCalendar;
