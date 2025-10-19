"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";

import { useGetEventsQuery } from "@/src/redux/store/api/eventApi";
import { EventFormValues, EventType } from "@/src/types/event";
import GeneralModal from "@/src/component/GeneralModal";
import { useEffect, useState } from "react";
import { EventClickArg } from "@fullcalendar/core/index.js";

const Index = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<EventType>();
  const { data: eventsData, isLoading: isLoadingEvents } = useGetEventsQuery();

  useEffect(() => {
    const find = eventsData?.find((event) => event.id === selectedId);

    if (find) {
      setSelectedEvent(find);
    }
  }, [eventsData, selectedId]);

  const upcomingEvents = (eventsData ?? []).map((event: EventFormValues) => {
    const timePad = event.time ? `T${event.time}` : "T00:00";
    return {
      title: event.title,
      dateLabel: `${event.date} ${event.time ?? ""}`.trim(),
      start: `${event.date}${timePad}`,
      location: event.location,
      description: event.description,
      color: "#9f1239",
      id: event.id,
    };
  });

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

  if (isLoadingEvents) {
    return <div>Cargando</div>;
  }

  return (
    <>
      <div className="container">
        <br />

        <div className="is-flex is-justify-content-space-between is-align-items-center">
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

        <br />

        <div className="columns is-variable is-6">
          <div className="column">
            <div className="card has-shadow calendar-card">
              <div className="card-content">
                <FullCalendar
                  eventClick={(event: EventClickArg) => {
                    setSelectedId(event.event._def.publicId);
                  }}
                  plugins={[dayGridPlugin]}
                  locales={[esLocale]}
                  locale="es"
                  initialView="dayGridMonth"
                  height="auto"
                  firstDay={1}
                  dayMaxEventRows={3}
                  eventDisplay="block"
                  events={upcomingEvents}
                  //eventContent={renderEventContent}
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

      <GeneralModal
        isOpen={selectedId?.length > 0}
        onClose={() => {
          setSelectedId("");
        }}
        title={selectedEvent?.title}
        description={selectedEvent?.description}
      >
        <div>{selectedEvent?.date.toString() ?? ""}</div>
      </GeneralModal>
    </>
  );
};

export default Index;
