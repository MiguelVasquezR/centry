"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import {
  Mail,
  BookOpen,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  useGetCurrentUserQuery,
  useLazyGetUserByIdQuery,
} from "@/src/redux/store/api/usersApi";
import type { User } from "@/src/types/user";
import clsx from "clsx";
import Loader from "@/src/component/Loader";

const fallbackAvatar =
  "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758764097/138617_ar3v0q.jpg";

const UserProfile = () => {
  const router = useRouter();
  const params = useParams();
  const userId = typeof params?.id === "string" ? params.id : "";

  const [fetchUser, { data, isLoading, isFetching, isError }] =
    useLazyGetUserByIdQuery();

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useGetCurrentUserQuery(undefined);
  const { rol = "student", id: currentUserId } = currentUser || {};

  const canEdit = rol === "admin" || currentUserId === userId;

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  if (!userId) {
    return (
      <div className="container">
        <br />
        <div className="notification is-danger">
          No se proporcionó un identificador de usuario.
        </div>
      </div>
    );
  }

  const user = (data as { user?: User })?.user;
  const isBusy = isLoading || isFetching;

  if (isBusy && !user) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="container">
        <br />
        <div className="notification is-danger">
          Ocurrió un error al cargar el perfil. Intenta nuevamente más tarde.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <br />
        <div className="notification is-warning">
          No encontramos información para este usuario.
        </div>
        <button className="button is-light mt-3" onClick={() => router.back()}>
          Volver
        </button>
      </div>
    );
  }

  const { name, imageUrl, email, biography, tuition, topics, isActive } = user;

  if (isLoadingCurrentUser) {
    return <Loader />;
  }

  return (
    <div className="container">
      <br />
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <button
          className="button is-light is-small"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver
        </button>
        <Link href="/users" className="button is-text is-small">
          Ver directorio
        </Link>
      </div>

      <div
        className="card mb-5"
        style={{
          border: "none",
          background:
            "linear-gradient(135deg, rgba(63,86,173,0.12) 0%, rgba(118,75,162,0.18) 100%)",
        }}
      >
        <div className="card-content">
          <div className="columns is-vcentered">
            <div className="column is-narrow">
              <figure
                className="image is-128x128"
                style={{
                  borderRadius: "28px",
                  overflow: "hidden",
                  border: "4px solid rgba(255,255,255,0.85)",
                }}
              >
                <Image
                  src={imageUrl || fallbackAvatar}
                  alt={name}
                  width={128}
                  height={128}
                  style={{ objectFit: "cover" }}
                />
              </figure>
            </div>
            <div className="column">
              <div className="is-flex is-align-items-center is-gap-3 is-flex-wrap-wrap mb-2">
                <h1 className="title is-3 mb-0 has-text-dark">{name}</h1>
                <span
                  className={`tag is-medium ${
                    isActive ? "is-success is-light" : "is-danger is-light"
                  }`}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 size={16} className="mr-1" />
                      Activo
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="mr-1" />
                      Inactivo
                    </>
                  )}
                </span>
              </div>
              <p className="subtitle is-6 has-text-grey mb-1">
                Matrícula · <strong>{tuition}</strong>
              </p>
              <p className="subtitle is-6 has-text-grey-dark">
                <Mail size={16} className="mr-2" />
                {email}
              </p>
              <div className="is-flex is-align-items-center is-gap-2 mt-3">
                <Link
                  href={`/users/edit/${user.id}`}
                  className={clsx("button is-primary is-light", {
                    "is-hidden": !canEdit,
                  })}
                >
                  Editar perfil
                </Link>
                <Link href="/events" className="button is-link is-light">
                  <Calendar size={16} className="mr-2" />
                  Ver próximos eventos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="columns is-variable is-5">
        <div className="column is-8">
          <div className="card mb-4">
            <div className="card-content">
              <p className="title is-5 mb-3">Biografía</p>
              <p className="is-size-6 has-text-grey-dark">
                {biography ||
                  "El usuario todavía no ha agregado una biografía."}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <p className="title is-5 mb-3">Temas de interés</p>
              {topics && topics.length > 0 ? (
                <div className="tags are-medium">
                  {topics.map((topic) => (
                    <span key={topic} className="tag is-info is-light">
                      <BookOpen size={14} className="mr-2" />
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="is-size-6 has-text-grey">
                  Aún no se han registrado temas favoritos.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="column is-4">
          <div className="card">
            <div className="card-content">
              <p className="title is-5 mb-3">Datos de contacto</p>
              <div className="mb-3">
                <p className="is-size-7 has-text-grey">Correo electrónico</p>
                <p className="is-size-6 has-text-weight-semibold">{email}</p>
              </div>
              <div className="mb-3">
                <p className="is-size-7 has-text-grey">Matrícula</p>
                <p className="is-size-6 has-text-weight-semibold">{tuition}</p>
              </div>
              <div>
                <p className="is-size-7 has-text-grey">Estado</p>
                <p
                  className={`is-size-6 has-text-weight-semibold ${
                    isActive ? "has-text-success" : "has-text-danger"
                  }`}
                >
                  {isActive ? "Disponible para colaborar" : "Cuenta inactiva"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
