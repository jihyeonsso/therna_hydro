import { cookies } from "next/headers";
import crypto from "crypto";

const USER_COOKIE = "session";
const ADMIN_COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30일
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// 모듈 로드 시점이 아니라 실제 세션 서명/검증 시점에만 검사해서,
// SESSION_SECRET이 없어도 빌드(정적 페이지 수집)는 실패하지 않도록 함.
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.");
  }
  return secret;
}

function sign(value: string): string {
  const sig = crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${sig}`;
}

function verify(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  return crypto.timingSafeEqual(sigBuf, expBuf) ? value : null;
}

// --- 사용자 세션 ---
export async function createUserSession(userId: string) {
  const jar = await cookies();
  jar.set(USER_COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyUserSession() {
  const jar = await cookies();
  jar.delete(USER_COOKIE);
}

export async function getUserIdFromSession(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  return raw ? verify(raw) : null;
}

// --- 관리자 세션 (별도 쿠키) ---
export async function createAdminSession(adminId: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sign(adminId), {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function getAdminIdFromSession(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(ADMIN_COOKIE)?.value;
  return raw ? verify(raw) : null;
}
