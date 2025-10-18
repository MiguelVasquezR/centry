"use client";

import {
  ClipboardList,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Film,
  Book,
  PlusCircle,
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

const eventStatuses = [
  {
    title: "Proyección: Voces del campo",
    date: "20 oct · 19:00",
    owner: "Laura Méndez",
    status: "Confirmado",
  },
  {
    title: "Club de lectura: Letras del mar",
    date: "22 oct · 17:30",
    owner: "Carlos Andrade",
    status: "En revisión",
  },
  {
    title: "Taller de archivo oral",
    date: "24 oct · 16:00",
    owner: "Equipo Documental",
    status: "Logística pendiente",
  },
  {
    title: "Ciclo de cine andino",
    date: "27 oct · 18:00",
    owner: "Producción",
    status: "Borrador",
  },
];

const quickActions = [
  {
    title: "Nuevo evento",
    description: "Publica una proyección, taller o club de lectura",
    href: "/events/create",
    icon: PlusCircle,
  },
  {
    title: "Nuevo préstamo",
    description: "Registra la entrega o devolución de equipo y libros",
    href: "/loans/create",
    icon: ClipboardList,
  },
  {
    title: "Agregar libro",
    description: "Integra nuevos títulos al catálogo de la biblioteca",
    href: "/books/add",
    icon: Book,
  },
  {
    title: "Agregar película",
    description: "Actualiza el catálogo audiovisual y sus fichas",
    href: "/library/movies/new",
    icon: Film,
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

const statusIcon = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("confirmado") || normalized.includes("curso")) {
    return CheckCircle2;
  }
  return AlertCircle;
};

const statusIconClass = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("confirmado") || normalized.includes("curso")) {
    return "status-icon status-icon--success";
  }
  if (normalized.includes("retrasado")) {
    return "status-icon status-icon--danger";
  }
  if (normalized.includes("pendiente")) {
    return "status-icon status-icon--warning";
  }
  return "status-icon status-icon--info";
};

const AdminDashboard = () => {
  return (
    <section className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container">
        <header className="mb-5">
          <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap gap-3">
            <div>
              <p className="title is-3 mb-2">Panel administrativo</p>
              <p className="subtitle is-6 has-text-grey-dark mb-0">
                Gestiona préstamos, agenda y catálogo con una visión clara de lo
                urgente.
              </p>
            </div>
            <div className="quick-actions-inline">
              {quickActions.map(({ title, href, icon: Icon }) => (
                <Link key={title} href={href} className="button quick-chip">
                  <span className="quick-chip__icon">
                    <Icon size={16} />
                  </span>
                  <span>{title}</span>
                </Link>
              ))}
            </div>
          </div>
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
                {activeLoans.map((loan) => (
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
                    </div>
                  </div>
                ))}
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
                  <p className="title is-5 mb-1">Estado de eventos</p>
                  <p className="subtitle is-7 has-text-grey">
                    Qué falta para cada actividad de la agenda.
                  </p>
                </div>
              </div>
              <div className="list-card__body">
                {eventStatuses.map((event) => {
                  const StatusIcon = statusIcon(event.status);
                  return (
                    <div key={event.title} className="list-item">
                      <div>
                        <p className="list-primary">{event.title}</p>
                        <p className="list-secondary">
                          {event.date} · {event.owner}
                        </p>
                      </div>
                      <div className="list-meta list-meta--status">
                        <StatusIcon
                          size={16}
                          className={statusIconClass(event.status)}
                        />
                        <span className={statusClass(event.status)}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
          gap: 0.35rem;
        }

        .list-meta--status {
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;
        }

        .status-icon {
          color: #f59e0b;
        }

        .status-icon--success {
          color: #16a34a;
        }

        .status-icon--danger {
          color: #dc2626;
        }

        .status-icon--warning {
          color: #f59e0b;
        }

        .status-icon--info {
          color: #2563eb;
        }

        .quick-actions-inline {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .quick-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 999px;
          padding: 0.6rem 1rem;
          border: none;
          background: #1d4ed8;
          color: #ffffff;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .quick-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -20px rgba(37, 99, 235, 0.9);
        }

        .quick-chip__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
        }

        @media screen and (max-width: 1023px) {
          .list-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .list-meta,
          .list-meta--status {
            align-items: flex-start;
          }

          .quick-actions-inline {
            width: 100%;
            margin-top: 1rem;
          }

          .quick-chip {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;
