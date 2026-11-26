
import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Contact } from "../src/pages/index.js";
import { Provider } from "../src/Store.jsx";

describe("Edición del formulario de contacto", () => {

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear();
  });

  function mostrarFormulario() {
    render(
      <MemoryRouter>
        <Provider>
          <Contact />
        </Provider>
      </MemoryRouter>
    );
  }

  it("Empieza con los campos vacíos", () => {
    mostrarFormulario();

    const nombre = screen.getByRole("textbox", {
      name: "Nombre",
    });

    const correo = screen.getByRole("textbox", {
      name: "Correo",
    });

    expect(nombre.value).toBe("");
    expect(correo.value).toBe("");
  });

  it("Escribir un nombre actualiza ese campo", () => {
    mostrarFormulario();

    const nombre = screen.getByRole("textbox", {
      name: "Nombre",
    });

    fireEvent.change(nombre, {
      target: { value: "Eileen" },
    });

    expect(nombre.value).toBe("Eileen");
  });

  it("Escribir un correo no borra el nombre", () => {
    mostrarFormulario();

    const nombre = screen.getByRole("textbox", {
      name: "Nombre",
    });

    const correo = screen.getByRole("textbox", {
      name: "Correo",
    });

    fireEvent.change(nombre, {
      target: { value: "Eileen" },
    });

    fireEvent.change(correo, {
      target: { value: "eileen@ejemplo.com" },
    });

    expect(nombre.value).toBe("Eileen");
    expect(correo.value).toBe("eileen@ejemplo.com");
  });
});
