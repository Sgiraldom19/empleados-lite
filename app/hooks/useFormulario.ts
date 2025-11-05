import { useMemo, useState } from "react";
import { Emp } from "../_types/emp";

export default function useFormulario(fetchList: () => void) {
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

    // Reiniciar formulario
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
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar empleado?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    fetchList();
  }

  return {
    form,
    setForm,
    editing,
    save,
    edit,
    remove,
  };
}
