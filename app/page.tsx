"use client";
import {useEffect, useState } from "react";
import Paginacion from "./components/pagination/Paginacion";
import { Emp } from "./_types/emp";
import Modal from "./components/Modal";
import Tabla from "./components/Tabla";
import Filtros from "./components/Filtros";
import usePagination from "./hooks/usePagination";
import useFiltro from "./hooks/useFiltro";
import useFormulario from "./hooks/useFormulario";
import useModal from "./hooks/useModal";
import useTabla from "./hooks/useTabla";
import useInfTabla from "./hooks/useInfTabla";

export default function EmpleadosPage() {
  const {
    data, q, cargo, estado, page, pageSize,
    totalPages, setQ, setCargo, setEstado, setPage, setPageSize,
    sort, dir, toggleSort, fetchList,
  } = useInfTabla();
  const { form, setForm, editing, save, edit, remove } = useFormulario(fetchList);
  const {showModal, openModal, closeModal} = useModal();
  
  async function handleEdit(id: string) {
  await edit(id);
  openModal();
}


  return (
    <main className="p-15 m-10">
      <h1 className="text-4xl font-bold">Empleados</h1>

    {/* Filtros */}
     <Filtros q={q} cargo={cargo} estado={estado} pageSize={pageSize} setQ={setQ} setCargo={setCargo} setEstado={setEstado} setPageSize={setPageSize} setPage={setPage}/>

    <div>
      <button onClick={() => {setForm({estado: "activo", fechaIngreso: new Date().toISOString().slice(0,10)}); openModal();}} className="shadow-md rounded-lg m-2 p-1 bg-gray-200 cursor-pointer">
        Agregar Empleado
      </button>
    </div>

      {/* Tabla */}
    <Tabla data={data} sort={sort} dir={dir} toggleSort={toggleSort} edit={handleEdit} remove={remove}/>

      {/* Paginación */}
      <Paginacion page={page} totalPages={totalPages} onChange={setPage}/>

      {/* Modal */}
      <Modal showModal={showModal} form={form} setForm={setForm} closeModal={closeModal} save={save}/>
    </main>
  );
}
