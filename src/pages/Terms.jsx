import React from "react";
import { PageTitle } from "../components";

export function Terms() {
  return (
    <main className="container section prose">
      <PageTitle title="Términos y privacidad" />
      <h2>Demostración académica</h2>
      <p>
        Level Up Coffee Bar es un prototipo de frontend. Los pedidos, pagos,
        reservas y mensajes son simulados. No se realizan cobros, envíos,
        reservas confirmadas ni comunicaciones externas.
      </p>
      <h2>Datos en tu navegador</h2>
      <p>
        El catálogo, carrito, perfiles, mensajes y pedidos se guardan en
        localStorage de este navegador. La sesión se guarda en sessionStorage.
        No se comparten entre equipos. No ingreses datos personales reales ni
        contraseñas reutilizadas.
      </p>
      <h2>Productos y entrega</h2>
      <p>
        Precios en pesos chilenos. Retiro gratis y envío simulado de $3.990;
        gratis desde $50.000. Disponibilidad sujeta al stock local. Las imágenes
        sónicas son referenciales.
      </p>
      <h2>Control de datos</h2>
      <p>
        Puedes borrar los datos del sitio desde los ajustes de almacenamiento de
        tu navegador. Esto también elimina el historial local. La autenticación
        y el rol administrativo son demostrativos; se requiere un servidor para
        un uso real.
      </p>
    </main>
  );
}