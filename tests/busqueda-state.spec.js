
import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Catalog } from "../src/pages/index.js";
import { Provider } from "../src/Store.jsx";
import { db } from "../src/database.js";

describe("Búsqueda del catálogo", () => {
  let listSpy;

  const productos = [
    {
      id: "test-catan",
      nombre: "Catan",
      descripcion: "Juego de estrategia",
      categoria: "Mesa",
      tipo: "juego",
      precio: 29990,
      descuento: 0,
      stock: 5,
      imagen: "/img/catan.png",
    },
    {
      id: "test-ajedrez",
      nombre: "Ajedrez",
      descripcion: "Juego de tablero",
      categoria: "Mesa",
      tipo: "juego",
      precio: 15990,
      descuento: 0,
      stock: 3,
      imagen: "/img/ajedrez.png",
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    listSpy = spyOn(db, "list").and.callFake((tabla) => {
      if (tabla === "products") return [...productos];
      return [];
    });
  });

  afterEach(() => {
    cleanup();
    listSpy.and.callThrough();
    localStorage.clear();
    sessionStorage.clear();
  });

  function mostrarCatalogo() {
    render(
      <MemoryRouter initialEntries={["/tienda"]}>
        <Provider>
          <Catalog />
        </Provider>
      </MemoryRouter>
    );
  }

  it("Escribir un nombre filtra los resultados", () => {
    mostrarCatalogo();

    const buscador = screen.getByRole("textbox", {
      name: "Buscar productos",
    });

    fireEvent.change(buscador, {
      target: { value: "Catan" },
    });

    expect(screen.getByText("Catan")).toBeTruthy();
    expect(screen.queryByText("Ajedrez")).toBeNull();
    expect(screen.getByText("1 productos encontrados")).toBeTruthy();
  });

  it("Una búsqueda sin coincidencias muestra el mensaje", () => {
    mostrarCatalogo();

    const buscador = screen.getByRole("textbox", {
      name: "Buscar productos",
    });

    fireEvent.change(buscador, {
      target: { value: "xyzproducto999" },
    });

    expect(
      screen.getByText("No encontramos coincidencias")
    ).toBeTruthy();
  });

  it("Borrar la búsqueda recupera el listado inicial", () => {
    mostrarCatalogo();

    const buscador = screen.getByRole("textbox", {
      name: "Buscar productos",
    });

    fireEvent.change(buscador, {
      target: { value: "Catan" },
    });

    expect(screen.queryByText("Ajedrez")).toBeNull();

    fireEvent.change(buscador, {
      target: { value: "" },
    });

    expect(screen.getByText("Catan")).toBeTruthy();
    expect(screen.getByText("Ajedrez")).toBeTruthy();
    expect(screen.getByText("2 productos encontrados")).toBeTruthy();
  });
});
