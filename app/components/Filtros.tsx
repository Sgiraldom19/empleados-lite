"use client";
import React from "react";

type Props = {
  q: string;
  cargo: string;
  estado: string;
  pageSize: number;
  setQ: (v: string) => void;
  setCargo: (v: string) => void;
  setEstado: (v: string) => void;
  setPageSize: (v: number) => void;
  setPage: (v: number) => void;
};

export default function Filtros({
  q,
  cargo,
  estado,
  pageSize,
  setQ,
  setCargo,
  setEstado,
  setPageSize,
  setPage,
}: Props) {
  return (
    <section className="my-4">
      <input
        className="m-2 rounded-lg shadow px-2 py-1"
        placeholder="Buscar por nombre"
        value={q}
        onChange={(e) => {
          setPage(1);
          setQ(e.target.value);
        }}
      />

      <input
        className="m-2 rounded-lg shadow px-2 py-1"
        placeholder="Cargo"
        value={cargo}
        onChange={(e) => {
          setPage(1);
          setCargo(e.target.value);
        }}
      />

      <select
        className="m-2 rounded-lg shadow px-2 py-1"
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

      <label className="m-2">
        <span>Mostrar </span>
        <select
          className="rounded-lg shadow px-2 py-1"
          value={pageSize}
          onChange={(e) => {
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
  );
}
