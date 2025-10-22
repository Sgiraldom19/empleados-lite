import { NextResponse } from "next/server";
import { EmployeeCreateSchema } from "@/lib/validation";
import * as store from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
const sp = new URL(req.url).searchParams;
const q = sp.get("q") || undefined;
const cargo = sp.get("cargo") || undefined;
const estado = sp.get("estado") || undefined;
const page = Number(sp.get("page") || 1);
const pageSize = Number(sp.get("pageSize") || 10);
const data = await store.list({ q, cargo, estado, page, pageSize });
return NextResponse.json(data);
}
export async function POST(req: Request) {
const body = await req.json();
const parsed = EmployeeCreateSchema.safeParse(body);
if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400
});
const created = await store.create(parsed.data);
return NextResponse.json(created, { status: 201 });
}
