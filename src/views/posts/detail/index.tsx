"use client";

import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  useFetchPostByIdQuery,
  useUpdatePostMutation,
} from "@/src/redux/store/api/postsApi";
import { ChevronLeft, BookOpen, Eye, Heart } from "lucide-react";
import type { FirestoreTimestamp } from "@/src/types/postList";
import { useLazyGetUserByIdQuery } from "@/src/redux/store/api/usersApi";
import { useEffect, useState } from "react";
import { User } from "@/src/types/user";

const coerceDateTime = (value: unknown): DateTime | null => {
  if (!value) return null;

  if (typeof value === "string") {
    const dt = DateTime.fromISO(value, { zone: "utc" });
    if (dt.isValid) return dt;
    const fromJS = DateTime.fromJSDate(new Date(value));
    return fromJS.isValid ? fromJS : null;
  }

  if (value instanceof Date) {
    const dt = DateTime.fromJSDate(value);
    return dt.isValid ? dt : null;
  }

  if (typeof value === "number") {
    const dt = DateTime.fromMillis(value);
    return dt.isValid ? dt : null;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, "seconds")
  ) {
    const { seconds, nanoseconds = 0 } = value as FirestoreTimestamp;
    const millis = seconds * 1000 + Math.floor(nanoseconds / 1_000_000);
    const dt = DateTime.fromMillis(millis);
    return dt.isValid ? dt : null;
  }

  return null;
};

const formatDate = (value: unknown) => {
  const datetime = coerceDateTime(value)?.setLocale("es");
  if (!datetime || !datetime.isValid) return "";

  const relative = datetime.toRelative({ style: "short" }) ?? "";
  return `${datetime.toFormat("dd 'de' MMMM, yyyy")}${
    relative ? ` · ${relative}` : ""
  }`;
};

const sanitizeHTML = (html: string) => {
  if (typeof window === "undefined") {
    return html;
  }
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.innerHTML;
};

const PostDetailView = () => {
  const params = useParams();
  const router = useRouter();
  const postId = typeof params?.id === "string" ? params.id : "";
  const [authorPost, setAuthorPost] = useState<User>();

  const {
    data: post,
    isLoading,
    isError,
  } = useFetchPostByIdQuery(postId, { skip: !postId });

  const [updatePost] = useUpdatePostMutation();

  const [getUser, { data: author, isLoading: isLoadingAuthor }] =
    useLazyGetUserByIdQuery();

  useEffect(() => {
    if (post) {
      getUser(post.authorId);
    }
  }, [post]);

  useEffect(() => {
    if (author?.user) {
      setAuthorPost(author.user as User);
    }
  }, [author]);

  useEffect(() => {
    if (!post || !author) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const alreadyRead = post.readings?.includes(userId);
    if (alreadyRead) return;

    const updatedPost = {
      ...post,
      readings: [...(post.readings || []), userId],
    };

    updatePost(updatedPost);
  }, [post, author]);

  if (!postId) {
    return (
      <div className="container">
        <div className="notification is-danger mt-6">
          No se proporcionó un identificador de publicación.
        </div>
      </div>
    );
  }

  if (isLoading || isLoadingAuthor) {
    return (
      <div className="container">
        <div className="has-text-centered my-6">
          <div className="loader is-loading" />
          <p className="mt-3">Cargando publicación...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container">
        <div className="notification is-danger mt-6">
          Ocurrió un error al cargar la publicación. Intenta nuevamente más
          tarde.
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(post.createdAt);
  const mainImage = post.imageUrl?.[0];
  const remainingImages = post.imageUrl?.slice(1) ?? [];
  const visibilityLabel =
    post.preference?.visibleBy === "general"
      ? "Público general"
      : "Mi generación";

  return (
    <div className="container">
      <br />
      <div className="card mb-5">
        <div className="card-content">
          <div className="level is-mobile">
            <div className="level-left">
              <button
                onClick={() => router.back()}
                className="button is-light is-medium mr-4"
                type="button"
              >
                <ChevronLeft className="mr-2" />
                Regresar
              </button>
              <div>
                <p className="title is-3 mb-1">{post.title}</p>
                <p className="is-size-6 has-text-grey">
                  {formattedDate || "Fecha no disponible"}
                </p>
                <div className="tags mt-2">
                  <span className="tag is-info is-light">
                    <Heart size={16} className="mr-1" />
                    {post.reactions?.length ?? 0} reacciones
                  </span>
                  <span className="tag is-light">
                    <Eye size={16} className="mr-1" />
                    {post.readings?.length ?? 0} lecturas
                  </span>
                  {post.preference?.book && (
                    <Link
                      href={`/book/${post.preference.book}`}
                      className="tag is-primary is-light"
                    >
                      <BookOpen size={16} className="mr-1" />
                      Libro relacionado
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="level-right">
              <span className="tag is-size-7 is-light has-text-weight-semibold">
                Visibilidad: {visibilityLabel}
              </span>
            </div>
          </div>

          {mainImage && (
            <div
              className="mt-5"
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src={mainImage}
                alt={post.title}
                width={1200}
                height={540}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
                priority
              />
            </div>
          )}

          {remainingImages.length > 0 && (
            <div className="columns is-multiline mt-3">
              {remainingImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="column is-4-tablet is-3-desktop"
                >
                  <figure
                    className="image is-3by2"
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${post.title} imagen ${index + 2}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 240px"
                      style={{ objectFit: "cover" }}
                    />
                  </figure>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="columns">
        <div className="column is-8">
          <div className="card">
            <div className="card-content">
              <div className="content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(post.content),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="column is-4">
          <div className="card">
            <div className="card-content">
              <p className="title is-6 mb-3">Datos de la publicación</p>
              <p className="is-size-7 has-text-grey">Autor del post</p>
              <Link
                href={`/users/${authorPost?.id}`}
                className="is-size-6 has-text-weight-semibold"
              >
                {authorPost?.name}
              </Link>
              <hr />
              <p className="is-size-7 has-text-grey">Visibilidad</p>
              <p className="is-size-6 has-text-weight-semibold">
                {visibilityLabel}
              </p>
              {post.preference?.book && (
                <>
                  <hr />
                  <p className="is-size-7 has-text-grey">Libro asociado</p>
                  <Link
                    href={`/book/${post.preference.book}`}
                    className="is-size-6 has-text-link has-text-weight-semibold"
                  >
                    Ver libro vinculado
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailView;
