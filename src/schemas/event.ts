import z from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  type: z.string().min(1, "El tipo de evento es requerido"),
  date: z.string().min(1, "La fecha de requerida"),
  time: z.string().optional(),
  duration: z.string().min(1, "La duración es requerida"),
  location: z.string().min(1, "El lugar es requerido"),
  responsible: z.string().min(1, "El responsable es requerido"),
  notes: z.string().optional(),
  link: z.string().url("Ingresa un enlace válido").optional(),
  ability: z
    .number()
    .int("Debe ser un número entero")
    .min(0, "Debe ser un número positivo")
    .optional(),
});
