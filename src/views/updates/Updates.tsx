import { getGreating } from "@/src/utils/utils";
import { Dot, Eye, Heart, MessageCircle, Sparkles, Bookmark } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

type UpdatePost = {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTimeMinutes: number;
  likes: number;
  comments: number;
  readings: number;
  tags: string[];
  ctaLabel: string;
  url: string;
  relatedBook?: {
    title: string;
    url: string;
  };
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
};

const updates: UpdatePost[] = [
  {
    id: "1",
    title: "La narrativa migrante y su impacto en la literatura contemporánea",
    excerpt:
      "Una reflexión sobre las voces desplazadas y cómo sus historias están redefiniendo los géneros narrativos en Latinoamérica.",
    coverImage:
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg",
    publishedAt: "2024-01-10T08:20:00.000Z",
    readTimeMinutes: 6,
    likes: 128,
    comments: 24,
    readings: 543,
    tags: ["Crónica", "Migración", "Identidad"],
    ctaLabel: "Ver publicación",
    url: "/posts/1",
    relatedBook: {
      title: "El viaje interminable",
      url: "/book/1",
    },
    author: {
      id: "m-vasquez",
      name: "Miguel Vásquez",
      role: "Editor en jefe",
      avatar:
        "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg",
    },
  },
  {
    id: "2",
    title: "Club de lectura: poemas que resisten en contextos urbanos",
    excerpt:
      "Resumen de la última sesión y selección de versos imprescindibles para quienes buscan poesía comprometida.",
    coverImage:
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg",
    publishedAt: "2024-01-08T16:45:00.000Z",
    readTimeMinutes: 4,
    likes: 96,
    comments: 12,
    readings: 389,
    tags: ["Club de lectura", "Poesía", "Crítica"],
    ctaLabel: "Revivir sesión",
    url: "/posts/2",
    relatedBook: {
      title: "Piedra y ciudad",
      url: "/book/2",
    },
    author: {
      id: "l-rivera",
      name: "Lucía Rivera",
      role: "Coordinadora de comunidad",
      avatar:
        "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg",
    },
  },
  {
    id: "3",
    title: "Tres ensayos breves sobre la memoria en la literatura afrodescendiente",
    excerpt:
      "Un análisis sobre cómo las autoras afrodescendientes están expandiendo las posibilidades de la autobiografía.",
    coverImage:
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg",
    publishedAt: "2024-01-05T11:10:00.000Z",
    readTimeMinutes: 7,
    likes: 74,
    comments: 18,
    readings: 312,
    tags: ["Ensayo", "Memoria", "Historia"],
    ctaLabel: "Leer ahora",
    url: "/posts/3",
    author: {
      id: "j-mendez",
      name: "Julieta Méndez",
      role: "Invitada especial",
      avatar:
        "https://res.cloudinary.com/dvt4vznxn/image/upload/v1736465366/cld-sample.jpg",
    },
  },
];

const formatPublishedDate = (publishedAt: string) => {
  const date = DateTime.fromISO(publishedAt).setLocale("es");
  if (!date.isValid) {
    return "";
  }

  const formatted = date.toFormat("dd 'de' MMMM, yyyy");
  const relative = date.toRelative();

  return relative ? `${formatted} · ${relative}` : formatted;
};

const formatReadingTime = (minutes: number) =>
  `${minutes} ${minutes === 1 ? "minuto" : "minutos"} de lectura`;

const CardPost = ({ post }: { post: UpdatePost }) => {
  return (
    <article className="card p-5 mb-4 is-clickable">
      <header className="is-flex is-justify-content-space-between is-align-items-start is-flex-wrap-wrap">
        <div className="is-flex is-align-items-center is-gap-3">
          <figure
            className="image is-48x48"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={post.author.avatar}
              alt={`Avatar de ${post.author.name}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="48px"
              priority
            />
          </figure>
          <div>
            <p className="is-size-6 has-text-weight-semibold">
              {post.author.name}
            </p>
            <div className="is-flex is-align-items-center is-gap-1">
              <span className="is-size-7 has-text-grey">
                {post.author.role}
              </span>
              <Dot size={14} />
              <span className="is-size-7 has-text-grey">
                {formatPublishedDate(post.publishedAt)}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={post.url}
          className="button is-text is-size-7 has-text-weight-semibold"
        >
          {post.ctaLabel}
        </Link>
      </header>

      <div className="columns is-variable is-5 mt-3">
        <div className="column is-two-thirds">
          <div className="is-flex is-align-items-center is-justify-content-flex-start is-gap-2 mb-2">
            <span className="tag is-light is-info is-rounded">
              <Sparkles size={14} style={{ marginRight: 6 }} />
              {formatReadingTime(post.readTimeMinutes)}
            </span>
            {post.relatedBook && (
              <Link href={post.relatedBook.url} className="tag is-light">
                <Bookmark size={14} style={{ marginRight: 6 }} />
                {post.relatedBook.title}
              </Link>
            )}
          </div>
          <h3 className="is-size-4 has-text-weight-bold mb-2">{post.title}</h3>
          <p className="is-size-6 has-text-grey-dark">{post.excerpt}</p>
          <div className="tags mt-3">
            {post.tags.map((tag) => (
              <span key={`${post.id}-${tag}`} className="tag is-rounded">
                {tag}
              </span>
            ))}
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
              src={post.coverImage}
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
          <div className="is-flex is-align-items-center is-gap-1">
            <Heart size={18} />
            <span className="is-size-7 has-text-weight-semibold">
              {post.likes} reacciones
            </span>
          </div>
          <div className="is-flex is-align-items-center is-gap-1">
            <MessageCircle size={18} />
            <span className="is-size-7 has-text-weight-semibold">
              {post.comments} comentarios
            </span>
          </div>
          <div className="is-flex is-align-items-center is-gap-1">
            <Eye size={18} />
            <span className="is-size-7 has-text-weight-semibold">
              {post.readings} lecturas
            </span>
          </div>
        </div>
        <div className="tag is-rounded is-light">Actualizado</div>
      </footer>
    </article>
  );
};

const Updates = () => {
  return (
    <div className="container">
      <br />
      <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-direction-column">
          <p className="is-size-4 has-text-weight-bold">
            {getGreating()}, Miguel!
          </p>
          <p className="is-size-6 has-text-grey">
            {DateTime.now().toFormat("dd 'de' MMMM, yyyy")}
          </p>
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
          {updates.map((post) => (
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
                <p className="is-size-7 has-text-grey">15 de enero, 7:00 p.m.</p>
                <p className="is-size-6">Club de lectura &ldquo;Resistencias&rdquo;</p>
              </li>
              <li className="mb-2">
                <p className="is-size-7 has-text-grey">21 de enero, 6:30 p.m.</p>
                <p className="is-size-6">Taller de crónica urbana</p>
              </li>
              <li>
                <p className="is-size-7 has-text-grey">28 de enero, 5:00 p.m.</p>
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
