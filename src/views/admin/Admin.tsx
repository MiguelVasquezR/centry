"use client";

import {
  ClipboardList,
  Clock,
  ArrowRight,
  Film,
  Book,
  PlusCircle,
  Layers,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

const activeLoans = [
  {
    borrower: "Miguel Herrera",
    item: "Cámara Canon XF405",
    loanedOn: "15 oct",
    dueDate: "22 oct",
    status: "Retrasado",
  },
  {
    borrower: "Ana Castillo",
    item: "Micrófono Rode NTG2",
    loanedOn: "18 oct",
    dueDate: "25 oct",
    status: "Pendiente devolución",
  },
  {
    borrower: "Luis Prieto",
    item: "Libro: Crónicas del agua",
    loanedOn: "19 oct",
    dueDate: "26 oct",
    status: "Pendiente aprobación",
  },
  {
    borrower: "María López",
    item: "Proyector Epson X32",
    loanedOn: "18 oct",
    dueDate: "27 oct",
    status: "En curso",
  },
];

const upcomingEvents = [
  {
    title: "Proyección: Voces del campo",
    datetime: "20 oct · 19:00",
    location: "Sala principal",
    coordinator: "Laura Méndez",
    category: "Cine comunitario",
  },
  {
    title: "Club de lectura: Letras del mar",
    datetime: "22 oct · 17:30",
    location: "Biblioteca",
    coordinator: "Carlos Andrade",
    category: "Literatura",
  },
  {
    title: "Taller de archivo oral",
    datetime: "24 oct · 16:00",
    location: "Laboratorio sonoro",
    coordinator: "Equipo Documental",
    category: "Formación",
  },
  {
    title: "Ciclo de cine andino",
    datetime: "27 oct · 18:00",
    location: "Terraza",
    coordinator: "Producción",
    category: "Programación especial",
  },
];

const quickActions = [
  {
    title: "Nuevo evento",
    description: "Publica una proyección, taller o club de lectura",
    href: "/events/create",
    icon: PlusCircle,
    group: "agenda",
  },
  {
    title: "Nuevo préstamo",
    description: "Registra la entrega o devolución de equipo y libros",
    href: "/loans/create",
    icon: ClipboardList,
    group: "agenda",
  },
  {
    title: "Agregar libro",
    description: "Integra nuevos títulos al catálogo de la biblioteca",
    href: "/books/add",
    icon: Book,
    group: "catalog",
  },
  {
    title: "Agregar película",
    description: "Actualiza el catálogo audiovisual y sus fichas",
    href: "/library/movies/new",
    icon: Film,
    group: "catalog",
  },
  {
    title: "Agregar categoría",
    description: "Organiza colecciones y eventos por temática",
    href: "/categories/new",
    icon: Layers,
    group: "catalog",
  },
  {
    title: "Agregar usuario",
    description: "Invita a una persona al equipo de administración",
    href: "/users/new",
    icon: UserPlus,
    group: "team",
  },
];

const actionGroups = [
  {
    id: "agenda",
    title: "Agenda y operativa",
    description: "Coordina actividades y responde a solicitudes urgentes.",
  },
  {
    id: "catalog",
    title: "Catálogo y colecciones",
    description: "Actualiza el acervo de libros y películas.",
  },
  {
    id: "team",
    title: "Equipo y permisos",
    description: "Gestiona accesos y roles del personal.",
  },
];

const statusClass = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("retrasado")) return "tag is-danger is-light";
  if (normalized.includes("pendiente")) return "tag is-warning is-light";
  if (normalized.includes("revisión") || normalized.includes("borrador"))
    return "tag is-info is-light";
  if (normalized.includes("confirmado") || normalized.includes("curso"))
    return "tag is-success is-light";
  return "tag is-light";
};

const AdminDashboard = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  const overdueLoans = activeLoans.filter((loan) =>
    loan.status.toLowerCase().includes("retrasado")
  ).length;

  const sidebarStats = [
    { label: "Eventos próximos", value: upcomingEvents.length },
    { label: "Préstamos atrasados", value: overdueLoans },
    { label: "Activos en curso", value: activeLoans.length },
  ];

  return (
    <section className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container admin-dashboard">
        <aside className="sidebar">
          <div className="sidebar__header">
            <span className="sidebar__badge">Hoy · {formattedDate}</span>
            <h2 className="sidebar__heading">Coordinación Letras</h2>
            <p className="sidebar__subheading">
              Toma atajos para resolver la jornada sin perder contexto.
            </p>
          </div>

          <div className="sidebar__stats">
            {sidebarStats.map(({ label, value }) => (
              <div key={label} className="sidebar__stat">
                <span className="sidebar__stat-value">{value}</span>
                <span className="sidebar__stat-label">{label}</span>
              </div>
            ))}
          </div>

          <nav className="sidebar__sections">
            {actionGroups.map(({ id, title, description }) => {
              const actions = quickActions.filter(
                (action) => action.group === id
              );

              if (!actions.length) {
                return null;
              }

              return (
                <div key={id} className="sidebar__section">
                  <div className="sidebar__section-intro">
                    <p className="sidebar__section-title">{title}</p>
                    <p className="sidebar__section-description">
                      {description}
                    </p>
                  </div>
                  <div className="sidebar__links">
                    {actions.map(
                      ({
                        title: actionTitle,
                        description: actionDescription,
                        href,
                        icon: Icon,
                      }) => (
                        <Link
                          key={actionTitle}
                          href={href}
                          className="sidebar__link"
                        >
                          <div className="sidebar__link-top">
                            <span className="sidebar__link-icon">
                              <Icon size={22} />
                            </span>
                            <span className="sidebar__chevron-wrapper">
                              <ArrowRight
                                size={20}
                                className="sidebar__chevron"
                              />
                            </span>
                          </div>
                          <div className="sidebar__link-body">
                            <span className="sidebar__link-title">
                              {actionTitle}
                            </span>
                            <span className="sidebar__link-subtitle">
                              {actionDescription}
                            </span>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="main-area">
          <header className="mb-5">
            <p className="title is-3 mb-2">Panel administrativo</p>
            <p className="subtitle is-6 has-text-grey-dark mb-0">
              Gestiona préstamos, agenda y catálogo con una visión clara de lo
              urgente.
            </p>
          </header>

          <div className="columns is-variable is-5">
            <div className="column is-6">
              <div className="box dashboard-card list-card">
                <div className="list-card__header">
                  <ClipboardList size={20} className="list-card__icon" />
                  <div>
                    <p className="title is-5 mb-1">Préstamos activos</p>
                    <p className="subtitle is-7 has-text-grey">
                      Seguimiento de entregas y devoluciones en curso.
                    </p>
                  </div>
                </div>
                <div className="list-card__body">
                  {activeLoans.map((loan) => {
                    const isOverdue = loan.status
                      .toLowerCase()
                      .includes("retrasado");

                    return (
                      <div
                        key={`${loan.item}-${loan.borrower}`}
                        className="list-item"
                      >
                        <div>
                          <p className="list-primary">{loan.item}</p>
                          <p className="list-secondary">
                            Entregado a {loan.borrower} · {loan.loanedOn}
                          </p>
                        </div>
                        <div className="list-meta">
                          <span className="list-secondary">
                            Devuelve {loan.dueDate}
                          </span>
                          <span className={statusClass(loan.status)}>
                            {loan.status}
                          </span>
                          {isOverdue && (
                            <button
                              type="button"
                              className="list-action list-action--danger"
                            >
                              Enviar correo automático
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="column is-6">
              <div className="box dashboard-card list-card">
                <div className="list-card__header">
                  <Clock
                    size={20}
                    className="list-card__icon has-text-primary-dark"
                  />
                  <div>
                    <p className="title is-5 mb-1">Próximos eventos</p>
                    <p className="subtitle is-7 has-text-grey">
                      Agenda lo siguiente en calendario y logística.
                    </p>
                  </div>
                </div>
                <div className="list-card__body">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="list-item">
                      <div>
                        <p className="list-primary">{event.title}</p>
                        <p className="list-secondary">
                          {event.datetime} · {event.location}
                        </p>
                        <p className="list-secondary">
                          Coordina {event.coordinator}
                        </p>
                      </div>
                      <div className="list-meta">
                        <span className="event-chip">{event.category}</span>
                        <button type="button" className="list-action">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          display: grid;
          grid-template-columns: 330px 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        .dashboard-card {
          border: none;
          border-radius: 18px;
          box-shadow: 0 24px 45px -35px rgba(15, 23, 42, 0.38);
        }

        .list-card__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .list-card__icon {
          color: #1d4ed8;
        }

        .list-card__body {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .list-item {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          background-color: #f8fafc;
        }

        .list-item:nth-child(odd) {
          background-color: #eef2ff;
        }

        .list-primary {
          font-weight: 600;
          color: #0f172a;
        }

        .list-secondary {
          font-size: 0.75rem;
          color: #64748b;
        }

        .list-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
        }

        .event-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.12);
          color: #1d4ed8;
          font-weight: 600;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .list-action {
          border: none;
          border-radius: 12px;
          padding: 0.55rem 0.9rem;
          background: #1d4ed8;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
        }

        .list-action:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -20px rgba(37, 99, 235, 0.9);
        }

        .list-action--danger {
          background: #dc2626;
        }

        .sidebar {
          background: #ffffff;
          border-radius: 22px;
          padding: 2rem 1.75rem;
          color: #111827;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          box-shadow: 0 24px 45px -35px rgba(15, 23, 42, 0.24);
          border: 1px solid #e2e8f0;
        }

        .sidebar__badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.08);
          color: #0f172a;
        }

        .sidebar__heading {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .sidebar__subheading {
          font-size: 0.8rem;
          color: #475569;
          margin: 0;
        }

        .sidebar__stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .sidebar__stat {
          padding: 0.85rem 1rem;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .sidebar__stat-value {
          display: block;
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
        }

        .sidebar__stat-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748b;
        }

        .sidebar__sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar__section-intro {
          margin-bottom: 1rem;
        }

        .sidebar__section-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
          margin-bottom: 0.35rem;
          color: #1e293b;
        }

        .sidebar__section-description {
          font-size: 0.75rem;
          margin: 0;
          color: #64748b;
        }

        .sidebar__links {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          align-items: flex-start;
        }

        .sidebar__link {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.9rem;
          padding: 1.1rem 1.05rem;
          border-radius: 18px;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          border: 1px solid #e2e8f0;
          box-shadow: 0 14px 28px -25px rgba(15, 23, 42, 0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            border-color 0.2s ease;
          max-width: 280px;
          width: 100%;
          align-self: flex-start;
          position: relative;
          overflow: hidden;
        }

        .sidebar__link-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          width: 100%;
        }

        .sidebar__link > * {
          position: relative;
          z-index: 1;
        }

        .sidebar__link:hover {
          transform: translateY(-2px);
          border-color: #cbd5f5;
          box-shadow: 0 20px 32px -25px rgba(29, 78, 216, 0.55);
        }

        .sidebar__link-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(37, 99, 235, 0.12);
          color: #2563eb;
          flex-shrink: 0;
        }

        .sidebar__link::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.12) 0%,
            rgba(147, 197, 253, 0.05) 60%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
        }

        .sidebar__link:hover::after {
          opacity: 1;
        }

        .sidebar__link-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          width: 100%;
        }

        .sidebar__link-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }

        .sidebar__link-subtitle {
          font-size: 0.7rem;
          color: #64748b;
        }

        .sidebar__chevron-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          flex-shrink: 0;
        }

        .sidebar__chevron {
          color: currentColor;
        }

        .main-area {
          display: flex;
          flex-direction: column;
        }

        @media screen and (max-width: 1215px) {
          .admin-dashboard {
            grid-template-columns: 280px 1fr;
          }
        }

        @media screen and (max-width: 1023px) {
          .admin-dashboard {
            grid-template-columns: 1fr;
          }

          .sidebar {
            padding: 1.75rem;
          }

          .sidebar__stats {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }

          .sidebar__link {
            padding: 0.85rem 0.9rem;
          }

          .list-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .list-meta {
            align-items: flex-start;
          }
        }

        @media screen and (max-width: 768px) {
          .sidebar {
            gap: 1.4rem;
          }

          .sidebar__stats {
            grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
            gap: 0.6rem;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;
