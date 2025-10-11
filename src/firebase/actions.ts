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

    // Total de documentos
    const countSnapshot = await getDocs(colRef);
    const totalCount = countSnapshot.size;

    // Construir query base
    let q = query(colRef, orderBy("createdAt"), limit(limitCount));

    // Si no es la primera página, buscamos el último doc de la página anterior
    if (page > 1) {
      const prevQuery = query(
        colRef,
        orderBy("titulo"),
        limit((page - 1) * limitCount)
      );
      const prevSnapshot = await getDocs(prevQuery);
      const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
      q = query(
        colRef,
        orderBy("titulo"),
        startAfter(lastVisible),
        limit(limitCount)
      );
    }

    // Ejecutar query paginada
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      data,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limitCount),
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
    console.log(id);
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
