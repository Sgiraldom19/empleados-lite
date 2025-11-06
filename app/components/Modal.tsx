import React from "react";
import { Emp } from "../_types/emp";

interface ModalProps {
    showModal: boolean;
    form: Partial<Emp>;
    setForm: React.Dispatch<React.SetStateAction<Partial<Emp>>>;
    closeModal: () => void;
    save: () => void;
}

export default function Modal({showModal, form, setForm, closeModal, save}: ModalProps) {
    if (!showModal) return null;

  return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg w-[90%] max-w-[400px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">{form.id ? "Editar Empleado" : "Agregar Empleado"}</h3>
            <input
              placeholder="Nombre"
              value={form.nombre ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre: e.target.value }))
              }
              className="w-full mb-2 shadow rounded-lg"
            />
            <input
              placeholder="Cargo"
              value={form.cargo ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, cargo: e.target.value }))
              }
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
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value),
                }))
              }
              className="w-full mb-2 shadow rounded-lg"
            />
            <select
              value={form.estado ?? "activo"}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  estado: e.target.value as "activo" | "inactivo",
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
                  closeModal();
                }}
                className="shadow rounded-lg bg-green-500 cursor-pointer p-1"
              >
                {form.id ? "Guardar" : "Agregar"}
              </button>
              <button
                className="shadow rounded-lg bg-red-500 cursor-pointer p-1"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )
}


