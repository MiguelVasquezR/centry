"use client";

import { Bookmark, Eye, Heart, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPostDate, getExcerpt, getReadingTime } from "@/src/utils/utils";
import { fallbackCover } from "../constants";
import type { PostListItem } from "@/src/types/postList";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { useEffect, useRef, useState } from "react";
import { useUpdatePostMutation } from "../redux/store/api/postsApi";
import { useLazyGetUserByIdQuery } from "../redux/store/api/usersApi";
import { User } from "../types/user";
import CardPostSkeleton from "./CardPostSkeleton";
import { useGetCommentsByPostQuery } from "../redux/store/api/commentsApi";

const CardPost = ({ post }: { post: PostListItem }) => {
  const coverImage = post.imageUrl?.[0] || fallbackCover;
  const excerpt = getExcerpt(post.content || "", 240);
  const readingMinutes = getReadingTime(post.content || "");
  const reactions = post.reactions?.length ?? 0;
  const readings = post.readings?.length ?? 0;
  const {
    data: commentsData,
    isFetching: isFetchingComments,
    isLoading: isLoadingComments,
    isError: isCommentsError,
  } = useGetCommentsByPostQuery(post.id ?? "", {
    skip: !post.id,
  });
  const comments = commentsData?.length ?? 0;
  const isCommentsLoadingState = isLoadingComments || isFetchingComments;
  const commentCountLabel = isCommentsError
    ? "No disponible"
    : isCommentsLoadingState
      ? "Cargando..."
      : `${comments} comentario${comments === 1 ? "" : "s"}`;
  const authorInitial = post.authorId?.[0]?.toUpperCase() ?? "A";
  const visibilityLabel =
    post.preference?.visibleBy === "general"
      ? "Público general"
      : "Mi generación";
  const relatedBookId = post.preference?.book;
  const relatedBookUrl = relatedBookId ? `/book/${relatedBookId}` : undefined;

  const { width, height } = useWindowSize();
  const [runGlobes, setRunGlobes] = useState(false);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [updatePost] = useUpdatePostMutation();

  const currenId = localStorage.getItem("userId") ?? "";
  const changeColor = post.reactions.find((v: string) => v === currenId);

  const [getUser, { data: author, isLoading: isLoadingAuthor, isFetching: isFetchingAuthor }] =
    useLazyGetUserByIdQuery();
  const [authorPost, setAuthorPost] = useState<User>();
  const hasRequestedAuthorRef = useRef(false);

  useEffect(() => {
    if (post && !hasRequestedAuthorRef.current) {
      getUser(post.authorId);
      hasRequestedAuthorRef.current = true;
    }
  }, [post, getUser]);

  useEffect(() => {
    if (author?.user) {
      setAuthorPost(author.user as User);
    }
  }, [author]);

  const setReaction = () => {
    if (!currenId) {
      return;
    }

    const existingReactions = Array.isArray(post.reactions)
      ? post.reactions
      : [];

    const alreadyReacted = existingReactions.includes(currenId);
    const updatedReactions = alreadyReacted
      ? existingReactions.filter((id) => id !== currenId)
      : [...existingReactions, currenId];

    const reactionNew = {
      ...post,
      reactions: updatedReactions,
    };

    updatePost(reactionNew);

    if (alreadyReacted) {
      setRunGlobes(false);
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
        confettiTimeoutRef.current = null;
      }
      return;
    }

    setRunGlobes(true);
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }
    confettiTimeoutRef.current = setTimeout(() => {
      setRunGlobes(false);
      confettiTimeoutRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  const isAuthorLoading =
    !authorPost && (isLoadingAuthor || isFetchingAuthor || !hasRequestedAuthorRef.current);

  if (isAuthorLoading) {
    return <CardPostSkeleton />;
  }

  return (
    <article className="card p-5 mb-4 is-clickable">
      {runGlobes && (
        <Confetti tweenDuration={1} width={width} height={height} />
      )}

      <header className="is-flex is-justify-content-space-between is-align-items-start is-flex-wrap-wrap">
        <div className="is-flex is-align-items-center is-gap-3">
          <div
            className="is-flex is-justify-content-center is-align-items-center"
            style={{
              width: 48,
              height: 48,
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(72,95,199,0.15), rgba(72,95,199,0.35))",
              color: "#1f2a68",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {authorPost?.imageUrl ? (
              <Image
                src={authorPost.imageUrl}
                alt={authorPost?.name ?? "Avatar"}
                width={48}
                height={48}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
              />
            ) : (
              authorInitial
            )}
          </div>
          <div>
            <p className="is-size-6 has-text-weight-semibold">
              {authorPost?.name ?? "Autor desconocido"}
              {authorPost?.email ? ` | ${authorPost.email}` : ""}
            </p>
            <div className="is-flex is-align-items-center is-gap-1">
              <span className="is-size-7 has-text-grey">
                {formatPostDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/posts/${post.id}`}
          className="button is-text is-size-7 has-text-weight-semibold"
        >
          Ver publicación
        </Link>
      </header>

      <div className="columns is-variable is-5 mt-3">
        <div className="column is-two-thirds">
          <div className="is-flex is-align-items-center is-justify-content-flex-start is-gap-2 mb-2">
            <span className="tag is-light is-info is-rounded">
              <Sparkles size={14} style={{ marginRight: 6 }} />
              {readingMinutes}{" "}
              {readingMinutes === 1
                ? "minuto de lectura"
                : "minutos de lectura"}
            </span>
            {relatedBookUrl && (
              <Link href={relatedBookUrl} className="tag is-light">
                <Bookmark size={14} style={{ marginRight: 6 }} />
                Libro asociado
              </Link>
            )}
          </div>
          <h3 className="is-size-4 has-text-weight-bold mb-2">{post.title}</h3>
          <p className="is-size-6 has-text-grey-dark">{excerpt}</p>
          <div className="tags mt-3">
            <span className="tag is-rounded is-light">{visibilityLabel}</span>
            {relatedBookUrl && (
              <span className="tag is-rounded is-light">Recomendación</span>
            )}
          </div>
        </div>
        <div className="column is-one-third">
          <figure
            className="image is-3by2"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={coverImage}
              alt={`Imagen destacada de ${post.title}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 240px"
              priority
            />
          </figure>
        </div>
      </div>

      <footer className="is-flex is-align-items-center is-justify-content-space-between mt-4">
        <div className="is-flex is-align-items-center is-gap-4">
          <div
            className="is-flex is-align-items-center is-gap-1"
            onClick={setReaction}
          >
            <Heart
              size={18}
              color={changeColor ? "red" : "black"}
              fill={changeColor ? "red" : "white"}
            />
            <span className="is-size-7 has-text-weight-semibold">
              {reactions} reacciones
            </span>
          </div>
          <div className="is-flex is-align-items-center is-gap-1">
            <MessageCircle size={18} />
            <span className="is-size-7 has-text-weight-semibold">
              {commentCountLabel}
            </span>
          </div>
          <div className="is-flex is-align-items-center is-gap-1">
            <Eye size={18} />
            <span className="is-size-7 has-text-weight-semibold">
              {readings} lecturas
            </span>
          </div>
        </div>
        <div className="tag is-rounded is-light">Actualizado</div>
      </footer>
    </article>
  );
};

export default CardPost;
