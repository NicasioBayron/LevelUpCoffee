import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function PageTitle({ eyebrow, title, children }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, [title]);
  return (
    <div ref={ref} className="page-title">
      <div className="eyebrow">{eyebrow || "LEVEL UP / EXPLORA"}</div>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
