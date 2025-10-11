"use client";

import { LogIn, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/firebase/contexts/AuthContext";
import { signOutUser } from "@/src/firebase/auth";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useState } from "react";

const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [userMenuActive, setUserMenuActive] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      const { error } = await signOutUser();
      if (error) {
        toast.error("Error al cerrar sesión");
      } else {
        toast.success("Sesión cerrada exitosamente");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <nav className="navbar is-primary is-fixed-top p-2">
      <div className="navbar-brand" onClick={() => router.push("/")}>
        <Image
          src={
            "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758752392/descarga_15829f93a9a231_500h_l2rg9i.png"
          }
          alt="logo"
          className="image is-64x64"
          width={64}
          height={64}
          style={{ borderRadius: 12 }}
        />
        <p className="navbar-item has-text-white is-size-5 has-text-weight-bold">
          Documental
        </p>
      </div>

      {isAuthenticated && (
        <ul className="navbar-menu">
          <li
            onClick={() => router.push("/updates")}
            className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold"
          >
            Publicaciones
          </li>
          <li
            onClick={() => router.push("/users")}
            className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold"
          >
            Usuarios
          </li>
          <li
            onClick={() => router.push("/book")}
            className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold"
          >
            Biblioteca
          </li>
          <li className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold">
            Películas
            <Link href={"#"} />
          </li>
        </ul>
      )}

      <div className="navbar-end">
        <div className="navbar-item">
          {isAuthenticated && (
            <input type="text" className="input" placeholder="Buscar" />
          )}

          {isAuthenticated ? (
            <div
              onClick={() => {
                setUserMenuActive(!userMenuActive);
              }}
              className="is-flex is-justify-content-center is-align-items-center is-gap-2 is-clickable mr-5"
            >
              <div
                className={clsx("dropdown", { "is-active": userMenuActive })}
              >
                <div className="dropdown-trigger">
                  <div className="is-flex is-justify-content-center is-align-items-center is-gap-1">
                    <User color="white" size={20} />
                    <p className="has-text-white" style={{ fontSize: 12 }}>
                      {user?.displayName || user?.email}
                    </p>
                  </div>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <Link className="dropdown-item" href={"#"}>
                      Administración
                    </Link>
                    <Link className="dropdown-item" href={"#"}>
                      Calendario
                    </Link>
                    <Link className="dropdown-item" href={"#"}>
                      Mi perfil
                    </Link>
                    <hr className="dropdown-divider" />

                    <Link
                      className=" dropdown-item
                      is-flex is-justify-content-center is-align-items-center is-gap-2 is-clickable"
                      type="button"
                      onClick={handleLogout}
                      href={"/login"}
                    >
                      <LogOut color="black" size={20} />
                      <p>Cerrar Sesión</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => router.push("/login")}
              className="is-flex is-justify-content-center is-align-items-center is-gap-2 is-clickable"
            >
              <LogIn color="white" size={20} />
              <p className="has-text-white" style={{ fontSize: 10 }}>
                Iniciar Sesión
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const HeaderRender = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div style={{ paddingTop: "80px" }}>{children}</div>
    </>
  );
};

export default HeaderRender;
