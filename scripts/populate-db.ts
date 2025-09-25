/**
 * Test script to verify Firebase connection and add sample data
 * Run this script to populate your Firebase database with sample books
 */

import { writeData } from "../src/firebase/actions";
import { Book } from "../src/types/book";

const sampleBooks: Omit<Book, "id">[] = [
  {
    titulo: "Cien años de soledad",
    author: "Gabriel García Márquez",
    descripcion:
      "Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de varias generaciones en el pueblo ficticio de Macondo.",
    editorial: "Editorial Sudamericana",
    anioPublicacion: "1967",
    numPag: "471",
    tipo: "Novela",
    image:
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758752392/descarga_15829f93a9a231_500h_l2rg9i.png",
    ubicacion: {
      repisa: "central",
      col: 1,
      row: 1,
    },
  },
  {
    titulo: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    descripcion:
      "La primera novela moderna y una de las obras más importantes de la literatura universal, que narra las aventuras del ingenioso hidalgo Don Quijote.",
    editorial: "Francisco de Robles",
    anioPublicacion: "1605",
    numPag: "863",
    tipo: "Novela Clásica",
    image:
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758752392/descarga_15829f93a9a231_500h_l2rg9i.png",
    ubicacion: {
      repisa: "lateral",
      col: 2,
      row: 1,
    },
  },
  {
    titulo: "Rayuela",
    author: "Julio Cortázar",
    descripcion:
      "Una novela experimental que puede leerse de múltiples formas, explorando la búsqueda existencial del protagonista Horacio Oliveira.",
    editorial: "Editorial Sudamericana",
    anioPublicacion: "1963",
    numPag: "600",
    tipo: "Novela Experimental",
    image:
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758752392/descarga_15829f93a9a231_500h_l2rg9i.png",
    ubicacion: {
      repisa: "central",
      col: 3,
      row: 2,
    },
  },
];

export async function populateDatabase() {
  console.log("🔥 Starting to populate Firebase database with sample books...");

  try {
    for (const book of sampleBooks) {
      console.log(`📚 Adding book: ${book.titulo}`);
      const result = await writeData("books", book);
      if (result === 200) {
        console.log(`✅ Successfully added: ${book.titulo}`);
      } else {
        console.log(`❌ Failed to add: ${book.titulo}`);
      }
    }
    console.log("🎉 Database population completed!");
  } catch (error) {
    console.error("❌ Error populating database:", error);
  }
}

// Uncomment the line below and run this script to populate your database
// populateDatabase();
