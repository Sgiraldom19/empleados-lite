import { Emp } from "../_types/emp";

type Props = {
  form: Partial<Emp>;
  editing: boolean;
  setForm: React.Dispatch<React.SetStateAction<Partial<Emp>>>;
  save: () => void;
};

export default function Formulario({ form, editing, setForm, save }: Props) {
  return (
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
            setForm((f) => ({
              ...f,
              salario:
                e.target.value === "" ? undefined : Number(e.target.value),
            }))
          }
        />
        <select
          className="m-2 bg-white rounded-lg shadow"
          value={form.estado ?? "activo"}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              estado: e.target.value,
            }))
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
        <button
          className="p-1 m-2 border-gray-300 rounded-lg bg-white shadow cursor-pointer"
          onClick={save}
        >
          {editing ? "Guardar cambios" : "Agregar"}
        </button>

        {editing && (
          <button
            className="p-1 m-2 border-gray-300 rounded-lg bg-white shadow cursor-pointer"
            onClick={() =>
              setForm(() => ({
                estado: "activo",
                fechaIngreso: new Date().toISOString().slice(0, 10),
              }))
            }
          >
            Cancelar
          </button>
        )}
      </div>
    </section>
  );
}
