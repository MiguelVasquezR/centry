import { getGreating } from "@/src/utils/utils";
import { Dot } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

const Updates = () => {
  const CardPost = () => {
    return (
      <div className="card p-2 is-clickable">
        <div className="is-flex is-gap-2">
          <div>
            <figure
              className="image is-48x48 is-roundeds"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <Image
                src="https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg"
                alt="Foto de usuario"
                fill
                style={{ objectFit: "cover", borderRadius: 100 }}
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            </figure>
          </div>
          <div>
            <p className="is-size-6">Miguel Vásquez</p>
            <p className="is-size-7">
              {DateTime.now().toFormat("MM dd, yyyy")}
            </p>
          </div>
        </div>
        <br />

        <div className="columns">
          <div className="column">
            <p className="is-size-4 has-text-weight-bold">Título</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam,
              blanditiis? Error autem sint vero odio magni, alias rerum
              necessitatibus quia illum harum ducimus suscipit tenetur, minima
              eum itaque consequatur? Necessitatibus?
            </p>
          </div>

          <div className="column is-3">
            <figure
              className="image is-2by1"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <Image
                src="https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg"
                alt="Foto de usuario"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            </figure>
          </div>
        </div>

        <div className="is-flex is-gap-1">
          <div>
            <p>50 Likes</p>
          </div>
          <div className="is-flex is-justify-content-center is-align-items-center">
            <Dot />
          </div>
          <div>
            <p>286 Lecturas</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <br />
      <div className="is-flex is-flex-direction-row is-justify-content-space-between">
        <div className="is-flex is-flex-direction-column is-justify-content-space-between">
          <p className="is-size-4 has-text-weight-bold">
            {getGreating()}, Miguel!
          </p>
          <p className="is-size-4 has-text-weight-bold">
            {DateTime.now().toFormat("dd/MM/yyyy")}
          </p>
        </div>

        <div>
          <Link
            className="button is-primary has-text-white"
            href={"/posts/create"}
          >
            Crear publicación
          </Link>
        </div>
      </div>
      <br />

      <div className="columns">
        <div className="column">
          <CardPost />
          <CardPost />
          <CardPost />
          <CardPost />
          <CardPost />
        </div>
        <div className="column is-3"></div>
      </div>
    </div>
  );
};

export default Updates;
