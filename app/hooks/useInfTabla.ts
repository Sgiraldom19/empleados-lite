"use client";
import { useEffect, useState } from "react";
import { Emp } from "../_types/emp";
import usePagination from "./usePagination";
import useFiltro from "./useFiltro";
import useTabla from "./useTabla";

export default function useInfTabla() {
  const [data, setData] = useState<Emp[]>([]);

  // Hooks ya existentes (Filtros, Tabla, Paginación)
  const { pageSize, total, setPageSize, setTotal } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const { q, cargo, estado, page, setQ, setCargo, setEstado, setPage } =
    useFiltro();

  const { sort, dir, toggleSort } = useTabla();

  // Función que obtiene la informacion de la API
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

    const response = await fetch(`/api/employees?${usp.toString()}`);
    const data = await response.json();

    setData(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchList();
  }, [q, cargo, estado, page, pageSize, sort, dir]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    data,
    fetchList,

    // info filtros
    q,
    cargo,
    estado,
    setQ,
    setCargo,
    setEstado,

    // info paginación
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,

    // info ordenamiento
    sort,
    dir,
    toggleSort,
  };
}
