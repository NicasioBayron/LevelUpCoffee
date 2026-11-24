import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { money } from "../database";
import { orderService } from "../api/services";
import { PageTitle, Empty, ErrorMessage } from "../components";

function normalizeOrder(order) {
  const items = (order.items || order.detalles || []).map((item) => ({
    ...item,
    id: item.productoId ?? item.id,
    nombre: item.nombreProducto ?? item.nombre,
    quantity: item.cantidad ?? item.quantity,
    unitPrice: item.precioUnitario ?? item.unitPrice,
  }));
  const shipping = order.costoEnvio ?? order.shipping ?? 0;
  const subtotal =
    order.subtotal ??
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const delivery = order.tipoEntrega ?? order.delivery;
  const pickup = order.sucursalRetiro ?? order.pickupBranch;

  return {
    ...order,
    number:
      order.numeroOrden ??
      order.numero ??
      order.number ??
      `LU-${order.id}`,
    date:
      order.fechaCreacion ??
      order.fecha ??
      order.createdAt ??
      order.date ??
      new Date().toISOString(),
    customer: {
      ...order.customer,
      nombre: order.nombreCliente ?? order.customer?.nombre ?? "",
      correo: order.correoCliente ?? order.customer?.correo ?? "",
      direccion: order.direccionEntrega ?? order.customer?.direccion ?? "",
      comuna: order.customer?.comuna ?? "",
      region: order.customer?.region ?? "",
    },
    delivery,
    pickupBranch:
      typeof pickup === "string"
        ? { name: pickup, address: pickup }
        : pickup,
    items,
    subtotal,
    shipping,
    total: order.total ?? order.totalOrden ?? subtotal + shipping,
    status: order.estado ?? order.status ?? "Confirmado",
  };
}

export function Receipt({ order: rawOrder }) {
  const order = normalizeOrder(rawOrder);
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
          : [
              order.customer.direccion,
              order.customer.comuna,
              order.customer.region,
            ]
              .filter(Boolean)
              .join(", ")}
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
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.quantity}</td>
                <td>{money(item.unitPrice * item.quantity)}</td>
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
  const { id } = useParams();
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({
    key: "",
    order: null,
    error: "",
  });
  const requestKey = `${id}:${retry}`;
  const loading = !failed && result.key !== requestKey;
  const error = loading || failed ? "" : result.error;
  const order = loading || failed || error ? null : result.order;

  useEffect(() => {
    if (failed) return undefined;
    let active = true;
    orderService
      .getById(id)
      .then((data) => {
        if (active) setResult({ key: requestKey, order: data, error: "" });
      })
      .catch((requestError) => {
        if (active) {
          setResult({
            key: requestKey,
            order: null,
            error:
              requestError.response?.data?.message ||
              requestError.message ||
              "Error desconocido.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [failed, id, requestKey]);

  if (loading)
    return (
      <main className="container section">
        <p role="status">Cargando comprobante…</p>
      </main>
    );

  if (error)
    return (
      <main className="container section">
        <PageTitle title="No se pudo cargar el comprobante." />
        <ErrorMessage message={error} />
        <button
          className="btn btn-lime"
          onClick={() => setRetry((attempt) => attempt + 1)}
        >
          Reintentar
        </button>
      </main>
    );

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
      {order && <Receipt order={order} />}
    </main>
  );
}
