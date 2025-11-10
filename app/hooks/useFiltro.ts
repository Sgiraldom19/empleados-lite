"use client";
import { useState, useEffect, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function useFiltro() {
  const router = useRouter(); //permite leer los parámetros de búsqueda de la URL actual.
  const params = useSearchParams();//permite cambiar las rutas mediante programación dentro del componente cliente.lee las rutas

  const [q, setQ] = useState("");//Devuelve un valor con estado y una función para actualizarlo.
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState("");
  const [sort, setSort] = useState("");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  //Cargar filtros desde la URL solo en la primera renderización
  useEffect(() => {
    const qParam = params.get("q") ?? "";
    const cargoParam = params.get("cargo") ?? "";
    const estadoParam = params.get("estado") ?? "";
    const pageParam = Number(params.get("page")) || 1;
    const sortParam = params.get("sort") ?? "";
    const dirParam = (params.get("dir") as "asc" | "desc") ?? "asc";

    startTransition(() => { // Una función que provoca actualizaciones de estado que pueden aplazarse
      setQ(qParam);
      setCargo(cargoParam);
      setEstado(estadoParam);
      setPage(pageParam);
      setSort(sortParam);
      setDir(dirParam);
    });
  }, [params]);

  //sincronixa la URL pero sin crear bucle, analiza que si cambian los filtros
  useEffect(() => { //Acepta una función que contiene código imperativo, posiblemente con efectos.
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    const usp = new URLSearchParams(); //La interfaz define métodos de utilidad para trabajar con la cadena de consulta de una URL
    if (q) usp.set("q", q);
    if (cargo) usp.set("cargo", cargo);
    if (estado) usp.set("estado", estado);
    if (page !== 1) usp.set("page", String(page));
    if (sort) usp.set("sort", sort);
    if (dir) usp.set("dir", dir);

    router.replace(`?${usp.toString()}`);
  }, [q, cargo, estado, page, sort, dir]);

  const toggleSort = (campo: string) => { //permite alternar entre ordenar por una columna en dirección ascendente, luego descendente, y luego cambiar a una columna diferente
    if (sort === campo) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(campo);
      setDir("asc");
    }
  };

  return {
    q, cargo, estado, sort, dir, page,
    setQ, setCargo, setEstado, setSort, setDir, setPage,
    toggleSort
  };
}
