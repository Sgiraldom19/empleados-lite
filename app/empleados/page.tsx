"use client";

import { useEffect, useMemo, useState } from "react";

type Emp = {
  id: string;
  nombre: string;
  cargo: string;
  salario: number;
  estado: "activo" | "inactivo";
  fechaIngreso: string;
};

export default function EmpleadosPage() {
  const [data, setData] = useState<Emp[]>([]);
  const [q, setQ] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [showModal, setShowModal] = useState(false);


  const fetchList = async () => {
    const usp = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (q) usp.set("q", q);
    if (cargo) usp.set("cargo", cargo);
    if (estado) usp.set("estado", estado);

    const r = await fetch(`/api/employees?${usp.toString()}`);
    const j = await r.json();
    setData(j.items);
    setTotal(j.total);
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, cargo, estado, page]);

  // Crear / Editar
  const [form, setForm] = useState<Partial<Emp>>({
    estado: "activo",
    fechaIngreso: new Date().toISOString().slice(0, 10),
  });

  const editing = useMemo(() => Boolean(form.id), [form.id]);

  async function save() {
    const body = { ...form, salario: Number(form.salario) };
    const opts = {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    const url = editing ? `/api/employees/${form.id}` : "/api/employees";
    const r = await fetch(url, opts);

    if (!r.ok) {
      alert("Datos inválidos");
      return;
    }

    setForm({
      estado: "activo",
      fechaIngreso: new Date().toISOString().slice(0, 10),
    });
    fetchList();
  }

  async function edit(id: string) {
    const r = await fetch(`/api/employees/${id}`);
    if (!r.ok) return;
    setForm(await r.json());
    setShowModal(true);
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar empleado?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    fetchList();
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main
      className="container"
      style={{ maxWidth: 1000, margin: "2rem auto", padding: "0 1rem" }}
    >
      <h1  className="text-4xl font-bold tex">Empleados</h1>

      {/* Filtros */}
      <section>
        <input
          placeholder="Buscar por nombre"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <input
          placeholder="Cargo"
          value={cargo}
          onChange={(e) => {
            setPage(1);
            setCargo(e.target.value);
          }}
        />
        <select
          value={estado}
          onChange={(e) => {
            setPage(1);
            setEstado(e.target.value);
          }}
        >
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </section>

      {/* Formulario */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
          background: "#fff",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {editing ? "Editar empleado" : "Nuevo empleado"}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <input
            placeholder="Nombre"
            value={form.nombre ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          />
          <input
            placeholder="Cargo"
            value={form.cargo ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Salario"
            value={form.salario ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, salario: e.target.value === "" ? undefined : Number(e.target.value)}))
            }
          />
          <select
            value={form.estado ?? "activo"}
            onChange={(e) =>
              setForm((f) => ({ ...f, estado: e.target.value as Emp["estado"]}))
            }
          >
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
          <input
            type="date"
            value={form.fechaIngreso ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, fechaIngreso: e.target.value }))
            }
          />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={save}>
            {editing ? "Guardar cambios" : "Agregar"}
          </button>
          {editing && (
            <button
              onClick={() =>
                setForm({
                  estado: "activo",
                  fechaIngreso: new Date().toISOString().slice(0, 10),
                })
              }
            >
              Cancelar
            </button>
          )}
        </div>
      </section>

      {/* Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead className="bg-[#5A9690]">
          <tr>
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Cargo</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Ingreso</th>
            <th className="text-right p-2">Salario</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody className="bg-[#FFFAF5]">
          {data.map((emp) => (
            <tr key={emp.id} className="border-t border-[#5A9690]">
              <td className="p-2">{emp.nombre}</td>
              <td className="p-2">{emp.cargo}</td>
              <td className="p-2 text-center ">{emp.estado}</td>
              <td className="p-2 text-center">{emp.fechaIngreso}</td>

              <td className="p-2 text-center text-right">
                ${emp.salario.toLocaleString()}
              </td>
              <td style={{ padding: 8, textAlign: "center" }}>
                <button className="border rounded bg-[orange]" onClick={() => edit(emp.id)}>Editar</button>{" "}
                <button className="border rounded bg-[red]" onClick={() => remove(emp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div
        className="flex gap-2 justify-center mt-3"
      >
        <button className="px-3 py-1 border rounded-md bg-[gray]" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          «
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded-md bg-[gray] "
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          »
        </button>
      </div>
      {showModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 50,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        maxWidth: 400,
      }}
    >
      <h3>Editar empleado</h3>
      <input
        placeholder="Nombre"
        value={form.nombre ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        placeholder="Cargo"
        value={form.cargo ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="Salario"
        value={form.salario ?? ""}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            salario:
              e.target.value === "" ? undefined : Number(e.target.value),
          }))
        }
        style={{ width: "100%", marginBottom: 8 }}
      />
      <select
        value={form.estado ?? "activo"}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            estado: e.target.value as Emp["estado"],
          }))
        }
        style={{ width: "100%", marginBottom: 8 }}
      >
        <option value="activo">activo</option>
        <option value="inactivo">inactivo</option>
      </select>
      <input
        type="date"
        value={form.fechaIngreso ?? ""}
        onChange={(e) =>
          setForm((f) => ({ ...f, fechaIngreso: e.target.value }))
        }
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
        
          onClick={() => {
            save();
            setShowModal(false);
          }}
          className="border rounded bg-[green]"
        >
          Guardar
        </button>
        <button className="border rounded bg-[red]" onClick={() => setShowModal(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
