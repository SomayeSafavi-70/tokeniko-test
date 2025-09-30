import { promises as fs } from "fs";
import path from "path";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

export type User = { id: number; username: string; password: string; email?: string; name?: string; mobile?: string; };

export async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_PATH, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await fs.mkdir(path.dirname(USERS_PATH), { recursive: true });
      await fs.writeFile(USERS_PATH, "[]", "utf8");
      return [];
    }
    throw e;
  }
}
export async function writeUsers(users: User[]) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf8");
}
