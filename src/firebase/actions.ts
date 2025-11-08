import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";
import { firestore } from "./app";
import { FieldValues } from "react-hook-form";

const toMillis = (value: unknown): number => {
  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
    const fromISO = Date.parse(`${value}`);
    return Number.isNaN(fromISO) ? 0 : fromISO;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  ) {
    const timestamp = value as { seconds?: number; nanoseconds?: number };
    const seconds = timestamp.seconds ?? 0;
    const nanos = timestamp.nanoseconds ?? 0;
    return seconds * 1000 + Math.floor(nanos / 1_000_000);
  }

  return 0;
};

export const writeData = async (collectionName: string, data: FieldValues) => {
  try {
    const docRef = await addDoc(collection(firestore, collectionName), data);
    const docId = docRef.id;
    const dataWithId = { ...data, id: docId };
    await updateDoc(docRef, dataWithId);
    return 200;
  } catch (error) {
    console.error("Error al guardar datos:", error);
    return 400;
  }
};

export const getDataPagination = async (
  collectionName: string,
  page: number,
  limitCount: number
) => {
  try {
    const colRef = collection(firestore, collectionName);

    const pageSize =
      Number.isFinite(limitCount) && limitCount > 0 ? limitCount : 10;
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const orderField = collectionName === "libros" ? "titulo" : "title";

    // Total de documentos
    const countSnapshot = await getDocs(colRef);
    const totalCount = countSnapshot.size;
    const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);

    // Construir query base con límite
    let baseQuery = query(colRef, orderBy(orderField), limit(pageSize));

    // Si no es la primera página, buscamos el último doc de la página anterior
    if (currentPage > 1) {
      const offset = (currentPage - 1) * pageSize;
      const prevQuery = query(colRef, orderBy(orderField), limit(offset));
      const prevSnapshot = await getDocs(prevQuery);
      const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];

      if (lastVisible) {
        baseQuery = query(
          colRef,
          orderBy(orderField),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        return {
          data: [],
          totalCount,
          currentPage,
          totalPages,
          status: 200,
        };
      }
    }

    // Ejecutar query paginada
    const querySnapshot = await getDocs(baseQuery);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      data,
      totalCount,
      currentPage,
      totalPages,
      status: 200,
    };
  } catch (err) {
    return { message: `We had an error: ${err}`, status: 500 };
  }
};

export const deleteData = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(firestore, collectionName, id));
    return 200;
  } catch (error) {
    console.error("Error al eliminar datos:", error);
    return 400;
  }
};

export const updateData = async (
  collectionName: string,
  id: string,
  data: FieldValues
) => {
  try {
    await updateDoc(doc(firestore, collectionName, id), data);
    return 200;
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    return 400;
  }
};

export const getDataById = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("El documento no existe");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento por ID:", error);
  }
};

export const getDataByEmail = async (collectionName: string, email: string) => {
  try {
    const colRef = collection(firestore, collectionName);
    const q = query(colRef, where("email", "==", email), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error("No se encontró usuario con ese email");
      return null;
    }

    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error al obtener el documento por email:", error);
    return null;
  }
};

export const getData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw error;
  }
};

export const getPostsByBook = async (bookId: string) => {
  try {
    if (!bookId) {
      return [];
    }

    const postsRef = collection(firestore, "posts");
    const postsQuery = query(postsRef, where("preference.book", "==", bookId));
    const snapshot = await getDocs(postsQuery);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error al obtener posts por libro:", error);
    return [];
  }
};

export const getLoansByBookId = async (bookId: string) => {
  try {
    if (!bookId) {
      return [];
    }

    const loansRef = collection(firestore, "prestamos");
    const loansQuery = query(loansRef, where("bookId", "==", bookId));
    const snapshot = await getDocs(loansQuery);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error al obtener préstamos por libro:", error);
    return [];
  }
};

export const getCommentsByPostId = async (postId: string) => {
  try {
    if (!postId) {
      return [];
    }

    const commentsRef = collection(firestore, "comments");
    const commentsQuery = query(commentsRef, where("postId", "==", postId));
    const snapshot = await getDocs(commentsQuery);

    const comments = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    return comments.sort(
      (a, b) => toMillis(a.createdAt) - toMillis(b.createdAt)
    );
  } catch (error) {
    console.error("Error al obtener comentarios por post:", error);
    return [];
  }
};
