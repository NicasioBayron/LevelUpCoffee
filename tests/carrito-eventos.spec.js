import React from "react";
import { 
    render, 
    screen,
    fireEvent,
    cleanup, 
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Cart } from "../src/pages/index.js";
import { Provider } from "../src/Store.jsx";
import { db } from "../src/database.js";

describe("Acciones del carrito", () => {
    const producto = {
        id: "catan-test",
        nombre: "Catan de Prueba",
        descripcion: "Juego de prueba",
        categoria: "Juego",
        precio: 10000,
        descuento: 0,
        stock: 5,
        imagen: "/img/catan.jpg",
    };
    
    let listSpy;
    let setCartSpy;

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();

        listSpy = spyOn(db, "list").and.callFake((tabla) => {
            if (tabla === "products") {
                return [producto];
            }

            if (tabla === "cart") {
                return [{ id: producto.id, quantity: 1 }];
            }

            return [];
        });

        setCartSpy = spyOn(db, "setCart").and.stub();
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
        sessionStorage.clear();
    });

    function mostrarCarrito() {
        render(
            <MemoryRouter initialEntries={["/carrito"]}>
                <Provider>
                    <Cart />
                </Provider>
            </MemoryRouter>
        );
    }

    it("Aumentar una cantidad actualiza el carrito", () => {
        mostrarCarrito();

        const botonAumentar = screen.getByRole("button", {
            name: "Aumentar cantidad",
        });

        fireEvent.click(botonAumentar);

        expect(setCartSpy).toHaveBeenCalledWith([
            { id: producto.id, quantity: 2 },
        ]);
    });

    it("Eliminar una línea quita el producto del carrito", () => {
        mostrarCarrito();

        const botonEliminar = screen.getByRole("button", {
            name: "Eliminar del carrito",
        });

        fireEvent.click(botonEliminar);

        expect(setCartSpy).toHaveBeenCalledWith([]);
    });

    it("Muestra el carrito vacío cuando no hay productos", () => {
        listSpy.and.callFake((tabla) => {
            if (tabla === "products") {
                return [producto];
            }

            if (tabla === "cart") {
                return [];
            }

            return [];
        });

        mostrarCarrito();

        expect(
            screen.getByText("Tu carrito está esperando una aventura")
        ).toBeTruthy();
    });
}); 
