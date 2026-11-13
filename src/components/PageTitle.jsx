import React from "react";

export function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="page-title">
      <div className="eyebrow">{eyebrow || "LEVEL UP / EXPLORA"}</div>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}