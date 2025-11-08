"use client";

import { LogIn, LogOut, Search as SearchIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/firebase/contexts/AuthContext";
import { signOutUser } from "@/src/firebase/auth";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteCookie } from "cookies-next";
import { getCookie, setCookie } from "cookies-next/client";
import {
  useGetCurrentUserQuery,
  useGetUserByEmailQuery,
} from "../redux/store/api/usersApi";
import { useLazySearchEntitiesQuery } from "../redux/store/api/searchApi";

const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [userMenuActive, setUserMenuActive] = useState<boolean>(false);

  const userId = localStorage.getItem("userId") || "";

  const { data: currentUser } = useGetCurrentUserQuery(undefined);
  const { rol = "student" } = currentUser || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [
    triggerSearch,
    { data: searchData, isFetching: isSearching },
  ] = useLazySearchEntitiesQuery();

  const trimmedSearchTerm = searchTerm.trim();
  const hasMinChars = trimmedSearchTerm.length >= 2;

  useEffect(() => {
    if (!hasMinChars) {
      return;
    }

    const handle = setTimeout(() => {
      triggerSearch(trimmedSearchTerm);
    }, 350);

    return () => clearTimeout(handle);
  }, [hasMinChars, trimmedSearchTerm, triggerSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedResults = useMemo(() => {
    if (!hasMinChars || !searchData) {
      return { books: [], users: [], movies: [] };
    }
    return searchData;
  }, [hasMinChars, searchData]);

  const totalResults =
    normalizedResults.books.length +
    normalizedResults.users.length +
    normalizedResults.movies.length;

  const shouldShowPanel =
    isAuthenticated && (isSearchFocused || trimmedSearchTerm.length > 0);

  const bookItems = normalizedResults.books.map((book) => ({
    id: book.id ?? book.titulo,
    title: book.titulo,
    subtitle: book.author || book.autor || "Libro",
    href: `/book/${book.id}`,
  }));

  const userItems = normalizedResults.users.map((person) => ({
    id: person.id ?? person.email,
    title: person.name,
    subtitle: person.email,
    href: `/users/${person.id}`,
  }));

  const movieItems = normalizedResults.movies.map((movie) => ({
    id: movie.id ?? movie.titulo,
    title: movie.titulo,
    subtitle: movie.director,
    href: `/movies/${movie.id}`,
  }));

  const hasAnyResults = totalResults > 0;
  const notEnoughCharacters = trimmedSearchTerm.length > 0 && !hasMinChars;
  const showNoResultsState = hasMinChars && !isSearching && !hasAnyResults;

  const renderResultsSection = (
    label: string,
    items: { id: string; title: string; subtitle?: string; href: string }[]
  ) => (
    <div className="mb-4" key={label}>
      <p className="is-size-7 has-text-grey has-text-weight-semibold is-uppercase mb-2">
        {label}
      </p>
      {items.length === 0 ? (
        <p className="is-size-7 has-text-grey-light">Sin coincidencias</p>
      ) : (
        <ul className="is-flex is-flex-direction-column is-gap-2">
          {items.map((item) => (
            <li key={`${label}-${item.id}`}>
              <button
                type="button"
                className="button is-white is-fullwidth has-text-left is-flex is-flex-direction-column is-align-items-flex-start"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e8e8e8",
                  boxShadow: "none",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  textAlign: "left",
                }}
                onClick={() => handleResultNavigation(item.href)}
              >
                <span className="has-text-weight-semibold">{item.title}</span>
                {item.subtitle && (
                  <span className="is-size-7 has-text-grey">{item.subtitle}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const handleResultNavigation = (path: string) => {
    router.push(path);
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOutUser();
      if (error) {
        toast.error("Error al cerrar sesión");
      } else {
        deleteCookie("userEmail", { path: "/" });
        toast.success("Sesión cerrada exitosamente");
        router.push("/login");
      }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
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
          <li
            onClick={() => router.push("/movies")}
            className="navbar-item is-clickable has-text-white is-underlined has-text-weight-bold"
          >
            Películas
          </li>
      </ul>
      )}

      <div className="navbar-end">
        <div className="navbar-item">
          {isAuthenticated && (
            <div
              ref={searchContainerRef}
              className="is-relative"
              style={{ width: "320px", maxWidth: "100%" }}
            >
              <div className="control has-icons-left">
                <input
                  type="text"
                  className="input"
                  placeholder="Buscar libros, usuarios o películas"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setSearchTerm("");
                      setIsSearchFocused(false);
                    }
                  }}
                  autoComplete="off"
                />
                <span className="icon is-left">
                  <SearchIcon size={18} />
                </span>
              </div>
              {shouldShowPanel && (
                <div
                  className="box"
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    width: "100%",
                    minWidth: "260px",
                    maxWidth: "420px",
                    maxHeight: "420px",
                    overflowY: "auto",
                    borderRadius: "16px",
                    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
                    zIndex: 40,
                  }}
                >
                  {notEnoughCharacters ? (
                    <p className="is-size-7 has-text-grey mb-0">
                      Escribe al menos 2 caracteres para buscar.
                    </p>
                  ) : isSearching ? (
                    <p className="is-size-7 has-text-grey mb-0">
                      Buscando resultados…
                    </p>
                  ) : (
                    <>
                      {showNoResultsState && (
                        <p className="is-size-7 has-text-grey mb-4">
                          No encontramos coincidencias para “{trimmedSearchTerm}”.
                        </p>
                      )}
                      {renderResultsSection("Libros", bookItems)}
                      {renderResultsSection("Usuarios", userItems)}
                      {renderResultsSection("Películas", movieItems)}
                    </>
                  )}
                </div>
              )}
            </div>
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
                    <Link
                      className={clsx("dropdown-item", {
                        "is-hidden": rol !== "admin",
                      })}
                      href={"/admin"}
                    >
                      Administración
                    </Link>
                    <Link className="dropdown-item" href={"/events"}>
                      Calendario
                    </Link>
                    <Link className="dropdown-item" href={`users/${userId}`}>
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
  const [hasMounted, setHasMounted] = useState(false);
  const [userId, setUserId] = useState("");
  const cookie = getCookie("userEmail");

  useEffect(() => {
    setHasMounted(true);

    if (typeof window === "undefined") {
      return;
    }

    const storedUserId = window.localStorage.getItem("userId") ?? "";
    setUserId(storedUserId);
  }, []);

  const shouldSkipQuery = !hasMounted || !cookie || Boolean(userId);
  const { data: currentUser, isLoading: isLoading } = useGetUserByEmailQuery(
    cookie ?? "",
    {
      skip: shouldSkipQuery,
    }
  );

  useEffect(() => {
    if (!hasMounted || typeof window === "undefined") {
      return;
    }

    if (currentUser?.id && currentUser.id !== userId) {
      window.localStorage.setItem("userId", currentUser.id);
      setUserId(currentUser.id);
      setCookie("userEmail", "");
    }
  }, [currentUser, hasMounted, userId]);

  if (!hasMounted) {
    return <div>Cargando</div>;
  }

  if (isLoading) {
    return <div>Cargando</div>;
  }

  return (
    <>
      <Header />
      <div style={{ paddingTop: "80px" }}>{children}</div>
    </>
  );
};

export default HeaderRender;
