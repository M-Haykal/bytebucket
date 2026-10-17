export const API_BASE =
  import.meta.env.PUBLIC_API_URL || "https://bytebucket.hayproject.my.id";
export function token() {
  return typeof localStorage === "undefined"
    ? ""
    : localStorage.getItem("cloudpixel_token") || "";
}
export async function api(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const t = token();
  if (t) headers.set("Authorization", "Bearer " + t);
  const r = await fetch(API_BASE + path, { ...init, headers });
  if (r.status === 401) {
    if (typeof localStorage !== "undefined")
      localStorage.removeItem("cloudpixel_token");
    if (typeof location !== "undefined") location.href = "/login";
  }
  return r;
}
