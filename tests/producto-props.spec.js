import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ProductCard } from "../src/components/index.js";
import { Provider } from "../src/Store.jsx";
import { db } from "../src/database.js";

describe("Propiedas de la tarjeta de producto", () => {
    const producto = {
        id: 1,
    nombre: "Catan de prueba",
    descripcion: "Juego de estrategia",
    categoria: "Estrategia",
    tipo: "juego",
    precio: 10000,
    descuento: 0,
    stock: 5,
    imagen:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
    };

    beforeEach(() => {
        spyOn(db, "get").and.returnValue(undefined);
        render(
            <MemoryRouter>
                <Provider>
                    <ProductCard product={producto} />
                </Provider>
            </MemoryRouter>
        );
    });
    afterEach(() => {
        cleanup();
    });
    it("Muestra el nombre del producto recibido", () => {
        const nombre = screen.getByText(producto.nombre);
        expect(nombre.textContent).toBe(producto.nombre);
    });
    it("Utiliza la imagen y el texto alternativo del producto", () => {
        const imagen = screen.getByRole("img", {
            name: producto.nombre,
        });
        expect(imagen.getAttribute("src")).toBe(producto.imagen);
        expect(imagen.getAttribute("alt")).toBe(producto.nombre);
    });
    it("muestra el precio del producto en pesos chilenos", () => {
        const precio = screen.getByText("$10.000");
        expect(precio.textContent).toBe("$10.000")
    });
});
