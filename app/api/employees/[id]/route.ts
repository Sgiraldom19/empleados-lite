import { NextResponse } from "next/server";
import { EmployeeUpdateSchema } from "../../../lib/validation";
import * as store from "../../../lib/store";

export const dynamic = "force-dynamic";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; 
  const item = await store.get(id);
  return item
    ? NextResponse.json(item)
    : NextResponse.json({ message: "No encontrado" }, { status: 404 });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; 
  const body = await req.json();
  const parsed = EmployeeUpdateSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });

  const updated = await store.update(id, parsed.data);
  return updated
    ? NextResponse.json(updated)
    : NextResponse.json({ message: "No encontrado" }, { status: 404 });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; 
  const ok = await store.remove(id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ message: "No encontrado" }, { status: 404 });
}
