import { NextResponse } from "next/server";
import { destroyUserSession } from "@/lib/session";

export async function GET(request: Request) {
  await destroyUserSession();
  return NextResponse.redirect(new URL("/", request.url));
}
