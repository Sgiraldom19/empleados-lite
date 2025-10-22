"use client";
import { useEffect, useMemo, useState } from "react";
type Emp = {
id: string; nombre: string; cargo: string; salario: number; estado: "activo"|"inactivo";
fechaIngreso: string;
};
export default function EmpleadosPage() {
const [data, setData] = useState<Emp[]>([]);
const [q, setQ] = useState(""); const [cargo, setCargo] = useState(""); const [estado,
setEstado] = useState("");
const [page, setPage] = useState(1); const pageSize = 10;
const fetchList = async () => {
const usp = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
if (q) usp.set("q", q); if (cargo) usp.set("cargo", cargo); if (estado) usp.set("estado",
estado);
const r = await fetch(`/api/employees?${usp.toString()}`); const j = await r.json();
setData(j.items); setTotal(j.total);
};
const [total, setTotal] = useState(0);
useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, [q, cargo, estado, page]);
// Crear / Editar
const [form, setForm] = useState<Partial<Emp>>({ estado:"activo", fechaIngreso: new
Date().toISOString().slice(0,10) });
const editing = useMemo(() => Boolean(form.id), [form.id]);
async function save() {
const body = { ...form, salario: Number(form.salario) };
const opts = { method: editing ? "PATCH" : "POST", headers: {
"Content-Type":"application/json" }, body: JSON.stringify(body) };
const url = editing ? `/api/employees/${form.id}` : "/api/employees";
const r = await fetch(url, opts);
if (!r.ok) { alert("Datos inválidos"); return; }
setForm({ estado:"activo", fechaIngreso: new Date().toISOString().slice(0,10) });
fetchList();
}
async function edit(id: string) {
const r = await fetch(`/api/employees/${id}`); if (!r.ok) return;
setForm(await r.json());
}
async function remove(id: string) {
if (!confirm("¿Eliminar empleado?")) return;
await fetch(`/api/employees/${id}`, { method: "DELETE" }); fetchList();
}
const totalPages = Math.max(1, Math.ceil(total / pageSize));
return (
<main className="container" style={{ maxWidth: 1000, margin: "2rem auto", padding: "0
1rem" }}>
<h1>Empleados</h1>
{/* Filtros */}
<section style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
<input placeholder="Buscar por nombre" value={q}
onChange={e=>{setPage(1);setQ(e.target.value)}} />
<input placeholder="Cargo" value={cargo}
onChange={e=>{setPage(1);setCargo(e.target.value)}} />
<select value={estado} onChange={e=>{setPage(1);setEstado(e.target.value)}}>
<option value="">Todos</option>
<option value="activo">Activo</option>
<option value="inactivo">Inactivo</option>
</select>
</section>
{/* Formulario */}
<section style={{ border:"1px solid #e5e7eb", borderRadius:12, padding:12,
marginBottom:16, background:"#fff" }}>
<h3 style={{marginTop:0}}>{editing ? "Editar empleado" : "Nuevo empleado"}</h3>
<div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
<input placeholder="Nombre" value={form.nombre ?? ""}
onChange={e=>setForm(f=>({ ...f, nombre:e.target.value }))} />
<input placeholder="Cargo" value={form.cargo ?? ""} onChange={e=>setForm(f=>({
...f, cargo:e.target.value }))} />
<input type="number" placeholder="Salario" value={form.salario ?? ""}
onChange={e=>setForm(f=>({ ...f, salario:e.target.value as any }))} />
<select value={form.estado ?? "activo"} onChange={e=>setForm(f=>({ ...f,
estado:e.target.value as any }))}>
<option value="activo">activo</option><option value="inactivo">inactivo</option>
</select>
<input type="date" value={form.fechaIngreso ?? ""} onChange={e=>setForm(f=>({ ...f,
fechaIngreso:e.target.value }))} />
</div>
<div style={{ display:"flex", gap:8, marginTop:10 }}>
<button onClick={save}>{editing ? "Guardar cambios" : "Agregar"}</button>
{editing && <button onClick={()=>setForm({ estado:"activo", fechaIngreso:new
Date().toISOString().slice(0,10) })}>Cancelar</button>}
</div>
</section>
{/* Tabla */}
<table style={{ width:"100%", borderCollapse:"collapse", background:"#fff", border:"1px
solid #e5e7eb", borderRadius:12, overflow:"hidden" }}>
<thead style={{ background:"#f8fafc" }}>
<tr>
<th style={{textAlign:"left", padding:8}}>Nombre</th>
<th style={{textAlign:"left", padding:8}}>Cargo</th>
<th style={{padding:8}}>Estado</th>
<th style={{padding:8}}>Ingreso</th>
<th style={{textAlign:"right", padding:8}}>Salario</th>
<th style={{padding:8}}>Acciones</th>
</tr>
</thead>
<tbody>
{data.map(emp => (
<tr key={emp.id} style={{ borderTop:"1px solid #eee" }}>
<td style={{ padding:8 }}>{emp.nombre}</td>
<td style={{ padding:8 }}>{emp.cargo}</td>
<td style={{ padding:8, textAlign:"center" }}>{emp.estado}</td>
<td style={{ padding:8, textAlign:"center" }}>{emp.fechaIngreso}</td>
<td style={{ padding:8, textAlign:"right" }}>${emp.salario.toLocaleString()}</td>
<td style={{ padding:8, textAlign:"center" }}>
<button onClick={()=>edit(emp.id)}>Editar</button>{" "}
<button onClick={()=>remove(emp.id)}>Eliminar</button>
</td>
</tr>
))}
</tbody>
</table>
{/* Paginación */}
<div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:12 }}>
<button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>«</button>
<span>Página {page} de {totalPages}</span>
<button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>»</button>
</div>
</main>
);
}
