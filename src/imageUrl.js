export function imageUrl(path) {
  if (typeof path !== "string") return path;
  if (!/^\/?img\//.test(path)) return path;

  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}