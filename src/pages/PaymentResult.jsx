import React from "react";
import { Link, useParams } from "react-router-dom";
import { db, money } from "../database";
import { PageTitle, Empty } from "../components";

export function Receipt({ order }) {
  return (
    <div className="panel receipt">
      <div className="d-flex justify-content-between flex-wrap">
        <div>
          <div className="eyebrow">COMPROBANTE DEMOSTRATIVO</div>
          <h2>{order.number}</h2>
        </div>
        <p>{new Date(order.date).toLocaleString("es-CL")}</p>
      </div>
      <p>
        {order.customer.nombre} · {order.customer.correo}
      </p>
      <p>
        {order.delivery === "retiro"
          ? order.pickupBranch
            ? `Retiro en ${order.pickupBranch.name} · ${order.pickupBranch.address}`
            : "Retiro en cafetería"
          : `${order.customer.direccion}, ${order.customer.comuna}, ${order.customer.region}`}
      </p>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.quantity}</td>
                <td>{money(p.unitPrice * p.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Entrega: {money(order.shipping)}</p>
      <h3>Total: {money(order.total)}</h3>
      <p>Estado: {order.status} · Sin validez tributaria</p>
      <button
        className="btn btn-outline-light no-print"
        onClick={() => window.print()}
      >
        Imprimir comprobante
      </button>
    </div>
  );
}

export function PaymentResult({ failed = false }) {
  const { id } = useParams(),
    order = db.get("orders", id);

  if (!failed && !order)
    return (
      <main className="container section">
        <Empty title="Comprobante no encontrado" />
      </main>
    );

  return (
    <main className="container section">
      <div className="result-heading">
        {failed ? (
          <span style={{ fontSize: "40px" }}>❌</span>
        ) : (
          <span style={{ fontSize: "40px" }}>✅</span>
        )}
        <PageTitle
          title={
            failed
              ? "El pago no se completó."
              : "¡Una nueva aventura confirmada!"
          }
        >
          {failed
            ? "Tu carrito sigue guardado. Puedes volver a intentarlo sin perder tu selección."
            : "Guardamos tu pedido y actualizamos el stock. Gracias por jugar con nosotros."}
        </PageTitle>
        <Link className="btn btn-lime" to={failed ? "/checkout" : "/tienda"}>
          {failed ? "Volver a intentar" : "Seguir explorando"} &rarr;
        </Link>
      </div>
      {order && !failed && <Receipt order={order} />}
    </main>
  );
}