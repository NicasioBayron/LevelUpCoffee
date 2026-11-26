import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Catalog } from "../src/pages/index.js";
import { Provider } from "../src/Store.jsx";
import { db } from "../src/database.js";

describe("Listado de productos", () => {
    const productos = [
        {
            id: 1,
            nombre: "Catan",
            descripcion: "Juego de esttrategia",
            categoria: "Estrategia",
            tipo: "juego",
            precio: 30000,
            descuento: 0,
            stock: 5,
            imagen: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
        },
        {
            id: 2,
            nombre: "Exploding Kittens",
            descripcion: "Juego de cartas",
            categoria: "Cartas",
            tipo: "juego",
            precio: 15000,
            descuento: 0,
            stock: 8,
            imagen: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
        }
    ];
    beforeEach(() => {
        spyOn(db, "list").and.callFake((tabla) => {
            return tabla === "products" ? productos : [];
        });
        spyOn(db, "get").and.returnValue(undefined);
    });
    afterEach(() => {
        cleanup();
    });

    it("Renderiza todos los productos", () => {
        render(
            <MemoryRouter initialEntries={["/tienda"]}>
                <Provider>
                    <Catalog />
                </Provider>
            </MemoryRouter>,
        );
        const tarjetas = screen.getAllByRole("article");
        expect(tarjetas.length).toBe(productos.length);
    });
    it("Muestra los nombres de los productos", () => {
        render(
            <MemoryRouter initialEntries={["/tienda"]}>
                <Provider>
                    <Catalog />
                </Provider>
            </MemoryRouter>
        );
        productos.forEach((productos) => {
            const nombre = screen.getAllByText(productos.nombre);
            expect(nombre).not.toBeNull();
        });
    });
    it("Muestra estado vacio si no hay productos", () => {
        db.list.and.returnValue([]);
        render(
            <MemoryRouter initialEntries={["/tienda"]}>
                <Provider>
                    <Catalog />
                </Provider>
            </MemoryRouter>,
        );
        const tarjetas = screen.queryAllByRole("article");
        expect(tarjetas.length).toBe(0);
        const mensaje = screen.getByText("No encontramos coincidencias");
        expect(mensaje).not.toBeNull();
    });
});
