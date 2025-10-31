export type Emp = {
  id: string;
  nombre: string;
  cargo: string;
  salario: number;
  estado: "activo" | "inactivo";
  fechaIngreso: string;
};