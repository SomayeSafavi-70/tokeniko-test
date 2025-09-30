import { NextResponse } from "next/server";
import crypto from "crypto";
import { readUsers } from "@/lib/users-file";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function signToken(payload: any, secret: string, ttlSec = 60 * 60 * 24) {
  const full = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttlSec,
  };
  const body = Buffer.from(JSON.stringify(full)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

export async function POST(req: Request) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "identifier & password required" },
      { status: 400 }
    );
  }

  const users = await readUsers();
  const user = users.find(
    (u) =>
      u.username === identifier ||
      u.email === identifier ||
      u.mobile === identifier
  );

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "رمز عبور یا نام کاربری را اشتباه وارد کرده اید" }, { status: 401 });
  }

  const secret = process.env.TOKEN_SECRET || "dev-secret-change-me";
  const token = signToken(
    { sub: user.id, username: user.username },
    secret,
    60 * 60 * 24 * 7
  );

  const { password: _pw, ...safe } = user;
  return NextResponse.json({ token, user: safe });
}
