"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useFetchPostsQuery } from "@/src/redux/store/api/postsApi";
import { getGreating } from "@/src/utils/utils";
import CardPost from "./components/CardPost";
import type { PostListItem } from "@/src/types/postList";

const Updates = () => {
  const {
    data,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useFetchPostsQuery({ limit: 20, page: 1 });

  const posts = (data?.posts ?? []) as PostListItem[];
  const [greeting, setGreeting] = useState("");
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    setGreeting(getGreating());
    setTodayLabel(
      DateTime.now().setLocale("es").toFormat("dd 'de' MMMM, yyyy")
    );
  }, []);

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
          <Link href="/posts" className="button is-light">
            Ver publicaciones
          </Link>
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
              <li className="mb-2">
                <p className="is-size-7 has-text-grey">
                  15 de enero, 7:00 p.m.
                </p>
                <p className="is-size-6">
                  Club de lectura &ldquo;Resistencias&rdquo;
                </p>
              </li>
              <li className="mb-2">
                <p className="is-size-7 has-text-grey">
                  21 de enero, 6:30 p.m.
                </p>
                <p className="is-size-6">Taller de crónica urbana</p>
              </li>
              <li>
                <p className="is-size-7 has-text-grey">
                  28 de enero, 5:00 p.m.
                </p>
                <p className="is-size-6">Conversatorio con autoras invitadas</p>
              </li>
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
