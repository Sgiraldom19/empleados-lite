"use client";
import {useEffect, useState } from "react";
import Paginacion from "./components/pagination/Paginacion";
import Formulario from "./components/Formulario";
import { Emp } from "./_types/emp";
import Modal from "./components/Modal";
import Tabla from "./components/Tabla";
import Filtros from "./components/Filtros";
import usePagination from "./hooks/usePagination";
import useFiltro from "./hooks/useFiltro";
import useFormulario from "./hooks/useFormulario";
import useModal from "./hooks/useModal";
import useTabla from "./hooks/useTabla";


export default function EmpleadosPage() {
  const [data, setData] = useState<Emp[]>([]);
  const { pageSize, total, setPageSize, setTotal} = usePagination({initialPage: 1, initialPageSize: 10}); 
  const{ q, cargo, estado, page, setQ, setCargo, setEstado, setSort, setDir, setPage} = useFiltro();
  const{sort, dir, toggleSort} = useTabla();
  const {showModal, openModal, closeModal} = useModal();
  
  async function handleEdit(id: string) {
  await edit(id);
  openModal();
}


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

    const {form, setForm, editing, save, edit, remove} = useFormulario(fetchList);

  useEffect(() => {
    fetchList();
  }, [q, cargo, estado, page, pageSize, sort, dir]);


  

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="p-15 m-10">
      <h1 className="text-4xl font-bold">Empleados</h1>

    {/* Filtros */}
     <Filtros q={q} cargo={cargo} estado={estado} pageSize={pageSize} setQ={setQ} setCargo={setCargo} setEstado={setEstado} setPageSize={setPageSize} setPage={setPage}/>

      {/* Formulario */}
      <Formulario form={form} editing={editing} setForm={setForm} save={save}/>

      {/* Tabla */}
    <Tabla data={data} sort={sort} dir={dir} toggleSort={toggleSort} edit={handleEdit} remove={remove}/>

      {/* Paginación */}
      <Paginacion page={page} totalPages={totalPages} onChange={setPage}/>

      {/* Modal */}
      <Modal showModal={showModal} form={form} setForm={setForm} closeModal={closeModal} save={save}/>
    </main>
  );
}
