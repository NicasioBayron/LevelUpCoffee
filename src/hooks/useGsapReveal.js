import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapReveal({ y = 24, duration = 0.6, delay = 0 } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        { y: 0, opacity: 1, duration, delay, ease: "power2.out", clearProps: "transform" }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, duration, y]);

  return ref;
}
