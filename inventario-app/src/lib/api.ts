import { Platform } from "react-native";

const LAN_IP = "192.168.1.65";
const API_URL =
  Platform.OS === "web" ? "http://localhost:3000" : `http://${LAN_IP}:3000`;

async function ensureOk(res: Response) {
  if (res.ok) return;
  const text = await res.text();
  throw new Error(text || `HTTP ${res.status}`);
}

export async function getItems() {
  const res = await fetch(`${API_URL}/items`);
  await ensureOk(res);
  return res.json();
}

export async function getItem(id: number) {
  const res = await fetch(`${API_URL}/items/${id}`);
  await ensureOk(res);
  return res.json();
}

export async function createItem(data: any) {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  await ensureOk(res);
  return res.json();
}

export async function updateItem(id: number, data: any) {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  await ensureOk(res);
  return res.json();
}

export async function deleteItem(id: number) {
  const res = await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
  await ensureOk(res);
  return true;
}