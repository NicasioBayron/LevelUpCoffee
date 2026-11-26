import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

import { ErrorMessage } from "../src/components/index.js";

describe("Mensaje de error", () => {
    afterEach(() => {
        cleanup();
    });

    it("muestra mensaje cuando existe un error", () => {
        render(<ErrorMessage message="El RUN no es válido" />);
        const alerta = screen.getByRole("alert");
        expect(alerta.textContent).toBe("El RUN no es válido");
    });
    it("No muestra alerta si el mensaje esta vacio", () => {
        render(<ErrorMessage message="" />);
        const alerta = screen.queryByRole("alert");
        expect(alerta).toBeNull();
    });
    it("Actualiza el mensaje al cambiar el prop", () => {
        const { rerender } = render(
            <ErrorMessage message="El RUN no es válido" />,
        );
        expect(screen.getByRole("alert").textContent)
        .toBe("El RUN no es válido");
        rerender(
            <ErrorMessage message="Las contraseñas no coinciden" />,
        );
        expect(screen.getByRole("alert").textContent)
        .toBe("Las contraseñas no coinciden");
    });
});
