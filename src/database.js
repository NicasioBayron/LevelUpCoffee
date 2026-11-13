import { seedProducts } from "./products.js";
import { branches } from "./locations.js";

const KEY = "levelup.database.v2";
// Cuenta pública para la presentación académica. No usar en producción.
const demoAdmin = () => ({
  id: "levelup-admin-demo-v1",
  nombre: "Admin Demo",
  correo: "admin@levelup.test",
  role: "admin",
  salt: "levelup-admin-demo-v1",
  password: "02da4d3d039aa28e30a8b77140170d8c3654ef4d18ccf69ace1b1c8a0f954a65",
});
const initial = () => ({
  demoAdminSeeded: true,
  products: seedProducts,
  categories: [...new Set(seedProducts.map((p) => p.categoria))].map(
    (nombre, i) => ({ id: i + 1, nombre }),
  ),
  users: [demoAdmin()],
  orders: [],
  messages: [],
  reservations: [],
  cart: [],
});
function read() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const data = initial();
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }
  try {
    const data = JSON.parse(raw);
    if (
      ![
        "products",
        "categories",
        "users",
        "orders",
        "messages",
        "reservations",
        "cart",
      ].every((k) => Array.isArray(data[k]))
    )
      throw Error();
    // Incorporar la cuenta una sola vez a bases anteriores sin borrar sus datos.
    if (!data.demoAdminSeeded) {
      if (!data.users.some((u) => u.id === "levelup-admin-demo-v1" ||
          u.correo?.trim().toLowerCase() === "admin@levelup.test")) {
        data.users.push(demoAdmin());
      }
      data.demoAdminSeeded = true;
      localStorage.setItem(KEY, JSON.stringify(data));
    }
    return data;
  } catch {
    throw new Error(
      "Los datos locales no se pudieron leer. Conserva una copia del almacenamiento antes de restablecerlo.",
    );
  }
}
function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    throw new Error(
      "No se pudo guardar. Revisa el espacio o los permisos del navegador.",
    );
  }
  window.dispatchEvent(new Event("levelup:update"));
}
export const db = {
  list: (table) => structuredClone(read()[table]),
  get: (table, id) =>
    structuredClone(read()[table].find((x) => String(x.id) === String(id))),
  create(table, record) {
    const data = read();
    const item = { ...record, id: crypto.randomUUID() };
    data[table].push(item);
    write(data);
    return item;
  },
  update(table, id, changes) {
    const data = read();
    const i = data[table].findIndex((x) => String(x.id) === String(id));
    if (i < 0) throw Error("Registro no encontrado.");
    data[table][i] = { ...data[table][i], ...changes, id: data[table][i].id };
    write(data);
    return data[table][i];
  },
  remove(table, id) {
    const data = read();
    data[table] = data[table].filter((x) => String(x.id) !== String(id));
    write(data);
  },
  setCart(cart) {
    const data = read();
    data.cart = cart;
    write(data);
  },
  // Validación y descuento de stock en una única escritura, sin pedidos parciales.
  checkout(customer, delivery, userId) {
    const data = read();
    const pickupBranch =
      delivery === "retiro"
        ? branches.find((branch) => branch.id === customer.sucursal)
        : null;
    if (delivery === "retiro" && !pickupBranch)
      throw Error("Selecciona una sucursal de retiro válida.");
    if (!data.cart.length) throw Error("Tu carrito está vacío.");
    const items = data.cart.map((line) => {
      const p = data.products.find((x) => x.id === line.id);
      if (
        !p ||
        !Number.isInteger(line.quantity) ||
        line.quantity < 1 ||
        line.quantity > p.stock
      )
        throw Error("El stock cambió. Revisa tu carrito.");
      return { ...p, quantity: line.quantity, unitPrice: price(p) };
    });
    const subtotal = items.reduce((s, p) => s + p.unitPrice * p.quantity, 0),
      shipping = delivery === "retiro" || subtotal >= 50000 ? 0 : 3990;
    const order = {
      id: crypto.randomUUID(),
      number: "LU-" + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      userId,
      customer,
      delivery,
      pickupBranch: pickupBranch
        ? {
            name: pickupBranch.name,
            address: pickupBranch.address,
            phone: pickupBranch.phone,
          }
        : null,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "Confirmado",
    };
    for (const item of items)
      data.products.find((p) => p.id === item.id).stock -= item.quantity;
    data.orders.push(order);
    data.cart = [];
    write(data);
    return order;
  },
};
export const price = (p) => Math.round(p.precio * (1 - p.descuento / 100));
export const money = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
export async function passwordHash(password, salt) {
  const bytes = new TextEncoder().encode(salt + password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
}
export function validRun(value) {
  const run = value.replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(run)) return false;
  let sum = 0,
    f = 2;
  for (const n of run.slice(0, -1).split("").reverse()) {
    sum += Number(n) * f;
    f = f === 7 ? 2 : f + 1;
  }
  const d = 11 - (sum % 11);
  return run.at(-1) === (d === 11 ? "0" : d === 10 ? "K" : String(d));
}
