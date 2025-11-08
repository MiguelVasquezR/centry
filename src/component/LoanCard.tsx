import { DateTime } from "luxon";
import { Check, Mail, X } from "lucide-react";
import { Loan } from "@/src/types/loan";
import Link from "next/link";

const getStatusLabel = (loan: Loan) => {
  if (loan.status === "requested") {
    return "Solicitud pendiente";
  }

  if (loan.status === "returned") {
    return "Devuelto";
  }

  const start = DateTime.fromISO(loan.startDate ?? "");
  const due = DateTime.fromISO(loan.dueDate ?? "");
  if (!start.isValid || !due.isValid) {
    return "Sin datos";
  }
  return due < DateTime.now() ? "Retrasado" : "En curso";
};

interface LoanCardProps {
  loan: Loan;
  onApprove?: (loan: Loan) => void;
  onReject?: (loan: Loan) => void;
  isProcessing?: boolean;
  processingAction?: "approve" | "reject" | null;
}

const statusTagClass: Record<Loan["status"], string> = {
  requested: "is-warning",
  active: "is-info",
  returned: "is-success",
  rejected: "is-danger",
};

const LoanCard = ({
  loan,
  onApprove,
  onReject,
  isProcessing = false,
  processingAction = null,
}: LoanCardProps) => {
  const startDate = DateTime.fromISO(loan.startDate ?? "");
  const dueDate = DateTime.fromISO(loan.dueDate ?? "");
  const isOverdue =
    loan.status === "active" && dueDate.isValid && dueDate < DateTime.now();
  const showActions = loan.status === "requested" && (onApprove || onReject);

  return (
    <div className="box" style={{ borderRadius: "16px", border: "none" }}>
      <div className="is-flex is-justify-content-space-between is-align-items-start">
        <div>
          <p className="is-size-5 has-text-weight-semibold">{loan.bookTitle ?? "Libro"}</p>
          <p className="is-size-6 has-text-grey">
            {loan.userName ?? "Usuario"} • {getStatusLabel(loan)}
          </p>
        </div>
        <div className="is-flex is-align-items-center is-gap-2">
          <span className={`tag ${statusTagClass[loan.status]} is-light`}>
            {loan.status}
          </span>
          {isOverdue && (
            <button className="button is-small is-danger is-light">
              <Mail size={16} className="mr-2" /> Recordar devolución
            </button>
          )}
        </div>
      </div>

      <div className="columns is-variable is-2 mt-3">
        <div className="column is-4">
          <p className="has-text-grey is-size-7">Inicio</p>
          <p className="is-size-6">
            {startDate.isValid ? startDate.toFormat("dd MMM yyyy") : "—"}
          </p>
        </div>
        <div className="column is-4">
          <p className="has-text-grey is-size-7">Entrega</p>
          <p className="is-size-6">
            {dueDate.isValid ? dueDate.toFormat("dd MMM yyyy") : "—"}
          </p>
        </div>
        <div className="column is-4">
          <p className="has-text-grey is-size-7">Notas</p>
          <p className="is-size-6 has-text-grey-dark">
            {loan.notes?.length ? loan.notes : "Sin observaciones"}
          </p>
        </div>
      </div>

      {showActions && (
        <div className="is-flex is-justify-content-flex-end is-gap-2 mt-3">
          {onReject && (
            <button
              type="button"
              className={`button is-light is-danger ${
                isProcessing && processingAction === "reject" ? "is-loading" : ""
              }`}
              onClick={() => onReject(loan)}
              disabled={isProcessing}
            >
              <X size={16} className="mr-1" />
              Rechazar
            </button>
          )}
          {onApprove && (
            <button
              type="button"
              className={`button is-primary is-light has-text-weight-semibold ${
                isProcessing && processingAction === "approve" ? "is-loading" : ""
              }`}
              onClick={() => onApprove(loan)}
              disabled={isProcessing}
            >
              <Check size={16} className="mr-1" />
              Aprobar
            </button>
          )}
        </div>
      )}

      {loan.bookId && (
        <Link href={`/book/${loan.bookId}`} className="button is-small is-text">
          Ver libro
        </Link>
      )}
    </div>
  );
};

export default LoanCard;
