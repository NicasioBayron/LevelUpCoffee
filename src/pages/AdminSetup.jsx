import React, { useState } from "react";
import { db, passwordHash } from "../database";
import { useShop } from "../Store";
import { Empty, Field, ErrorMessage } from "../components";

export function AdminSetup() {
  const { login, setNotice } = useShop();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);

  if (db.list("users").some((u) => u.role === "admin"))
    return (
      <Empty
        title="Acceso administrativo"
        text="Ingresa con una cuenta administradora para continuar."
        to="/login?next=/admin"
        action="Ingresar"
      />
    );

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const f = Object.fromEntries(new FormData(e.currentTarget));
      if (f.nombre.trim().length < 3) throw Error("Ingresa un nombre válido.");
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(f.password))
        throw Error("Usa 8 caracteres, una mayúscula y un número.");
      if (
        db.list("users").some((u) => u.correo === f.correo.trim().toLowerCase())
      )
        throw Error(
          "El correo ya está registrado. Usa otro correo para la cuenta administradora.",
        );
      const salt = crypto.randomUUID();
      const user = db.create("users", {
        nombre: f.nombre.trim(),
        correo: f.correo.trim().toLowerCase(),
        role: "admin",
        salt,
        password: await passwordHash(f.password, salt),
      });
      login(user.id);
      setNotice("Cuenta administradora local creada.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="setup panel">
      <h2>Prepara tu demostración</h2>
      <p>
        Este navegador aún no tiene administrador. Crea la cuenta inicial para
        gestionar el proyecto. El acceso es local y demostrativo.
      </p>
      <form onSubmit={submit}>
        <Field label="Nombre" name="nombre" minLength={3} />
        <Field label="Correo" name="correo" type="email" />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          minLength={8}
        />
        <small>8 caracteres, una mayúscula y un número.</small>
        <ErrorMessage message={error} />
        <button className="btn btn-lime mt-3" disabled={busy}>
          Crear administrador local
        </button>
      </form>
    </div>
  );
}