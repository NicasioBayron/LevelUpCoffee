import React from "react";

export function Quantity({ value, onChange, max = 99 }) {
  return (
    <div className="quantity">
      <button
        aria-label="Disminuir cantidad"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label="Aumentar cantidad"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}