"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";

import { useGetEventsQuery } from "@/src/redux/store/api/eventApi";
import { useGetCategoriesQuery } from "@/src/redux/store/api/category";
import { EventCardType, EventType } from "@/src/types/event";
import type { Category } from "@/src/types/category";
import GeneralModal from "@/src/component/GeneralModal";
import { useEffect, useMemo, useState } from "react";
import { EventClickArg } from "@fullcalendar/core/index.js";
import CardEventType from "@/src/component/CardEventType";

const DEFAULT_EVENT_COLOR = "#6B7280";

const Index = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<EventType>();
  const { data: eventsData, isLoading: isLoadingEvents } = useGetEventsQuery();
  const {
    data: categoriesData = [],
    isLoading: isLoadingCategories,
  } = useGetCategoriesQuery(undefined);

  const eventCategories = useMemo(
    () =>
      (categoriesData ?? []).filter(
        (category: Category) => category.type === "event"
      ),
    [categoriesData]
  );

  const categoryColorLookup = useMemo(() => {
    const map = new Map<string, string>();

    eventCategories.forEach((category) => {
      const color = category.color ?? DEFAULT_EVENT_COLOR;

      if (category.id) {
        map.set(category.id, color);
      }

      if (category.title) {
        map.set(category.title.toLowerCase(), color);
      }
    });

    return map;
  }, [eventCategories]);

  const eventCategoryCards = useMemo<EventCardType[]>(
    () =>
      eventCategories.map((category) => ({
        title: category.title,
        type: category.id ?? category.title,
        color: category.color ?? DEFAULT_EVENT_COLOR,
      })),
    [eventCategories]
  );

  const getColorForEventType = (type: string | undefined): string => {
    if (!type) {
      return DEFAULT_EVENT_COLOR;
    }

    const directMatch = categoryColorLookup.get(type);
    if (directMatch) {
      return directMatch;
    }

    return (
      categoryColorLookup.get(type.toLowerCase()) ?? DEFAULT_EVENT_COLOR
    );
  };

  useEffect(() => {
    const find = eventsData?.find((event) => event.id === selectedId);

    if (find) {
      setSelectedEvent(find);
    }
  }, [eventsData, selectedId]);

  const upcomingEvents = (eventsData ?? []).map((event: EventType) => {
    const timePad = event.time ? `T${event.time}` : "T00:00";
    return {
      title: event.title,
      dateLabel: `${event.date} ${event.time ?? ""}`.trim(),
      start: `${event.date}${timePad}`,
      location: event.location,
      description: event.description,
      color: getColorForEventType(event.type),
      id: event.id,
    };
  });

  if (isLoadingEvents || isLoadingCategories) {
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
                  height="700px"
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
            {isLoadingCategories ? (
              <p>Cargando categorías...</p>
            ) : eventCategoryCards.length ? (
              eventCategoryCards.map((eventCategory) => (
                <CardEventType
                  key={eventCategory.type}
                  event={eventCategory}
                />
              ))
            ) : (
              <p>No hay categorías de eventos disponibles.</p>
            )}
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
        showFooter={false}
      >
        <div>{selectedEvent?.date.toString() ?? ""}</div>
      </GeneralModal>
    </>
  );
};

export default Index;
