import { NextResponse } from "next/server";
import { readUsers, writeUsers, type User } from "@/lib/users-file";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const users = await readUsers();
  const safe = users.map(({ password, ...rest }) => rest);
  return NextResponse.json(safe);
}

export async function POST(req: Request) {
  const { username, password, email, name, mobile } = await req.json();
  if (!username || !password) {
    return NextResponse.json(
      { error: "username & password required" },
      { status: 400 }
    );
  }

  const users = await readUsers();
  const exists = users.find(
    (u) =>
      u.username === username ||
      (email && u.email === email) ||
      (mobile && u.mobile === mobile)
  );
  if (exists) {
    return NextResponse.json({ error: "کاربری با این ایمیل یا شماره موبایل یا نام کاربری از قبل وجود دارد." }, { status: 409 });
  }

  const newUser: User = {
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    username,
    password,
    email,
    name,
    mobile,
  };

  users.push(newUser);
  await writeUsers(users);

  const { password: _, ...safe } = newUser;
  return NextResponse.json(safe, { status: 201 });
}
