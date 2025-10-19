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

export const writeData = async (collectionName: string, data: FieldValues) => {
  try {
    const docRef = await addDoc(collection(firestore, collectionName), data);
    const docId = docRef.id;
    const dataWithId = { ...data, id: docId };
    await updateDoc(docRef, dataWithId);
    return 200;
  } catch (_error) {
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
