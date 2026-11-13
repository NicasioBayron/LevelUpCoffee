import React, { useState } from "react";
import { Locations } from "../components/Locations";
import { db } from "../database";
import { useShop } from "../Store";
import { PageTitle, Field, ErrorMessage } from "../components";

export function Contact() {
  const { user, setNotice } = useShop();
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    try {
      const f = Object.fromEntries(new FormData(e.currentTarget));
      if (f.nombre.trim().length < 3 || f.mensaje.trim().length < 10)
        throw Error(
          "Escribe tu nombre y un mensaje de al menos 10 caracteres.",
        );
      db.create("messages", {
        ...f,
        date: new Date().toISOString(),
        status: "Nuevo",
      });
      e.currentTarget.reset();
      setError("");
      setNotice("Mensaje enviado. ¡Gracias por contactarnos!");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container section">
      <PageTitle
        eyebrow="TIENDA FÍSICA / CAFETERÍA / CONTACTO"
        title="Tu próxima partida tiene lugar."
      >
        Encuéntranos en Santiago y Ñuñoa. Ven por un café, descubre un juego y
        quédate a compartir.
      </PageTitle>
      <Locations />
      <section
        className="contact-form-section"
        aria-label="Formulario de contacto"
      >
        <div className="page-title">
          <div className="eyebrow">HABLEMOS</div>
          <h2>Conversemos entre partidas.</h2>
          <p>Cuéntanos tu idea, consulta o propuesta para la comunidad.</p>
        </div>
        <div className="checkout-grid">
          <form className="panel" onSubmit={submit}>
            <Field
              label="Nombre"
              name="nombre"
              defaultValue={user?.nombre}
              minLength={3}
            />
            <Field
              label="Correo"
              name="correo"
              type="email"
              defaultValue={user?.correo}
            />
            <label className="field">
              Tu mensaje
              <textarea
                className="form-control"
                name="mensaje"
                rows="6"
                required
                minLength={10}
              />
            </label>
            <ErrorMessage message={error} />
            <button className="btn btn-lime">
              Enviar mensaje &rarr;
            </button>
          </form>
          <aside className="summary">
            <h2>Una mesa para tus ideas</h2>
            <p>
              ¿Un encuentro de tu comunidad? ¿Una consulta sobre juegos? Te
              escuchamos.
            </p>
            <small>
              Para hablar directamente con una sucursal, usa los teléfonos
              indicados junto a los mapas.
            </small>
          </aside>
        </div>
      </section>
    </main>
  );
}