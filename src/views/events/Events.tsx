"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import type { EventContentArg } from "@fullcalendar/core";

const Index = () => {
  const CardEventType = () => {
    return (
      <div
        className="box"
        style={{
          border: 0,
          borderLeft: 3,
          borderColor: "#000",
          borderStyle: "solid",
        }}
      >
        <p className="is-size-6">Club lectura</p>
      </div>
    );
  };

  const eventFilters = [
    { label: "Todos", active: true },
    { label: "Proyección" },
    { label: "Club de lectura" },
    { label: "Reunión" },
  ];

  const upcomingEvents = [
    {
      title: "Proyección: Tesoros del Cine",
      dateLabel: "18 oct · 19:00",
      start: "2025-10-18T19:00:00",
      location: "Sala principal",
      description:
        "Documental inédito seguido de coloquio con el director y el equipo de investigación.",
      color: "#9f1239",
    },
    {
      title: "Club de lectura: Letras del mar",
      dateLabel: "22 oct · 17:30",
      start: "2025-10-22T17:30:00",
      location: "Biblioteca",
      description:
        "Analizamos crónicas marítimas latinoamericanas con invitados especiales.",
      color: "#1d4ed8",
    },
    {
      title: "Encuentro de voluntariado",
      dateLabel: "25 oct · 16:00",
      start: "2025-10-25T16:00:00",
      location: "Sala de reuniones",
      description:
        "Planificación de actividades y asignación de roles para el próximo mes.",
      color: "#047857",
    },
  ];

  const calendarEvents = upcomingEvents.map(
    ({ title, start, location, color }) => ({
      title,
      start,
      backgroundColor: color,
      borderColor: color,
      textColor: "#ffffff",
      extendedProps: { location },
    })
  );

  const renderEventContent = (eventInfo: EventContentArg) => {
    const location = eventInfo.event.extendedProps.location as
      | string
      | undefined;

    return (
      <div className="calendar-event">
        <span className="calendar-event__time">{eventInfo.timeText}</span>
        <span className="calendar-event__title">{eventInfo.event.title}</span>
        {location && (
          <span className="calendar-event__location">{location}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="container">
        <div className="events-header">
          <button className="button is-text header-back-button">
            <ArrowLeft size={20} />
          </button>
          <Link
            className="button is-primary has-text-white"
            href="/events/create"
          >
            Crear evento
          </Link>
        </div>

        <div className="columns is-variable is-6">
          <div className="column">
            <div className="card has-shadow calendar-card">
              <div className="card-content">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  locales={[esLocale]}
                  locale="es"
                  initialView="dayGridMonth"
                  height="auto"
                  firstDay={1}
                  dayMaxEventRows={3}
                  eventDisplay="block"
                  events={calendarEvents}
                  eventContent={renderEventContent}
                  eventOrder="start"
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  headerToolbar={{
                    start: "prev,next today",
                    center: "title",
                    end: "",
                  }}
                  titleFormat={{ month: "long", year: "numeric" }}
                  buttonText={{ today: "Hoy" }}
                  moreLinkText="Ver más"
                  showNonCurrentDates={false}
                  fixedWeekCount={false}
                  dayHeaderFormat={{ weekday: "short" }}
                />
              </div>
            </div>
          </div>

          <div className="column is-3">
            <CardEventType />
            <CardEventType />
            <CardEventType />
            <CardEventType />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
