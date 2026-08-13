import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

const SESSION_COOKIE = "session";

export async function createSession(studentId: number) {
  const token = await new SignJWT({
    studentId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);

    const studentId = Number(payload.studentId);

    if (!studentId || Number.isNaN(studentId)) {
      return null;
    }

    return {
      studentId,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function destroySession() {
  cookies().delete(SESSION_COOKIE);
}