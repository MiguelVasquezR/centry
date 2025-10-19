"use client";

import { useGetCategoriesQuery } from "@/src/redux/store/api/category";
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
import CategoryCard from "@/src/component/CategoryCard";

const AdminDashboard = () => {
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategoriesQuery(undefined);

  if (isLoadingCategories) {
    return <div>Cargando</div>;
  }

  return (
    <div className="container">
      <br />
      <div>
        <div>
          <p className="is-size-5 has-text-weight-bold">Panel administración</p>
          <p className="is-size-6">
            Aquí podrás tener accesos directos e información confidencial.
            Manten protegida tu cuenta
          </p>
        </div>
      </div>
      <br />

      <div className="buttons has-addons">
        <Link className="button" href={"/book/add"}>
          <Book />
          Agregar Libro
        </Link>
        <Link className="button" href={""}>
          Agregar Película
        </Link>
        <Link className="button" href={"/categories/new"}>
          Agregar Categoría
        </Link>
        <Link className="button" href={""}>
          Agregar Prestamo
        </Link>
        <Link className="button" href={"/users/add"}>
          Agregar Usuario
        </Link>
        <Link className="button" href={""}>
          Agregar
        </Link>
      </div>

      <div className="columns">
        <div className="column is-5">
          <div className="box">
            <div>
              <p className="is-size-5 has-text-weight-bold">Categorias</p>
              <p className="is-size-6">
                Las categorias pueden estar destinadas para eventos,
                publicaciones o películas!
              </p>
            </div>
            <br />
            <div>
              {categoriesData?.map((c: Category) => {
                return <CategoryCard key={c.id} category={c} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
