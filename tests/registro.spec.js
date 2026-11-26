import React from "react";
import { 
    render, 
    screen,
    fireEvent,
    cleanup, 
    waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Auth } from "../src/pages/index.js";
import { Provider } from "../src/Store.jsx";
import { db } from "../src/database.js";

describe("Formulario de registro", () => {
    const usuario = {
        nombre: "Ana",
        run: "12.345.678-5",
        correo: "ana@ejemplo.com",
        password: "Clave123",
        confirm: "Clave123",
    };

    let listSpy;
    let createSpy;

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();

        listSpy = spyOn(db, "list").and.returnValue([]);
        createSpy = spyOn(db, "create").and.returnValue({
            id: "usuario-test",
            ...usuario,
            role: "cliente",
        });
    }); 

    afterEach(() => {
        cleanup();
        localStorage.clear();
        sessionStorage.clear();
    });

    function mostrarRegistro() {
        render(
            <MemoryRouter initialEntries={["/registro"]}>
                <Provider>
                    <Auth register />
                </Provider>
            </MemoryRouter>
        );
    }

    it("Muestra un error cuando el RUN es inválido", async () => {
        mostrarRegistro();
        const nombre = screen.getByRole("textbox", {
            name: "Nombre completo",
        });
        const run = screen.getByRole("textbox", {
            name: "RUN",
        });
        const correo = screen.getByRole("textbox", {
            name: "Correo electrónico",
        });

        const password = screen.getByLabelText("Contraseña");
        const confirm = screen.getByLabelText("Confirma la contraseña");

        fireEvent.change(nombre, {
            target: { value: "Ana Pérez" },
        });
        fireEvent.change(correo, {
            target: { value: "ana@ejemplo.com" },
        });
        fireEvent.change(password, {
            target: { value: "Clave123" },
        });
        fireEvent.change(confirm, {
            target: { value: "Clave123" },
        });
        fireEvent.change(run, {
            target: { value: "12.345.678-9" },
        });

        const formulario = run.closest("form");
        fireEvent.submit(formulario);

        await waitFor(() => {
            expect(screen.getByRole("alert").textContent).toContain(
            "El RUN no es válido.",
            );
        });
    });

    it("Muestra un error cuando las contraseñas no coinciden", async () => {
        mostrarRegistro();

        fireEvent.change(screen.getByRole("textbox", {
            name: "Nombre completo",
        }), {
            target: { value: "Ana Pérez" },
        });
        fireEvent.change(screen.getByRole("textbox", {
            name: "RUN",
        }), {
            target: { value: "12.345.678-5" },
        });
        fireEvent.change(screen.getByRole("textbox", {
            name: "Correo electrónico",
        }), {
            target: { value: "ana@ejemplo.com"},
        });
        fireEvent.change(screen.getByLabelText("Contraseña"), {
            target: { value: "Clave123" },
        });
        fireEvent.change(screen.getByLabelText("Confirma la contraseña"), {
            target: { value: "OtraClave456" },
        });
        
        const formulario = screen.getByLabelText("Contraseña").closest("form");
        fireEvent.submit(formulario);

        await waitFor(() => {
            expect(screen.getByRole("alert").textContent).toContain(
                "Las contraseñas no coinciden.",
            );
        });
    });

    it("Crea un usuario con datos válidos", async () => {
        mostrarRegistro();

        fireEvent.change(screen.getByRole("textbox", {
            name: "Nombre completo",
        }), {
            target: { value: "Ana Pérez" },
        });
        fireEvent.change(screen.getByRole("textbox", {
            name: "RUN",
        }), {
            target: { value: "12.345.678-5" },
        });
        fireEvent.change(screen.getByRole("textbox", {
            name: "Correo electrónico",
        }), {
            target: { value: "ana@ejemplo.com" },
        });
        fireEvent.change(screen.getByLabelText("Contraseña"), {
            target: { value: "Clave123" },
        });
        fireEvent.change(screen.getByLabelText("Confirma la contraseña"), {
            target: { value: "Clave123" },
        });
        fireEvent.click(screen.getByRole("checkbox", {
            name: /Acepto los términos y privacidad/i,
        }),
    );

        const checkbox = screen.getByRole("checkbox", {
            name: /Acepto los términos y privacidad/i,
        });

        expect(checkbox.checked).toBe(true);

        const formulario = checkbox.closest("form");
        fireEvent.submit(formulario);

        await new Promise((resolve) => setTimeout(resolve, 50));

        const alerta = screen.queryByRole("alert");

        if (alerta) {
            console.log("Error real del registro:", alerta.textContent);
        }

        expect(createSpy).toHaveBeenCalled();

        expect(createSpy).toHaveBeenCalledWith(
            "users",
            jasmine.objectContaining({
                nombre: "Ana Pérez",
                correo: "ana@ejemplo.com",
                run: "12.345.678-5",
                role: "cliente",
            }),
        );
    });
});
