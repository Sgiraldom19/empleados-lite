import { NextResponse } from "next/server";
import { EmployeeUpdateSchema } from "@/lib/validation";
import * as store from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: { id: string }}) {
const item = await store.get(params.id);
return item ? NextResponse.json(item) : NextResponse.json({ message: "No encontrado" },
{ status: 404 });
}
export async function PATCH(req: Request, { params }: { params: { id: string }}) {
const body = await req.json();
const parsed = EmployeeUpdateSchema.safeParse(body);
if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400
});
const updated = await store.update(params.id, parsed.data);
return updated ? NextResponse.json(updated) : NextResponse.json({ message: "No encontrado" }, { status: 404 });
}
export async function DELETE(_: Request, { params }: { params: { id: string }}) {
const ok = await store.remove(params.id);
return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ message: "No encontrado" }, { status: 404 });
}
