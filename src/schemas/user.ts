import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  topics: z.string().min(1, "Ingresa al menos un tema de interés"),
  biography: z.string().min(1, "La biografía es requerida"),
  tuition: z.string().min(1, "La matrícula es requerida"),
  imageUrl: z.string().min(1, "La fotografía es obligatoria"),
});
