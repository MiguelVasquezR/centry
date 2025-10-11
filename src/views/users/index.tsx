import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Users = () => {
  const CardUser = () => {
    return (
      <div className="column">
        <div className="card has-shadow is-relative">
          <div style={{ position: "absolute", right: 4, top: 4, zIndex: 1 }}>
            <EllipsisVertical />
          </div>
          <div className="card-image">
            <figure
              className="image is-4by3"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <Image
                src="https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg"
                alt="Foto de usuario"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            </figure>
          </div>
          <div className="card-content has-text-centered">
            <p className="title is-5 has-text-dark">Miguel Vásquez</p>
            <p className="subtitle is-6 has-text-grey">S19025267</p>
          </div>
        </div>
      </div>
    );
  };

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

        <div className="columns">
          <CardUser />
          <CardUser />
          <CardUser />
          <CardUser />
          <CardUser />
          <CardUser />
          <CardUser />
          <CardUser />
        </div>
      </div>
    </div>
  );
};

export default Users;
