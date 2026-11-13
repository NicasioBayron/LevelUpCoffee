import React, { useState } from "react";
import { db } from "../database";
import { useShop } from "../Store.jsx";
import { PageTitle, Empty, Field, ErrorMessage } from "../components";
import { Receipt } from "./PaymentResult";

export function Profile() {
  const { user, setNotice } = useShop(),
    [error, setError] = useState("");

  if (!user)
    return (
      <main className="container section">
        <Empty
          title="Tu espacio en Level Up"
          text="Ingresa para ver tu perfil y tu historial de compras."
          to="/login"
          action="Ingresar"
        />
      </main>
    );

  function save(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (f.nombre.trim().length < 3) throw Error("Ingresa un nombre válido.");
      db.update("users", user.id, f);
      setNotice("Perfil actualizado.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  const orders = db.list("orders").filter((o) => o.userId === user.id);

  return (
    <main className="container section">
      <PageTitle title={`Tu espacio, ${user.nombre.split(" ")[0]}.`}>
        Datos guardados para tu próxima visita.
      </PageTitle>
      <form className="panel mb-5" onSubmit={save}>
        <h2>Mi perfil</h2>
        <div className="form-grid">
          <Field
            label="Nombre completo"
            name="nombre"
            defaultValue={user.nombre}
            minLength={3}
          />
          <Field
            label="Teléfono"
            name="telefono"
            defaultValue={user.telefono}
            required={false}
          />
          <Field
            label="Dirección"
            name="direccion"
            defaultValue={user.direccion}
            required={false}
          />
          <Field
            label="Comuna"
            name="comuna"
            defaultValue={user.comuna}
            required={false}
          />
        </div>
        <ErrorMessage message={error} />
        <button className="btn btn-lime">Guardar cambios</button>
      </form>
      <h2 className="mb-4">Mis compras</h2>
      {orders.length ? (
        orders
          .slice()
          .reverse()
          .map((o) => <Receipt key={o.id} order={o} />)
      ) : (
        <Empty title="Tu primera aventura está por comenzar" />
      )}
    </main>
  );
}