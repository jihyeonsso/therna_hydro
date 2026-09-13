import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/session";

export async function GET(request: Request) {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
