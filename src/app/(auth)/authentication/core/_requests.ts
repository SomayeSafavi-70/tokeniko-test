import axios from "axios";

const LS_TOKEN_KEY = "auth_token";
const LS_USER_KEY = "auth_user";

export type SafeUser = {
  id: number;
  username: string;
  email?: string;
  name?: string;
  mobile?: string;
};

export async function fetchUsers() {
  const { data } = await axios.get("/api/users");
  return data;
}

export async function createUser(payload: {
  username: string;
  password: string;
  email?: string;
  name?: string;
  mobile?: string;
}) {
  const { data } = await axios.post("/api/users", payload);
  return data;
}

export async function login(identifier: string, password: string) {
  const { data } = await axios.post("/api/auth/login", {
    identifier,
    password,
  });

  localStorage.setItem(LS_TOKEN_KEY, data.token);
  localStorage.setItem(LS_USER_KEY, JSON.stringify(data.user as SafeUser));

  return data;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_USER_KEY);
}
