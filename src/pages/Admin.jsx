import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../Store.jsx";
import { productService, authService, orderService, communityService } from "../api/services";
import { PageTitle, ErrorMessage } from "../components";
import { money, price } from "../database";

const tabs = [["products", "Productos"], ["users", "Usuarios"], ["orders", "Órdenes"], ["messages", "Mensajes"], ["reservations", "Reservas"]];

export function Admin() {
  const { user, setNotice } = useShop();
  const [tab, setTab] = useState("products"), [data, setData] = useState({ products: [], users: [], orders: [], messages: [], reservations: [] }), [error, setError] = useState("");
  const load = async () => {
    try {
      const [products, users, orders, messages, reservations] = await Promise.all([productService.getAll(), authService.getAll(), orderService.getAll(), communityService.getMensajes(), communityService.getReservas()]);
      setData({ products, users, orders, messages, reservations });
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };
  useEffect(() => { if (user) load(); }, [user]);
  if (user?.rol !== "ADMIN" && user?.role !== "admin") return <main className="container section"><PageTitle title="Administración" /><p>Necesitas una cuenta administradora para entrar.</p></main>;
  const updateOrder = async (id, estado) => { try { await orderService.actualizarEstado(id, estado); await load(); setNotice("Estado actualizado."); } catch (e) { setError(e.message); } };
  const updateMessage = async (id, estado) => { try { await communityService.actualizarEstadoMensaje(id, estado); await load(); } catch (e) { setError(e.message); } };
  const updateReservation = async (id, estado) => { try { await communityService.actualizarEstadoReserva(id, estado); await load(); } catch (e) { setError(e.message); } };
  return <main className="container section"><PageTitle eyebrow="LEVEL UP / CENTRO DE CONTROL" title="Administración conectada.">Los datos se cargan desde tus microservicios.</PageTitle><div className="admin-grid"><aside className="admin-nav">{tabs.map(([id, label]) => <button key={id} className={tab === id ? "selected" : ""} onClick={() => setTab(id)}>{label}</button>)}<Link to="/perfil">Mi perfil →</Link></aside><section className="admin-content"><ErrorMessage message={error} />{tab === "products" && <List title="Productos" items={data.products} render={(p) => <><strong>{p.nombre}</strong><span>{money(price(p))} · stock {p.stock}</span></>} />}{tab === "users" && <List title="Usuarios" items={data.users} render={(u) => <><strong>{u.nombre}</strong><span>{u.correo} · {u.rol || u.role}</span></>} />}{tab === "orders" && <List title="Órdenes" items={data.orders} render={(o) => <><strong>{o.numero || o.number || `#${o.id}`}</strong><span>{o.nombreCliente || o.customer?.nombre} · {money(o.total || 0)}</span><select className="form-select mt-2" value={o.estado || o.status || "PENDIENTE"} onChange={(e) => updateOrder(o.id, e.target.value)}><option>PENDIENTE</option><option>CONFIRMADA</option><option>EN_PREPARACION</option><option>LISTA</option><option>ENTREGADA</option><option>CANCELADA</option></select></>} />}{tab === "messages" && <List title="Mensajes" items={data.messages} render={(m) => <><strong>{m.asunto}</strong><span>{m.nombre} · {m.correo}<br />{m.mensaje}</span><select className="form-select mt-2" value={m.estado} onChange={(e) => updateMessage(m.id, e.target.value)}><option>NUEVO</option><option>REVISADO</option></select></>} />}{tab === "reservations" && <List title="Reservas" items={data.reservations} render={(r) => <><strong>{r.evento?.titulo || `Evento #${r.eventoId}`}</strong><span>{r.nombreContacto} · {r.personas} personas</span><select className="form-select mt-2" value={r.estado} onChange={(e) => updateReservation(r.id, e.target.value)}><option>PENDIENTE</option><option>CONFIRMADA</option><option>CANCELADA</option></select></>} />}</section></div></main>;
}

function List({ title, items, render }) { return <><div className="section-heading"><h2>{title}</h2><span>{items.length} registros</span></div>{items.length ? items.map((item) => <article className="panel mb-3" key={item.id}>{render(item)}</article>) : <p className="muted">Sin registros.</p>}</> }
