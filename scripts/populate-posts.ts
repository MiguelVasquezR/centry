/**
 * Test script to add sample posts to Firebase database
 * Run this script to populate your Firebase database with sample posts
 */

import { writeData } from "../src/firebase/actions";
import { Post } from "../src/types/post";

const samplePosts: Omit<Post, "id">[] = [
  {
    title: "Mi experiencia leyendo Cien años de soledad",
    content:
      "<p>Este libro de García Márquez me transportó completamente al mundo mágico de Macondo. <strong>La prosa poética</strong> del autor y su capacidad para mezclar realidad y fantasía es simplemente <em>extraordinaria</em>.</p><p>Lo que más me impactó fue cómo el autor logra crear un universo tan complejo y detallado a través de la historia de una familia. Cada personaje tiene su propia personalidad y sus propias luchas.</p><p>Definitivamente recomiendo este libro a cualquiera que quiera experimentar el realismo mágico en su máxima expresión.</p>",
    authorId: "user-001",
    createdAt: new Date(),
    reactions: [],
    readings: [],
    imageUrl: [],
    preference: {
      visibleBy: "general",
      book: "book-001", // This should match an actual book ID from your books collection
    },
  },
  {
    title: "Reflexiones sobre Don Quijote",
    content:
      "<p>Terminé de leer esta obra maestra de Cervantes y no puedo evitar reflexionar sobre su mensaje atemporal.</p><p><strong>Don Quijote</strong> nos enseña que la <em>imaginación y los ideales</em> son fundamentales para la condición humana, incluso cuando chocan con la realidad.</p><p>La relación entre Don Quijote y Sancho Panza es fascinante: representa la eterna lucha entre el idealismo y el pragmatismo.</p>",
    authorId: "user-002",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    reactions: ["like", "love"],
    readings: ["user-001", "user-003"],
    imageUrl: [],
    preference: {
      visibleBy: "generation",
      book: "book-002",
    },
  },
  {
    title: "¿Por qué Rayuela cambió mi perspectiva literaria?",
    content:
      "<p>Cortázar logró algo que pocos autores consiguen: <strong>romper las reglas</strong> de la narrativa tradicional y aún así crear una obra coherente y profunda.</p><p>La estructura no lineal de Rayuela me obligó a ser un <em>lector activo</em>, a tomar decisiones sobre cómo leer el libro. Esto cambió completamente mi relación con la literatura.</p><p>Ahora busco libros que me desafíen, que me hagan pensar más allá de la historia superficial.</p>",
    authorId: "user-003",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    reactions: ["like", "thoughtful"],
    readings: ["user-001", "user-002"],
    imageUrl: [
      "https://res.cloudinary.com/dvt4vznxn/image/upload/v1758752392/descarga_15829f93a9a231_500h_l2rg9i.png",
    ],
    preference: {
      visibleBy: "general",
      book: "book-003",
    },
  },
];

export async function populatePostsDatabase() {
  console.log("📝 Starting to populate Firebase database with sample posts...");

  try {
    for (const post of samplePosts) {
      console.log(`📝 Adding post: ${post.title}`);
      const result = await writeData("posts", post);
      if (result === 200) {
        console.log(`✅ Successfully added: ${post.title}`);
      } else {
        console.log(`❌ Failed to add: ${post.title}`);
      }
    }
    console.log("🎉 Posts database population completed!");
  } catch (error) {
    console.error("❌ Error populating posts database:", error);
  }
}

// Uncomment the line below and run this script to populate your database
// populatePostsDatabase();
