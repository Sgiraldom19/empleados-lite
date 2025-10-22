import { z } from "zod";
export const EmployeeCreateSchema = z.object({
nombre: z.string().min(3).max(80),
cargo: z.string().min(2).max(60),
salario: z.number().min(0),
estado: z.enum(["activo","inactivo"]),
fechaIngreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const EmployeeUpdateSchema = EmployeeCreateSchema.partial();
export type EmployeeCreate = z.infer<typeof EmployeeCreateSchema>;
export type EmployeeUpdate = z.infer<typeof EmployeeUpdateSchema>;
export type Employee = EmployeeCreate & { id: string };
