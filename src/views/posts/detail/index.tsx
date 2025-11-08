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
import {
  useGetCurrentUserQuery,
  useLazyGetUserByIdQuery,
} from "@/src/redux/store/api/usersApi";
import { useEffect, useState } from "react";
import { User } from "@/src/types/user";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByPostQuery,
  useUpdateCommentMutation,
} from "@/src/redux/store/api/commentsApi";
import type { PostComment } from "@/src/types/comment";
import GeneralModal from "@/src/component/GeneralModal";

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

const formatCommentDate = (value: unknown) => {
  const datetime = coerceDateTime(value)?.setLocale("es");
  if (!datetime || !datetime.isValid) return "";

  return datetime.toFormat("dd 'de' MMM yyyy, HH:mm");
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
  const [localUserId, setLocalUserId] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentInActionId, setCommentInActionId] = useState<string | null>(null);
  const [commentPendingDelete, setCommentPendingDelete] =
    useState<PostComment | null>(null);

  const {
    data: post,
    isLoading,
    isError,
  } = useFetchPostByIdQuery(postId, { skip: !postId });

  const [updatePost] = useUpdatePostMutation();

  const [getUser, { data: author, isLoading: isLoadingAuthor }] =
    useLazyGetUserByIdQuery();

  const { data: currentUser } = useGetCurrentUserQuery(undefined);

  const {
    data: commentList,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
    refetch: refetchComments,
  } = useGetCommentsByPostQuery(postId, { skip: !postId });

  const comments = commentList ?? [];

  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] =
    useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] =
    useDeleteCommentMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") ?? "";
      setLocalUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (post) {
      getUser(post.authorId);
    }
  }, [post, getUser]);

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
  }, [post, author, updatePost]);

  const currentUserId = currentUser?.id ?? localUserId;
  const currentUserRole = currentUser?.rol ?? "student";
  const isDeleteModalOpen = Boolean(commentPendingDelete);
  const isDeletingSelectedComment =
    Boolean(commentPendingDelete?.id) &&
    commentPendingDelete?.id === commentInActionId &&
    isDeletingComment;

  const canManageComment = (comment: PostComment) =>
    currentUserRole === "admin" || comment.authorId === currentUserId;

  const hasCommentBeenEdited = (comment: PostComment) => {
    if (!comment.updatedAt) {
      return false;
    }
    const created = coerceDateTime(comment.createdAt);
    const updated = coerceDateTime(comment.updatedAt);
    if (!created || !updated) {
      return false;
    }
    return created.toMillis() !== updated.toMillis();
  };

  const resetCommentError = () => {
    if (commentError) {
      setCommentError(null);
    }
  };

  const handleStartEdit = (comment: PostComment) => {
    if (!comment.id) {
      return;
    }
    resetCommentError();
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    resetCommentError();
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleRequestDeleteComment = (comment: PostComment) => {
    resetCommentError();
    setCommentPendingDelete(comment);
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingSelectedComment) {
      return;
    }
    setCommentPendingDelete(null);
    setCommentInActionId(null);
    setCommentError(null);
  };

  const handleCreateComment = async () => {
    if (!postId) return;

    if (!currentUserId) {
      setCommentError("Necesitas iniciar sesión para comentar.");
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed) {
      setCommentError("Ingresa un comentario antes de publicar.");
      return;
    }

    try {
      resetCommentError();
      await createComment({
        postId,
        authorId: currentUserId,
        authorName: currentUser?.name ?? "Usuario",
        authorImage: currentUser?.imageUrl ?? "",
        content: trimmed,
      }).unwrap();
      setNewComment("");
      await refetchComments();
    } catch (error) {
      console.error("Error al crear comentario:", error);
      setCommentError("No pudimos publicar tu comentario. Intenta nuevamente.");
    }
  };

  const handleUpdateComment = async () => {
    if (!postId || !editingCommentId) {
      return;
    }

    const trimmed = editingContent.trim();
    if (!trimmed) {
      setCommentError("El comentario no puede estar vacío.");
      return;
    }

    try {
      resetCommentError();
      await updateComment({
        id: editingCommentId,
        content: trimmed,
        postId,
      }).unwrap();
      setEditingCommentId(null);
      setEditingContent("");
      await refetchComments();
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
      setCommentError(
        "Hubo un problema al actualizar el comentario. Intenta nuevamente."
      );
    }
  };

  const handleDeleteComment = async () => {
    if (!commentPendingDelete?.id || !postId) {
      return;
    }

    try {
      resetCommentError();
      setCommentInActionId(commentPendingDelete.id ?? null);
      await deleteComment({
        id: commentPendingDelete.id,
        postId,
      }).unwrap();
      if (editingCommentId === commentPendingDelete.id) {
        setEditingCommentId(null);
        setEditingContent("");
      }
      await refetchComments();
      setCommentPendingDelete(null);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      setCommentError("No pudimos eliminar el comentario. Vuelve a intentarlo.");
    } finally {
      setCommentInActionId(null);
    }
  };

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
          <div className="card mt-4">
            <div className="card-content">
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <p className="title is-5 mb-0">
                  Comentarios ({comments.length})
                </p>
                {isFetchingComments && (
                  <span className="tag is-info is-light is-size-7">
                    Actualizando…
                  </span>
                )}
              </div>
              {isLoadingComments ? (
                <p className="has-text-grey">Cargando comentarios…</p>
              ) : comments.length === 0 ? (
                <p className="has-text-grey">
                  Aún no hay comentarios. Sé la primera persona en participar.
                </p>
              ) : (
                <div className="is-flex is-flex-direction-column is-gap-3">
                  {comments.map((comment) => (
                    <article
                      key={comment.id}
                      className="p-3"
                      style={{
                        borderRadius: "14px",
                        border: "1px solid #e8e8e8",
                      }}
                    >
                      <div className="is-flex is-justify-content-space-between is-align-items-start">
                        <div>
                          <p className="has-text-weight-semibold mb-0">
                            {comment.authorName || "Usuario"}
                          </p>
                          <p className="is-size-7 has-text-grey">
                            {formatCommentDate(comment.createdAt) ||
                              "Fecha no disponible"}
                            {hasCommentBeenEdited(comment) ? " · Editado" : ""}
                          </p>
                        </div>
                        {canManageComment(comment) && (
                          <div className="buttons are-small mb-0">
                            {editingCommentId === comment.id ? (
                              <>
                                <button
                                  type="button"
                                  className="button is-success is-light"
                                  onClick={handleUpdateComment}
                                  disabled={
                                    isUpdatingComment ||
                                    !editingContent.trim()
                                  }
                                >
                                  {isUpdatingComment ? "Guardando…" : "Guardar"}
                                </button>
                                <button
                                  type="button"
                                  className="button is-light"
                                  onClick={handleCancelEdit}
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="button is-link is-light"
                                  onClick={() => handleStartEdit(comment)}
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className="button is-danger is-light"
                                  onClick={() =>
                                    handleRequestDeleteComment(comment)
                                  }
                                  disabled={
                                    isDeletingComment &&
                                    commentInActionId === comment.id
                                  }
                                >
                                  {isDeletingComment &&
                                  commentInActionId === comment.id
                                    ? "Eliminando…"
                                    : "Eliminar"}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        {editingCommentId === comment.id ? (
                          <textarea
                            className="textarea"
                            value={editingContent}
                            onChange={(event) => {
                              if (commentError) {
                                setCommentError(null);
                              }
                              setEditingContent(event.target.value);
                            }}
                            rows={3}
                          />
                        ) : (
                          <p
                            className="is-size-6"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <hr className="my-4" />
              <div>
                <p className="title is-6">Escribe un comentario</p>
                {commentError && (
                  <div className="notification is-danger is-light py-2 px-3">
                    {commentError}
                  </div>
                )}
                <textarea
                  className="textarea"
                  placeholder="Comparte tus ideas o preguntas..."
                  value={newComment}
                  onChange={(event) => {
                    if (commentError) {
                      setCommentError(null);
                    }
                    setNewComment(event.target.value);
                  }}
                  rows={3}
                  disabled={!currentUserId || isCreatingComment}
                />
                {!currentUserId && (
                  <p className="help is-warning mt-1">
                    Inicia sesión para dejar un comentario.
                  </p>
                )}
                <button
                  className="button is-primary mt-3"
                  type="button"
                  onClick={handleCreateComment}
                  disabled={
                    !currentUserId ||
                    isCreatingComment ||
                    !newComment.trim()
                  }
                >
                  {isCreatingComment ? "Publicando…" : "Publicar comentario"}
                </button>
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

      <GeneralModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Eliminar comentario"
        description="¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer."
        confirmLabel={isDeletingSelectedComment ? "Eliminando…" : "Eliminar"}
        cancelLabel="Cancelar"
        confirmDisabled={isDeletingSelectedComment}
        onConfirm={handleDeleteComment}
      >
        <p className="mb-2">
          Autor:{" "}
          <strong>{commentPendingDelete?.authorName || "Usuario"}</strong>
        </p>
        <div
          className="p-3 has-background-light"
          style={{ borderRadius: "12px", whiteSpace: "pre-wrap" }}
        >
          {commentPendingDelete?.content}
        </div>
      </GeneralModal>
    </div>
  );
};

export default PostDetailView;
