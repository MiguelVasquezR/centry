"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useFetchPostsQuery } from "@/src/redux/store/api/postsApi";
import { getGreating } from "@/src/utils/utils";
import CardPost from "../../../component/CardPost";
import type { PostListItem } from "@/src/types/postList";
import { useGetEventsQuery } from "@/src/redux/store/api/eventApi";
import { EventType } from "@/src/types/event";

const Updates = () => {
  const CardEvent = ({ event }: { event: EventType }) => {
    const eventDate = DateTime.fromISO(event.date + "T" + event.time);

    return (
      <li className="mb-2" style={{ width: "100%" }}>
        <div>
          <p className="is-size-7 has-text-grey">
            {eventDate.toFormat("dd MMM yyyy, HH:mm")}
          </p>
          <p className="is-size-6">{event.title}</p>
        </div>
      </li>
    );
  };

  const {
    data,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useFetchPostsQuery({ limit: 20, page: 1 });

  const { data: eventsData, isLoading: isLoadingEvents } = useGetEventsQuery();
  const eventToShow = eventsData?.slice(0, 5) || [];

  const posts = (data?.posts ?? []) as PostListItem[];
  const [greeting, setGreeting] = useState("");
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    setGreeting(getGreating());
    setTodayLabel(
      DateTime.now().setLocale("es").toFormat("dd 'de' MMMM, yyyy")
    );
  }, []);

  if (isPostsLoading || isLoadingEvents) {
    return <div>Cargando</div>;
  }

  return (
    <div className="container">
      <br />
      <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-direction-column">
          <p className="is-size-4 has-text-weight-bold">
            {greeting ? `${greeting}, Miguel!` : "Hola, Miguel!"}
          </p>
          <p className="is-size-6 has-text-grey">{todayLabel}</p>
        </div>

        <div className="is-flex is-align-items-center is-gap-2">
          <Link
            className="button is-primary has-text-white has-text-weight-semibold"
            href="/posts/create"
          >
            Crear publicación
          </Link>
        </div>
      </div>

      <div className="columns mt-5">
        <div className="column is-9">
          {isPostsLoading && <p>Cargando publicaciones…</p>}
          {isPostsError && (
            <div className="notification is-danger">
              No pudimos cargar las publicaciones. Intenta más tarde.
            </div>
          )}
          {!isPostsLoading && !isPostsError && posts.length === 0 && (
            <div className="notification is-info is-light">
              Aún no hay publicaciones recientes. Crea la primera para la
              comunidad.
            </div>
          )}
          {posts.map((post) => (
            <CardPost key={post.id} post={post} />
          ))}
        </div>
        <aside className="column is-3">
          <div className="card p-4">
            <p className="is-size-6 has-text-weight-semibold mb-3">
              Próximos encuentros
            </p>
            <ul>
              {eventToShow?.map((event: EventType) => {
                return <CardEvent key={event.id} event={event} />;
              })}
            </ul>
            <Link href="/events" className="button is-text is-size-7 mt-3">
              Ver agenda completa
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Updates;
