"use client";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Importamos para sincronizar filtros con la URL
import Paginacion from "./components/pagination/Paginacion";
import Formulario from "./components/Formulario";
import { Emp } from "./_types/emp";
import Modal from "./components/Modal";
import Tabla from "./components/Tabla";
import Filtros from "./components/Filtros";
import usePagination from "./hooks/usePagination";
import useFiltro from "./hooks/useFiltro";



export default function EmpleadosPage() {
  const [data, setData] = useState<Emp[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { pageSize, total, setPageSize, setTotal} = usePagination({initialPage: 1, initialPageSize: 10}); 
  const{ q, cargo, estado, sort, dir, page,
    setQ, setCargo, setEstado, setSort, setDir, setPage,
    toggleSort} = useFiltro();
  




  // Obtener datos del backend
  const fetchList = async () => {
    const usp = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (q) usp.set("q", q);
    if (cargo) usp.set("cargo", cargo);
    if (estado) usp.set("estado", estado);
    if (sort) usp.set("sort", sort);
    if (dir) usp.set("dir", dir);

    const r = await fetch(`/api/employees?${usp.toString()}`);
    const j = await r.json();
    setData(j.items);
    setTotal(j.total);
  };

  useEffect(() => {
    fetchList();
  }, [q, cargo, estado, page, pageSize, sort, dir]);

  // Crear o editar empleado
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
    <main className="p-15 m-10">
      <h1 className="text-4xl font-bold">Empleados</h1>

     <Filtros
  q={q}
  cargo={cargo}
  estado={estado}
  pageSize={pageSize}
  setQ={setQ}
  setCargo={setCargo}
  setEstado={setEstado}
  setPageSize={setPageSize}
  setPage={setPage}
/>


      {/* Formulario */}
      <Formulario form={form} editing={editing} setForm={setForm} save={save}/>

      {/* Tabla */}
    <Tabla data={data} sort={sort} dir={dir} toggleSort={toggleSort} edit={edit} remove={remove} />

      {/* Paginación */}
      <Paginacion page={page} totalPages={totalPages} onChange={setPage}/>

      {/* Modal */}
      <Modal showModal={showModal} form={form} setForm={setForm} setShowModal={setShowModal} save={save}/>
    </main>
  );
}
