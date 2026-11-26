
import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { Quantity } from "../src/components/index.js";

describe("Botones de cantidad", () => {
  let onChange;

  beforeEach(() => {
    onChange = jasmine.createSpy("onChange");
  });

  afterEach(() => {
    cleanup();
  });

  it("Aumentar llama a onChange con el valor siguiente", () => {
    render(<Quantity value={2} onChange={onChange} max={5} />);

    const boton = screen.getByRole("button", {
      name: "Aumentar cantidad",
    });

    fireEvent.click(boton);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("Disminuir llama a onChange con el valor anterior", () => {
    render(<Quantity value={2} onChange={onChange} max={5} />);

    const boton = screen.getByRole("button", {
      name: "Disminuir cantidad",
    });

    fireEvent.click(boton);

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("En el máximo no llama a onChange", () => {
    render(<Quantity value={5} onChange={onChange} max={5} />);

    const boton = screen.getByRole("button", {
      name: "Aumentar cantidad",
    });

    expect(boton.disabled).toBe(true);

    fireEvent.click(boton);

    expect(onChange).not.toHaveBeenCalled();
  });
});
