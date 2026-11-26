import React from "react";  
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "../src/components/index.js";
import { Provider } from "../src/Store.jsx";
import { db } from "../src/database.js";

describe("Botón de agregar producto", () => {
  const producto = {
    id: "cafe-test",
    nombre: "Café de prueba",
    categoria: "Cafetería",
    imagen: "/cafe-test.jpg",
    precio: 3500,
    descuento: 0,
    stock: 5,
  };

  let guardarCarrito;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    guardarCarrito = spyOn(db, "setCart").and.stub();
    spyOn(db, "list").and.returnValue([]);
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear();
  });

  function mostrarProducto(p) {
    render(
      <MemoryRouter>
        <Provider>
          <ProductCard product={p} />
        </Provider>
      </MemoryRouter>
    );
  }

  it("Tiene una etiqueta que identifica el producto", () => {
    mostrarProducto(producto);

    const boton = screen.getByRole("button", {
      name: "Añadir Café de prueba",
    });

    expect(boton).toBeTruthy();
  });

  it("Al pulsarlo agrega el producto correcto", () => {
    mostrarProducto(producto);

    const boton = screen.getByRole("button", {
      name: "Añadir Café de prueba",
    });

    fireEvent.click(boton);

    expect(guardarCarrito).toHaveBeenCalledWith([
      { id: "cafe-test", quantity: 1 },
    ]);
  });

  it("Sin stock está deshabilitado y no agrega", () => {
    mostrarProducto({ ...producto, stock: 0 });

    const boton = screen.getByRole("button", {
      name: "Añadir Café de prueba",
    });

    expect(boton.disabled).toBe(true);

    fireEvent.click(boton);

    expect(guardarCarrito).not.toHaveBeenCalled();
  });
});
