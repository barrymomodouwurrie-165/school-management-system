import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import {
  createAdminCalendarEvent,
  deleteAdminCalendarEvent,
  getAdminCalendarEvents,
  getAcademicExams,
  updateAdminCalendarEvent,
} from "../utils/adminApi";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "school-event",
  startDate: "",
  endDate: "",
};

const getDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const formatDate = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

const getDateRange = (event) => {
  const startDate = String(event.startDate).slice(0, 10);
  const endDate = String(event.endDate).slice(0, 10);
  return startDate === endDate
    ? formatDate(startDate)
    : `${formatDate(startDate)} – ${formatDate(endDate)}`;
};

const getEventTypeLabel = (type) =>
  ({
    "term-date": "Term date",
    "school-event": "School event",
    exam: "Exam",
  })[type] || "School event";

const AdminCalendar = ({ isOpen }) => {
  const today = new Date();
  const todayKey = getDateKey(today);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState("");

  const fetchCalendar = useCallback(
    () => Promise.all([getAdminCalendarEvents(), getAcademicExams()]),
    [],
  );

  useEffect(() => {
    let active = true;
    fetchCalendar()
      .then(([calendarEvents, academicExams]) => {
        if (!active) return;
        setEvents(calendarEvents);
        setExams(academicExams);
        setLoadError("");
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message || "Unable to load the school calendar.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchCalendar, reloadKey]);

  const retryLoadCalendar = () => {
    setIsLoading(true);
    setLoadError("");
    setReloadKey((key) => key + 1);
  };

  const calendarItems = useMemo(
    () => [
      ...events.map((event) => ({
        ...event,
        id: event._id,
        source: "event",
      })),
      ...exams.map((exam) => ({
        ...exam,
        id: `exam-${exam._id}`,
        type: "exam",
        description: `${exam.section} examination`,
        source: "exam",
      })),
    ],
    [events, exams],
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const calendarDays = Array.from({ length: 42 }, (_, index) =>
    new Date(year, month, index - firstDayOfMonth.getDay() + 1),
  );
  const calendarWeeks = Array.from({ length: 6 }, (_, weekIndex) =>
    calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7),
  );
  const selectedDateItems = calendarItems.filter((event) => {
    const startDate = String(event.startDate).slice(0, 10);
    const endDate = String(event.endDate).slice(0, 10);
    return selectedDateKey >= startDate && selectedDateKey <= endDate;
  });

  const changeMonth = (offset) => {
    const nextMonth = new Date(year, month + offset, 1);
    setVisibleMonth(nextMonth);
    setSelectedDateKey(getDateKey(nextMonth));
  };

  const goToCurrentMonth = () => {
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateKey(todayKey);
  };

  const openNewEventForm = () => {
    setEditingEvent(null);
    setForm({
      ...EMPTY_FORM,
      startDate: selectedDateKey,
      endDate: selectedDateKey,
    });
    setStatus({ type: "", message: "" });
    setIsFormOpen(true);
  };

  const openEditEventForm = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description || "",
      type: event.type,
      startDate: String(event.startDate).slice(0, 10),
      endDate: String(event.endDate).slice(0, 10),
    });
    setStatus({ type: "", message: "" });
    setIsFormOpen(true);
  };

  const closeEventForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    if (form.endDate < form.startDate) {
      setStatus({
        type: "error",
        message: "The end date must be on or after the start date.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = editingEvent
        ? await updateAdminCalendarEvent(editingEvent._id, form)
        : await createAdminCalendarEvent(form);
      setEvents((current) =>
        editingEvent
          ? current.map((item) =>
              item._id === result.event._id ? result.event : item,
            )
          : [...current, result.event],
      );
      setSelectedDateKey(form.startDate);
      setStatus({
        type: "success",
        message:
          result.message ||
          `Calendar event ${editingEvent ? "updated" : "published"} successfully.`,
      });
      closeEventForm();
    } catch (saveError) {
      setStatus({
        type: "error",
        message: saveError.message || "Unable to save the calendar event.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}" permanently?`)) return;

    setDeletingEventId(event._id);
    setStatus({ type: "", message: "" });
    try {
      const result = await deleteAdminCalendarEvent(event._id);
      setEvents((current) =>
        current.filter((item) => item._id !== event._id),
      );
      setStatus({
        type: "success",
        message: result.message || "Calendar event deleted.",
      });
    } catch (deleteError) {
      setStatus({
        type: "error",
        message: deleteError.message || "Unable to delete the calendar event.",
      });
    } finally {
      setDeletingEventId("");
    }
  };

  return (
    <main className={`${isOpen ? "" : "pt-[82px]"} px-4 py-6`}>
      <section className="mx-auto max-w-5xl rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">School Calendar</h1>
            <p className="mt-1 text-sm text-base-content/70">
              Publish term dates and school events. Exam schedules created under
              Academics appear here automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={openNewEventForm}
            className="btn btn-primary btn-sm"
          >
            <FaPlus aria-hidden="true" />
            Add calendar event
          </button>
        </header>

        {loadError && (
          <p role="alert" className="alert alert-error mt-4">
            {loadError}
            <button
              type="button"
              onClick={retryLoadCalendar}
              className="btn btn-sm"
            >
              Retry
            </button>
          </p>
        )}
        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`mt-4 text-sm ${
              status.type === "error" ? "text-error" : "text-success"
            }`}
          >
            {status.message}
          </p>
        )}

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="my-5 space-y-4 rounded-xl border border-base-300 p-4"
          >
            <h2 className="font-bold">
              {editingEvent ? "Edit calendar event" : "Publish calendar event"}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Event type</span>
                <select
                  className="select select-bordered select-sm"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value,
                    }))
                  }
                >
                  <option value="term-date">Term date</option>
                  <option value="school-event">School event</option>
                </select>
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Title</span>
                <input
                  type="text"
                  className="input input-bordered input-sm"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  maxLength={160}
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Start date</span>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">End date</span>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={form.endDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                  min={form.startDate || undefined}
                  required
                />
              </label>
            </div>
            <label className="form-control">
              <span className="label-text mb-1 font-semibold">
                Description (optional)
              </span>
              <textarea
                className="textarea textarea-bordered min-h-24"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                maxLength={3000}
              />
            </label>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={closeEventForm}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : editingEvent
                    ? "Save changes"
                    : "Publish event"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-end">
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

        {isLoading ? (
          <p role="status" className="py-8 text-center">
            Loading school calendar...
          </p>
        ) : (
          <div className="mt-4" role="grid" aria-label="School calendar">
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
                  const dateKey = getDateKey(date);
                  const isCurrentMonth = date.getMonth() === month;
                  const dayItems = calendarItems.filter((item) => {
                    const startDate = String(item.startDate).slice(0, 10);
                    const endDate = String(item.endDate).slice(0, 10);
                    return dateKey >= startDate && dateKey <= endDate;
                  });
                  const dateLabel = formatDate(dateKey);
                  return (
                    <button
                      key={dateKey}
                      type="button"
                      role="gridcell"
                      aria-label={`${dateLabel}${dayItems.length ? `, ${dayItems.length} scheduled items` : ""}`}
                      aria-current={dateKey === todayKey ? "date" : undefined}
                      aria-selected={dateKey === selectedDateKey}
                      onClick={() => setSelectedDateKey(dateKey)}
                      className={`flex min-h-16 w-full flex-col items-center border-b border-base-200 py-2 text-center sm:min-h-24 sm:items-end sm:px-2 ${
                        isCurrentMonth ? "" : "text-base-content/35"
                      } ${
                        dateKey === selectedDateKey ? "bg-primary/10" : ""
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                          dateKey === todayKey
                            ? "bg-primary font-bold text-primary-content"
                            : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {dayItems.length > 0 && (
                        <span className="mt-1 text-[10px] leading-tight text-primary sm:text-xs">
                          {dayItems.length}{" "}
                          {dayItems.length === 1 ? "event" : "events"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !loadError && (
          <section className="mt-6 border-t border-base-300 pt-4">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-bold">{formatDate(selectedDateKey)}</h2>
                <p className="text-sm text-base-content/70">
                  Events and exams scheduled for this date
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={openNewEventForm}
              >
                Add event on this date
              </button>
            </header>
            {selectedDateItems.length ? (
              <ul className="space-y-3">
                {selectedDateItems.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-lg border border-base-300 p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="badge badge-primary badge-outline mb-1">
                          {getEventTypeLabel(event.type)}
                        </span>
                        <h3 className="break-words font-semibold">
                          {event.title}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {getDateRange(event)}
                          {event.section ? ` · ${event.section}` : ""}
                        </p>
                        {event.description && (
                          <p className="mt-2 whitespace-pre-wrap text-sm">
                            {event.description}
                          </p>
                        )}
                      </div>
                      {event.source === "event" && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => openEditEventForm(event)}
                            aria-label={`Edit ${event.title}`}
                          >
                            <FaEdit aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => handleDelete(event)}
                            disabled={deletingEventId === event._id}
                            aria-label={`Delete ${event.title}`}
                          >
                            <FaTrash aria-hidden="true" />
                            {deletingEventId === event._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                    {event.source === "exam" && (
                      <p className="mt-2 text-xs text-base-content/60">
                        Manage exam schedules in Academics &gt; Exams.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-base-300 p-5 text-center text-sm text-base-content/70">
                No events are scheduled for this date.
              </p>
            )}
          </section>
        )}
      </section>
    </main>
  );
};

export default AdminCalendar;
