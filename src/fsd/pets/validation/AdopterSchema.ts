import { z } from "zod";

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
const currentYear = new Date().getFullYear();

export const AdopterSchema = z.object({
  fullName: z.string().trim().min(3, "שם קצר מדי"),
  email: z.string().trim().email("אימייל לא תקין"),
  address: z.string().trim().min(5, "כתובת לא תקינה"),
  phone: z.string().trim().regex(phoneRegex, "מספר לא תקין"),
  birthYear: z
    .number()
    .int()
    .min(1900, "שנת לידה לא תקינה")
    .max(currentYear, "שנת לידה לא תקינה")
    .optional(),
});

export const AdoptionFormSchema = AdopterSchema.extend({
  petId: z.string().min(1, "חובה לבחור חיה"),
});

export const adoptionSchema = AdoptionFormSchema;

export type AdopterFormData = z.infer<typeof AdopterSchema>;
export type AdoptionFormData = z.infer<typeof AdoptionFormSchema>;
