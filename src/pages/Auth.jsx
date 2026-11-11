import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { db, passwordHash, validRun } from "../database";
import { imageUrl } from "../imageUrl";
import { useShop } from "../store";
import { Field, ErrorMessage } from "../components";

export function Auth({ register = false }) {
  const { login } = useShop(),
    navigate = useNavigate(),
    [params] = useSearchParams();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget));
    f.correo = f.correo.trim().toLowerCase();
    try {
      const users = db.list("users");
      let user = users.find((u) => u.correo === f.correo);
      if (register) {
        if (!f.nombre.trim() || f.nombre.trim().length < 3)
          throw Error("Ingresa tu nombre completo.");
        if (!validRun(f.run)) throw Error("El RUN no es válido.");
        if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(f.password))
          throw Error("Usa al menos 8 caracteres, una mayúscula y un número.");
        if (f.password !== f.confirm)
          throw Error("Las contraseñas no coinciden.");
        if (user) throw Error("Ese correo ya está registrado.");
        const salt = crypto.randomUUID();
        user = db.create("users", {
          nombre: f.nombre.trim(),
          correo: f.correo,
          run: f.run,
          role: "cliente",
          salt,
          password: await passwordHash(f.password, salt),
          direccion: f.direccion.trim(),
          comuna: f.comuna.trim(),
          telefono: f.telefono.trim(),
        });
      } else if (
        !user ||
        user.password !== (await passwordHash(f.password, user.salt))
      )
        throw Error("Correo o contraseña incorrectos.");
      login(user.id);
      const next = params.get("next");
      navigate(
        next?.startsWith("/") && !next.startsWith("//") ? next : "/perfil",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container section auth-layout">
      <div>
        <div className="eyebrow">TU EQUIPO TE ESPERA</div>
        <h1>
          {register
            ? "Cada gran partida empieza contigo."
            : "Qué bueno verte de vuelta."}
        </h1>
        <p>
          Guarda tus datos, revisa tus pedidos y prepárate para el siguiente
          nivel.
        </p>
        <img
          src={imageUrl("/img/cafegamer.png")}
          alt="Café con espíritu gamer"
        />
      </div>
      <form className="panel" onSubmit={submit}>
        <h2>{register ? "Crea tu cuenta" : "Ingresa a Level Up"}</h2>
        {register && (
          <>
            <Field
              label="Nombre completo"
              name="nombre"
              minLength={3}
              autoComplete="name"
            />
            <Field label="RUN" name="run" placeholder="12.345.678-5" />
          </>
        )}
        <Field
          label="Correo electrónico"
          name="correo"
          type="email"
          autoComplete="email"
        />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          minLength={8}
          autoComplete={register ? "new-password" : "current-password"}
        />
        {register && (
          <>
            <small>Al menos 8 caracteres, una mayúscula y un número.</small>
            <Field
              label="Confirma la contraseña"
              name="confirm"
              type="password"
              minLength={8}
              autoComplete="new-password"
            />
            <Field
              label="Teléfono (opcional)"
              name="telefono"
              required={false}
            />
            <Field
              label="Dirección (opcional)"
              name="direccion"
              required={false}
            />
            <Field label="Comuna (opcional)" name="comuna" required={false} />
            <label className="choice">
              <input type="checkbox" required /> Acepto los{" "}
              <Link to="/terminos">términos y privacidad</Link>.
            </label>
          </>
        )}
        <ErrorMessage message={error} />
        <button className="btn btn-lime w-100 mt-3" disabled={busy}>
          {busy ? "Un momento…" : register ? "Crear mi cuenta" : "Ingresar"}{" "}
          &rarr;
        </button>
        <p className="mt-4">
          {register ? "¿Ya eres parte del equipo?" : "¿Primera vez por aquí?"}{" "}
          <Link
            to={
              (register ? "/login" : "/registro") +
              (params.get("next")
                ? "?next=" + encodeURIComponent(params.get("next"))
                : "")
            }
          >
            {register ? "Ingresa" : "Crea una cuenta"}
          </Link>
        </p>
      </form>
    </main>
  );
}