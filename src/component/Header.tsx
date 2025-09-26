"use client";

import { LogIn, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { signOutUser } from "@/src/firebase/auth";
import toast from "react-hot-toast";

const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

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
            onClick={() => router.push("/book")}
            className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold"
          >
            Biblioteca
          </li>
          <li className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold">
            Películas
            <Link href={"#"} />
          </li>
          <li className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold">
            Usuarios
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
            <div className="is-flex is-justify-content-center is-align-items-center is-gap-2">
              <div className="is-flex is-justify-content-center is-align-items-center is-gap-1">
                <User color="white" size={20} />
                <p className="has-text-white" style={{ fontSize: 12 }}>
                  {user?.displayName || user?.email}
                </p>
              </div>
              <div
                onClick={handleLogout}
                className="is-flex is-justify-content-center is-align-items-center is-gap-2 is-clickable"
              >
                <LogOut color="white" size={20} />
                <p className="has-text-white" style={{ fontSize: 10 }}>
                  Cerrar Sesión
                </p>
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
