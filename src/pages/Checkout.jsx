import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, money, price } from "../database";
import { productService, orderService, paymentService, cartService } from "../api/services";
import { migrateCartProductIds } from "../api/cart";
import { branches, openingHours } from "../locations";
import { useShop } from "../Store.jsx";
import { PageTitle, Empty, Field, ErrorMessage } from "../components";

const shippingCost = 3990;

export function Checkout() {
  const { user, setNotice, cartId } = useShop();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState("retiro");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({
    key: "",
    products: [],
    error: "",
  });
  const lines = db.list("cart");
  const hasLines = lines.length > 0;
  const cartKey = lines.map((line) => line.id).join(",");
  const requestKey = `${cartKey}:${retry}`;
  const loading = result.key !== requestKey;
  const loadError = loading ? "" : result.error;
  const products = loading || loadError ? [] : result.products;
  const subtotal = lines.reduce((sum, line) => {
    const product = products.find(
      (item) => String(item.id) === String(line.id),
    );
    return sum + (product ? price(product) * line.quantity : 0);
  }, 0);
  const shipping =
    delivery === "retiro" || subtotal >= 50000 ? 0 : shippingCost;

  useEffect(() => {
    if (!hasLines) return undefined;
    let active = true;
    productService
      .getAll()
      .then((items) => {
        if (active) {
          migrateCartProductIds(items);
          setResult({ key: requestKey, products: items, error: "" });
        }
      })
      .catch((requestError) => {
        if (active) {
          setResult({
            key: requestKey,
            products: [],
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
  }, [cartKey, hasLines, requestKey]);

  async function submit(event) {
    event.preventDefault();
    setError("");

    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (
      !form.nombre.trim() ||
      !form.telefono.trim() ||
      (delivery === "envio" && (!form.direccion.trim() || !form.comuna.trim()))
    ) {
      setError("Completa los datos sin dejar campos en blanco.");
      return;
    }

    const branch =
      delivery === "retiro"
        ? branches.find((item) => item.id === form.sucursal)
        : null;
    if (delivery === "retiro" && !branch) {
      setError("Selecciona una sucursal de retiro válida.");
      return;
    }
    if (!lines.length) {
      setError("Tu carrito está vacío.");
      return;
    }
    if (form.payment === "rechazo") {
      navigate("/pago-error");
      return;
    }

    setBusy(true);
    try {
      const currentProducts = await Promise.all(
        lines.map((line) => productService.getById(line.id)),
      );
      const items = lines.map((line, index) => {
        const product = currentProducts[index];
        if (
          !Number.isInteger(line.quantity) ||
          line.quantity < 1 ||
          line.quantity > product.stock
        ) {
          throw new Error(
            `El stock de ${product.nombre} cambió. Revisa tu carrito.`,
          );
        }
        return {
          productoId: product.id,
          nombreProducto: product.nombre,
          precioUnitario: price(product),
          cantidad: line.quantity,
        };
      });
      const currentSubtotal = items.reduce(
        (sum, item) => sum + item.precioUnitario * item.cantidad,
        0,
      );
      const currentShipping =
        delivery === "retiro" || currentSubtotal >= 50000 ? 0 : shippingCost;
      const parsedUserId = Number(user?.id);
      const orderPayload = {
        usuarioId:
          Number.isSafeInteger(parsedUserId) && parsedUserId > 0
            ? parsedUserId
            : null,
        nombreCliente: form.nombre.trim(),
        correoCliente: form.correo.trim(),
        tipoEntrega: delivery,
        direccionEntrega:
          delivery === "envio"
            ? [form.direccion.trim(), form.comuna.trim(), form.region.trim()]
                .filter(Boolean)
                .join(", ")
            : null,
        sucursalRetiro: branch ? branch.address : null,
        costoEnvio: currentShipping,
        items,
      };
      const createdOrder = await orderService.crear(orderPayload);
      const orderId = createdOrder?.id ?? createdOrder?.ordenId;
      if (orderId === undefined || orderId === null) {
        throw new Error("La API creó la orden, pero no devolvió su identificador.");
      }
      await paymentService.process({
        ordenId: orderId,
        numeroOrden: createdOrder.numero || createdOrder.numeroOrden || `LU-${orderId}`,
        monto: createdOrder.total ?? currentSubtotal + currentShipping,
        metodoPago: form.payment === "credito" ? "CREDITO" : "WEBPAY",
      });
      if (cartId) await cartService.clear(cartId);

      try {
        db.setCart([]);
      } catch (storageError) {
        setNotice(
          `Pedido creado, pero no se pudo vaciar el carrito local: ${storageError.message}`,
        );
      }
      navigate("/compra-exitosa/" + encodeURIComponent(orderId));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "No se pudo crear el pedido.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!lines.length)
    return (
      <main className="container section">
        <Empty title="Agrega productos antes de continuar" />
      </main>
    );

  return (
    <main className="container section">
      <PageTitle
        eyebrow="CARRITO / ENTREGA / CONFIRMACIÓN"
        title="Ya casi es tuyo."
      >
        Completa los datos de entrega. Este pago es una simulación.
      </PageTitle>

      {loading ? (
        <p role="status">Validando productos y stock…</p>
      ) : loadError ? (
        <>
          <ErrorMessage
            message={`No se pudieron cargar los productos del carrito: ${loadError}`}
          />
          <button
            className="btn btn-lime"
            onClick={() => setRetry((attempt) => attempt + 1)}
          >
            Reintentar
          </button>
        </>
      ) : (
        <form onSubmit={submit} className="checkout-grid">
          <div className="panel">
            <h2>01. Tus datos</h2>
            {!user && (
              <p>
                ¿Ya tienes cuenta?{" "}
                <Link to="/login?next=/checkout">Ingresa para autocompletar</Link>
              </p>
            )}
            <div className="form-grid">
              <Field
                label="Nombre completo"
                name="nombre"
                defaultValue={user?.nombre}
                minLength={3}
                autoComplete="name"
              />
              <Field
                label="Correo electrónico"
                name="correo"
                type="email"
                defaultValue={user?.correo}
                autoComplete="email"
              />
              <Field
                label="Teléfono"
                name="telefono"
                type="tel"
                pattern="[+0-9 ()-]{8,18}"
                defaultValue={user?.telefono}
                autoComplete="tel"
              />
            </div>

            <h2 className="mt-4">02. ¿Cómo lo recibes?</h2>
            <label className="choice">
              <input
                type="radio"
                name="delivery"
                value="retiro"
                checked={delivery === "retiro"}
                onChange={() => setDelivery("retiro")}
              />{" "}
              Retiro en cafetería · Gratis
            </label>
            <label className="choice">
              <input
                type="radio"
                name="delivery"
                value="envio"
                checked={delivery === "envio"}
                onChange={() => setDelivery("envio")}
              />{" "}
              Envío a domicilio · {money(subtotal >= 50000 ? 0 : shippingCost)}
            </label>

            {delivery === "envio" ? (
              <div className="form-grid">
                <Field
                  label="Dirección y número"
                  name="direccion"
                  defaultValue={user?.direccion}
                  autoComplete="street-address"
                />
                <Field label="Comuna" name="comuna" defaultValue={user?.comuna} />
                <Field
                  label="Región"
                  name="region"
                  defaultValue="Metropolitana"
                />
              </div>
            ) : (
              <>
                <label className="field">
                  Sucursal de retiro
                  <select className="form-select" name="sucursal" required>
                    {branches.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.address}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="muted">
                  Retiro sin costo. Horario de atención: {openingHours}. Te
                  avisaremos cuando el pedido esté listo.
                </p>
              </>
            )}

            <h2 className="mt-4">03. Elegir simulación</h2>
            <label className="field">
              Resultado de la simulación
              <select className="form-select" name="payment">
                <option value="exito">Simular pago aprobado</option>
                <option value="rechazo">Simular pago rechazado</option>
              </select>
            </label>
            <label className="choice">
              <input type="checkbox" required /> Acepto los{" "}
              <Link to="/terminos">términos</Link>.
            </label>
            <ErrorMessage message={error} />
          </div>

          <aside className="summary">
            <h2>Tu selección</h2>
            {lines.map((line) => (
              <p key={line.id}>
                <span>
                  {products.find(
                    (product) => String(product.id) === String(line.id),
                  )?.nombre || "No disponible"}{" "}
                  ×{line.quantity}
                </span>
              </p>
            ))}
            <hr />
            <p>
              <span>Productos</span>
              <b>{money(subtotal)}</b>
            </p>
            <p>
              <span>Entrega</span>
              <b>{money(shipping)}</b>
            </p>
            <p className="total">
              <span>Total</span>
              <b>{money(subtotal + shipping)}</b>
            </p>
            <button className="btn btn-lime w-100" disabled={busy}>
              {busy ? "Procesando…" : "Confirmar compra simulada"} &rarr;
            </button>
            <small>No se solicitarán tarjetas ni se realizarán cobros.</small>
          </aside>
        </form>
      )}
    </main>
  );
}
