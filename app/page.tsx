"use client";
import { startTransition, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Importamos para sincronizar filtros con la URL
import Paginacion from "./components/pagination/Paginacion";
import Formulario from "./components/Formulario";
import { Emp } from "./_types/emp";
import Modal from "./components/Modal";
import Tabla from "./components/Tabla";
import Filtros from "./components/Filtros";
import usePagination from "./hooks/usePagination";
import useFormulario from "./hooks/useFormulario";
import useModal from "./hooks/useModal";


export default function EmpleadosPage() {
  const [data, setData] = useState<Emp[]>([]);
  const [q, setQ] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState("");
  const {showModal, openModal, closeModal} = useModal();
  const {page, pageSize, total, setPage, setPageSize, setTotal} = usePagination({initialPage: 1, initialPageSize: 10}); 
  

  // Estados de ordenamiento
  const [sort, setSort] = useState("");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const router = useRouter();
  const params = useSearchParams();

  async function handleEdit(id:string) {
    await edit(id);
    openModal();
  }

  // Cargar filtros desde la URL al iniciar
  useEffect(() => {
    const qParam = params.get("q") ?? "";
    const cargoParam = params.get("cargo") ?? "";
    const estadoParam = params.get("estado") ?? "";
    const pageParam = Number(params.get("page")) || 1;
    const sortParam = params.get("sort") ?? "";
    const dirParam = (params.get("dir") as "asc" | "desc") ?? "asc";

  startTransition(() => {
    setQ(qParam);
    setCargo(cargoParam);
    setEstado(estadoParam);
    setPage(pageParam);
    setSort(sortParam);
    setDir(dirParam);
  });
}, [params]);

  // Actualizar la URL cuando cambian los filtros
// Lo mofique para que no genere un bucle
const [isFirstLoad, setIsFirstLoad] = useState(true);

useEffect(() => {
  // Evita que corra en la primera carga
  if (isFirstLoad) {
    setIsFirstLoad(false);
    return;
  }

  const usp = new URLSearchParams();
  if (q) usp.set("q", q);
  if (cargo) usp.set("cargo", cargo);
  if (estado) usp.set("estado", estado);
  if (page !== 1) usp.set("page", String(page));
  if (sort) usp.set("sort", sort);
  if (dir) usp.set("dir", dir);

  router.replace(`?${usp.toString()}`);
}, [q, cargo, estado, page, sort, dir, router]);


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


  // Alternar orden de columnas
  const toggleSort = (campo: string) => {
    if (sort === campo) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(campo);
      setDir("asc");
    }
  };

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
