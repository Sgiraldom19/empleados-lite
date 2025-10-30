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
  const [pageSize, setPageSize] = useState(10)
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
  }, [q, cargo, estado, page, pageSize]);

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
      className="p-15 m-10"
    >
      <h1  className="text-4xl font-bold tex">Empleados</h1>

      {/* Filtros */}
      <section>
        <input
          className="m-2 rounded-lg shadow"
          placeholder="Buscar por nombre"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <input
          className="m-2 rounded-lg shadow"
          placeholder="Cargo"
          value={cargo}
          onChange={(e) => {
            setPage(1);
            setCargo(e.target.value);
          }}
        />
        <select
          className="m-2 rounded-lg shadow"
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

          <label>
            <span>Mostrar</span>
            <select
              className=""
              value={pageSize}
              onChange={(e) =>{
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              </select>
          </label>
      </section>

      {/* Formulario */}
      <section className="mt-2 mb-10 p-2 border rounded-lg border-gray-300 bg-[#FFFAF5]">
        <h3 className="text-lg font-bold">
          {editing ? "Editar empleado" : "Nuevo empleado"}
        </h3>
        <div className="m-2 p-2">
          <input
            className="m-2 bg-white rounded-lg shadow"
            placeholder="Nombre"
            value={form.nombre ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          />
          <input
            className="m-2 bg-white rounded-lg shadow"
            placeholder="Cargo"
            value={form.cargo ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
          />
          <input
            className="m-2 bg-white rounded-lg shadow"
            type="number"
            placeholder="Salario"
            value={form.salario ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, salario: e.target.value === "" ? undefined : Number(e.target.value)}))
            }
          />
          <select
            className="m-2 bg-white rounded-lg shadow"
            value={form.estado ?? "activo"}
            onChange={(e) =>
              setForm((f) => ({ ...f, estado: e.target.value as Emp["estado"]}))
            }
          >
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
          <input
            className="m-2 bg-white rounded-lg shadow"
            type="date"
            value={form.fechaIngreso ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, fechaIngreso: e.target.value }))
            }
          />
        </div>
        <div>
          <button className="p-1 m-2 border-gray-300 rounded-lg bg-white shadow cursor-pointer" onClick={save}>
            {editing ? "Guardar cambios" : "Agregar"}
          </button>
          {editing && (
            <button className="p-1 m-2 border-gray-300 rounded-lg bg-white shadow cursor-pointer"
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
        className="w-full border-gray-200 bg-white rounded-lg overflow-hidden"
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
                <button className="shadow mr-1 p-1 rounded-lg bg-yellow-400 cursor-pointer" onClick={() => edit(emp.id)}>Editar</button>{" "}
                <button className="shadow ml-1 p-1 rounded-lg bg-red-500 cursor-pointer" onClick={() => remove(emp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div
        className="flex gap-2 justify-center mt-3"
      >
        <button className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]" disabled={page <= 1} onClick={() => setPage(1)}>
          «
        </button>
        <button className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ‹
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          ›
        </button>
        <button className="px-3 py-1 shadow-lg rounded-lg bg-[#5A9690]" disabled={page >= totalPages} onClick={() => {setPage(totalPages)}}>
          »
        </button>
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-5 rounded-lg w-[90%] max-w-[400px] shadow-lg">
      <h3 className="text-xl font-bold mb-4">Editar empleado</h3>
      <input
        placeholder="Nombre"
        value={form.nombre ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
        className="w-full mb-2 shadow rounded-lg"
      />
      <input
        placeholder="Cargo"
        value={form.cargo ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
        className="w-full mb-2 shadow rounded-lg"
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
        className="w-full mb-2 shadow rounded-lg"
      />
      <select
        value={form.estado ?? "activo"}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            estado: e.target.value as Emp["estado"],
          }))
        }
        className="w-full mb-2 shadow rounded-lg"
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
        className="w-full mb-2 shadow rounded-lg"
      />

      <div className="space-x-4 mt-3">
        <button
        
          onClick={() => {
            save();
            setShowModal(false);
          }}
          className="shadow rounded-lg bg-green-500 cursor-pointer p-1"
        >
          Guardar
        </button>
        <button className="shadow rounded-lg bg-red-500 cursor-pointer p-1" 
          onClick={() => setShowModal(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
