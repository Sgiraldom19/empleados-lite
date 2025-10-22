import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Employee, EmployeeCreate, EmployeeUpdate } from "./validation";
const DB_PATH = path.join(process.cwd(), "app", "_data", "employees.json");
async function readAll(): Promise<Employee[]> {
try { return JSON.parse(await fs.readFile(DB_PATH, "utf-8")); }
catch { return []; }
}
async function writeAll(items: Employee[]) {
await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), "utf-8");
}
export async function list(params: { q?: string; cargo?: string; estado?: string; page?:
number; pageSize?: number }) {
const { q, cargo, estado, page=1, pageSize=10 } = params;
let data = await readAll();
if (q) data = data.filter(e => e.nombre.toLowerCase().includes(q.toLowerCase()));
if (cargo) data = data.filter(e => e.cargo === cargo);
if (estado) data = data.filter(e => e.estado === estado);
const total = data.length;
const start = (page-1)*pageSize;
return { items: data.slice(start, start+pageSize), total, page, pageSize };
}
export async function get(id: string) {
return (await readAll()).find(e => e.id === id) ?? null;
}
export async function create(input: EmployeeCreate) {
const nuevo: Employee = { id: randomUUID(), ...input };
const all = await readAll(); all.unshift(nuevo); await writeAll(all);
return nuevo;
}
export async function update(id: string, patch: EmployeeUpdate) {
const all = await readAll();
const i = all.findIndex(e => e.id === id);
if (i < 0) return null;
all[i] = { ...all[i], ...patch };
await writeAll(all);
return all[i];
}
export async function remove(id: string) {
const all = await readAll();
const next = all.filter(e => e.id !== id);
if (next.length === all.length) return false;
await writeAll(next);
return true;
}