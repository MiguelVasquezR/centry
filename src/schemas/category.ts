import z from "zod";

export const categorySchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "Máximo 100 caracteres"),
  type: z.enum(["event", "movie", "book"], {
    message: "Selecciona un tipo de categoría válido",
  }),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(600, "Máximo 600 caracteres"),
});
