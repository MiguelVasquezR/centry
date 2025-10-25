import z from "zod";

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export const categorySchema = z
  .object({
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
    color: z
      .string()
      .trim()
      .regex(HEX_COLOR_REGEX, "Selecciona un color válido")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasValidColor = data.color && HEX_COLOR_REGEX.test(data.color);

    if (data.type === "event" && !hasValidColor) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona un color para las categorías de eventos",
        path: ["color"],
      });
    }
  });
