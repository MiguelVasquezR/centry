import { DateTime } from "luxon";
import { Mail } from "lucide-react";
import { Loan } from "@/src/types/loan";
import Link from "next/link";

const getStatusLabel = (loan: Loan) => {
  const start = DateTime.fromISO(loan.startDate ?? "");
  const due = DateTime.fromISO(loan.dueDate ?? "");
  if (!start.isValid || !due.isValid) {
    return "Sin datos";
  }
  return due < DateTime.now() ? "Retrasado" : "En curso";
};

interface LoanCardProps {
  loan: Loan;
}

const LoanCard = ({ loan }: LoanCardProps) => {
  const startDate = DateTime.fromISO(loan.startDate ?? "");
  const dueDate = DateTime.fromISO(loan.dueDate ?? "");
  const isOverdue = dueDate.isValid && dueDate < DateTime.now();

  return (
    <div className="box" style={{ borderRadius: "16px", border: "none" }}>
      <div className="is-flex is-justify-content-space-between is-align-items-start">
        <div>
          <p className="is-size-5 has-text-weight-semibold">{loan.bookTitle ?? "Libro"}</p>
          <p className="is-size-6 has-text-grey">
            {loan.userName ?? "Usuario"} • {getStatusLabel(loan)}
          </p>
        </div>
        {isOverdue && (
          <button className="button is-small is-danger is-light">
            <Mail size={16} className="mr-2" /> Recordar devolución
          </button>
        )}
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

      {loan.bookId && (
        <Link href={`/book/${loan.bookId}`} className="button is-small is-text">
          Ver libro
        </Link>
      )}
    </div>
  );
};

export default LoanCard;
