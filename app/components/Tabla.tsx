"use client";
import React from "react";
import { Emp } from "../_types/emp";

type Props = {
  data: Emp[];
  sort: string;
  dir: "asc" | "desc";
  toggleSort: (col: string) => void;
  edit: (id: string) => void;
  remove: (id: string) => void;
};

export default function TablaFinal({ data, sort, dir, toggleSort, edit, remove }: Props) {
  const renderArrow = (col: string) =>
    sort === col ? (dir === "asc" ? "↑" : "↓") : "↕";

  return (
    <table className="w-full border-gray-200 bg-white rounded-lg overflow-hidden">
      <thead className="bg-[#5A9690] text-white">
        <tr>
          <th className="text-left p-2 cursor-pointer select-none" onClick={() => toggleSort("nombre")}>
            Nombre <span className="ml-1">{renderArrow("nombre")}</span>
          </th>
          <th className="text-left p-2 cursor-pointer select-none" onClick={() => toggleSort("cargo")}>
            Cargo <span className="ml-1">{renderArrow("cargo")}</span>
          </th>
          <th className="p-2 text-center">Estado</th>
          <th className="p-2 text-center cursor-pointer select-none" onClick={() => toggleSort("fechaIngreso")}>
            Ingreso <span className="ml-1">{renderArrow("fechaIngreso")}</span>
          </th>
          <th className="text-right p-2 cursor-pointer select-none" onClick={() => toggleSort("salario")}>
            Salario <span className="ml-1">{renderArrow("salario")}</span>
          </th>
          <th className="p-2 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody className="bg-[#FFFAF5]">
        {data.map((emp) => (
          <tr key={emp.id} className="border-t border-[#5A9690]">
            <td className="p-2">{emp.nombre}</td>
            <td className="p-2">{emp.cargo}</td>
            <td className="p-2 text-center">{emp.estado}</td>
            <td className="p-2 text-center">{emp.fechaIngreso}</td>
            <td className="p-2 text-right">${emp.salario.toLocaleString()}</td>
            <td className="p-2 text-center">
              <button className="shadow mr-1 p-1 rounded-lg bg-yellow-400 cursor-pointer" onClick={() => edit(emp.id)}>Editar</button>
              <button className="shadow ml-1 p-1 rounded-lg bg-red-500 cursor-pointer" onClick={() => remove(emp.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

