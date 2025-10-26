"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Book, CalendarClock } from "lucide-react";
import CategoryCard from "@/src/component/CategoryCard";
import LoanCard from "@/src/component/LoanCard";
import Loader from "@/src/component/Loader";
import { useGetCategoriesQuery } from "@/src/redux/store/api/category";
import { useGetLoansQuery } from "@/src/redux/store/api/loanApi";
import type { Category } from "@/src/types/category";
import type { Loan } from "@/src/types/loan";

const AdminDashboard = () => {
  const { data: categoriesData = [], isLoading: isLoadingCategories, isFetching: isFetchingCategories } =
    useGetCategoriesQuery(undefined);
  const { data: loansData = [], isLoading: isLoadingLoans, isFetching: isFetchingLoans } = useGetLoansQuery();

  const loans = useMemo(() => loansData as Loan[], [loansData]);

  const isLoading =
    isLoadingCategories || isLoadingLoans || isFetchingCategories || isFetchingLoans;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <div className="card mb-5" style={{ border: "none", borderRadius: "18px" }}>
        <div className="card-content">
          <div className="is-flex is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
            <div>
              <p className="title is-4 mb-1">Panel de administración</p>
              <p className="subtitle is-6 has-text-grey">
                Gestiona libros, categorías, usuarios y préstamos desde un solo lugar.
              </p>
            </div>
            <div className="buttons is-right">
              <Link className="button is-primary is-light" href={"/book/add"}>
                <Book size={16} className="mr-2" />
                Libro
              </Link>
              <Link className="button is-primary is-light" href={"/categories/new"}>
                Categoría
              </Link>
              <Link className="button is-primary is-light" href={"/users/add"}>
                Usuario
              </Link>
              <Link className="button is-primary has-text-white" href={"/loans/create"}>
                <CalendarClock size={16} className="mr-2" />
                Registrar préstamo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="columns is-variable is-5">
        <div className="column is-6">
          <div className="card" style={{ borderRadius: "18px", border: "none" }}>
            <div className="card-content">
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                <div>
                  <p className="title is-5 mb-1">Categorías activas</p>
                  <p className="is-size-7 has-text-grey">
                    Clasificaciones disponibles para eventos, publicaciones y películas.
                  </p>
                </div>
                <span className="tag is-info is-light">{categoriesData.length}</span>
              </div>

              {categoriesData.length ? (
                <div className="columns is-multiline is-variable is-2">
                  {categoriesData.map((category: Category) => (
                    <div className="column is-6" key={category.id}>
                      <div
                        className="box"
                        style={{
                          border: "none",
                          borderRadius: "16px",
                          background: "linear-gradient(135deg, rgba(63,86,173,0.08) 0%, rgba(118,75,162,0.08) 100%)",
                        }}
                      >
                        <CategoryCard category={category} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="notification is-light">
                  Aún no hay categorías registradas.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="column is-6">
          <div className="card" style={{ borderRadius: "18px", border: "none" }}>
            <div className="card-content">
              <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                <div>
                  <p className="title is-5 mb-1">Préstamos recientes</p>
                  <p className="is-size-7 has-text-grey">
                    Monitorea entregas pendientes y envía recordatorios en un clic.
                  </p>
                </div>
                <span className="tag is-warning is-light">{loans.length}</span>
              </div>

              <div className="is-flex is-flex-direction-column is-gap-3">
                {loans.length ? (
                  loans.map((loan) => <LoanCard key={loan.id} loan={loan} />)
                ) : (
                  <div className="notification is-light">
                    No hay préstamos registrados por el momento.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
