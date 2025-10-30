import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Employee, EmployeeCreate, EmployeeUpdate } from "./validation";

const DB_PATH = path.join(process.cwd(), "app", "_data", "employees.json");

async function readAll(): Promise<Employee[]> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

async function writeAll(items: Employee[]) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), "utf-8");
}

/**
 * list: ahora acepta sort y dir.
 *
 * Reglas de ordenamiento:
 * - nombre: asc => orden alfabético A->Z; desc => no aplicar orden (se devuelve "orden natural")
 * - cargo:  asc => orden alfabético A->Z; desc => no aplicar orden (orden natural)
 * - salario: asc => menor->mayor; desc => mayor->menor
 * - fechaIngreso: asc => antigua->reciente; desc => reciente->antigua
 */
export async function list(params: {
  q?: string;
  cargo?: string;
  estado?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  dir?: "asc" | "desc";
}) {
  const { q, cargo, estado, page = 1, pageSize = 10, sort, dir = "asc" } = params;

  let data = await readAll();

  // aqui filtros
  if (q) data = data.filter((e) => e.nombre.toLowerCase().includes(q.toLowerCase()));
  if (cargo) data = data.filter((e) => e.cargo === cargo);
  if (estado) data = data.filter((e) => e.estado === estado);

  // aqui el orden
  if (sort) {
    const allowed = ["nombre", "cargo", "salario", "fechaIngreso"];
    if (allowed.includes(sort)) {
     // Aplicar orden de ascendente o descendente
data = data.slice(); // aqui se crea una copia del contenido de data, pero ya ordenada
data.sort((a: any, b: any) => {
  const va = a[sort as keyof Employee];
  const vb = b[sort as keyof Employee];

  // Aqui van los datos null 
  if (va === undefined || va === null) return 1;
  if (vb === undefined || vb === null) return -1;

  // lo del salario
  if (sort === "salario") {
    const na = Number(va);
    const nb = Number(vb);
    return dir === "asc" ? na - nb : nb - na;
  }

  // aqui todo lo de la fecha de ingreso
  if (sort === "fechaIngreso") {
    const sa = String(va);
    const sb = String(vb);
    return dir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
  }

  //orden de nombre y cargo de A a Z o al contrario
  const sa = String(va).toLowerCase();
  const sb = String(vb).toLowerCase();
  return dir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
});

    }
  }

  const total = data.length;
  const start = (page - 1) * pageSize;
  return { items: data.slice(start, start + pageSize), total, page, pageSize };
}

export async function get(id: string) {
  return (await readAll()).find((e) => e.id === id) ?? null;
}

export async function create(input: EmployeeCreate) {
  const nuevo: Employee = { id: randomUUID(), ...input };
  const all = await readAll();
  all.unshift(nuevo); // mantengo comportamiento original (inserción al inicio)
  await writeAll(all);
  return nuevo;
}

export async function update(id: string, patch: EmployeeUpdate) {
  const all = await readAll();
  const i = all.findIndex((e) => e.id === id);
  if (i < 0) return null;
  all[i] = { ...all[i], ...patch };
  await writeAll(all);
  return all[i];
}

export async function remove(id: string) {
  const all = await readAll();
  const next = all.filter((e) => e.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}