import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Quantity } from "../src/components/index.js";

describe("Propiedades del selector de cantidad", () => {
    afterEach(() => {
        cleanup();
    });
    it("Muestra la cantidad recibida", () => {
        render(
            <Quantity value={3} max={5} onChange={() => {}} />,
        );
        const cantidad = screen.getByText("3");
        expect(cantidad.textContent).toBe("3");
    });
    it("Deshailitar disminuir cuando el valor es 1", () => {
        render(
            <Quantity value={1} max={5} onChange={() => {}} />,
        );
        const boton = screen.getByRole("button", {
            name: "Disminuir cantidad",
        });
        expect(boton.disabled).toBe(true);
    });
    it("Deshabilita aumentar cuando el valor es el maximo", () => {
        render(
            <Quantity value={5} max={5} onChange={() => {}} />,
        );
        const boton = screen.getByRole("button", {
            name: "Aumentar cantidad",
        });
        expect(boton.disabled).toBe(true);
    });
});
