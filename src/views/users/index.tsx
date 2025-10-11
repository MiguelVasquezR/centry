"use client";

import { useGetUserFilerQuery } from "@/src/redux/store/api/usersApi";
import { User } from "@/src/types/user";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Users = () => {
  const { data: users, isLoading: isLoadingUsers } =
    useGetUserFilerQuery(undefined);

  const CardUser = ({ user }: { user: User }) => {
    return (
      <div className="column is-2">
        <div className="card has-shadow is-relative">
          <div
            className="has-background-white is-flex is-clickable"
            style={{
              position: "absolute",
              right: 6,
              top: 6,
              zIndex: 1,
              borderRadius: 4,
            }}
          >
            <EllipsisVertical />
          </div>
          <div className="card-image">
            <figure
              className="image is-4by3"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <Image
                src={user.imageUrl}
                alt="Foto de usuario"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            </figure>
          </div>
          <div className="card-content has-text-centered">
            <p className="title is-5 has-text-dark">{user.name}</p>
            <p className="subtitle is-6 has-text-grey">{user.tuition}</p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoadingUsers) {
    return <div>Cargando</div>;
  }

  return (
    <div className="container">
      <br />

      <div className="is-flex is-justify-content-space-between">
        <div className="">
          <p className="is-size-4 has-text-weight-bold">Usuarios</p>
        </div>

        <div className="">
          <Link href="/users/add" className="button is-primary has-text-white">
            Agregar
          </Link>
        </div>
      </div>

      <br />

      <div>
        <div className="card p-3">
          <div>
            <input
              type="text"
              className="input"
              placeholder="Buscar por nombre"
            />
          </div>
        </div>

        {Object.entries(users || [])
          .sort(([a], [b]) => Number(b.slice(1)) - Number(a.slice(1)))
          .map(([gen, users]) => (
            <div key={gen}>
              <h3 className="is-size-4 has-text-weight-bold">{gen}</h3>
              <br />
              <div className="columns">
                {users.map((u) => (
                  <CardUser key={u.id} user={u} />
                ))}
              </div>
              <br />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Users;
