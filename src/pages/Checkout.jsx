import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, money, price } from "../database";
import { branches, openingHours } from "../locations";
import { useShop } from "../Store.jsx";
import { PageTitle, Empty, Field, ErrorMessage } from "../components";

export function Checkout() {
  const { user } = useShop(),
    navigate = useNavigate();
  const [delivery, setDelivery] = useState("retiro"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);

  const lines = db.list("cart"),
    products = db.list("products");

  const subtotal = lines.reduce(
      (s, l) =>
        s +
        (products.find((p) => p.id === l.id)
          ? price(products.find((p) => p.id === l.id)) * l.quantity
          : 0),
      0,
    ),
    shipping = delivery === "retiro" || subtotal >= 50000 ? 0 : 3990;

  function submit(e) {
    e.preventDefault();
    setError("");
    const form = Object.fromEntries(new FormData(e.currentTarget));
    if (
      !form.nombre.trim() ||
      !form.telefono.trim() ||
      (delivery === "envio" && (!form.direccion.trim() || !form.comuna.trim()))
    ) {
      setError("Completa los datos sin dejar campos en blanco.");
      return;
    }
    setBusy(true);
    try {
      if (form.payment === "rechazo") {
        navigate("/pago-error");
        return;
      }
      const order = db.checkout(form, delivery, user?.id || null);
      navigate("/compra-exitosa/" + order.id);
    } catch (err) {
      setError(err.message);
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
              checked={delivery === "retiro"}
              onChange={() => setDelivery("retiro")}
            />{" "}
            Retiro en cafetería · Gratis
          </label>
          <label className="choice">
            <input
              type="radio"
              checked={delivery === "envio"}
              onChange={() => setDelivery("envio")}
            />{" "}
            Envío a domicilio · {money(subtotal >= 50000 ? 0 : 3990)}
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
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.address}
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
          {lines.map((l) => (
            <p key={l.id}>
              <span>
                {products.find((p) => p.id === l.id)?.nombre || "No disponible"}{" "}
                ×{l.quantity}
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
    </main>
  );
}