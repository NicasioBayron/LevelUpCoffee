import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function PaymentAnimation({ failed = false }) {
  const ref = useRef(null);
  const symbols = failed
    ? ["❌", "✖️", "❌", "💥", "✖️", "❌", "🚫", "✖️", "❌", "💢", "✖️", "❌"]
    : ["✅", "✔️", "🎉", "✅", "⭐", "✔️", "🥳", "✅", "✨", "🎊", "✔️", "✅", "🏆", "🎉"];

  useLayoutEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();
      timeline.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.12 });
      timeline.fromTo(ref.current.children, { y: 40, scale: 0.15, opacity: 0, rotation: 0 }, {
        y: () => gsap.utils.random(-window.innerHeight - 160, -window.innerHeight * 0.35),
        x: (index) => (index - symbols.length / 2) * gsap.utils.random(55, 105),
        rotation: () => gsap.utils.random(-720, 720),
        scale: () => gsap.utils.random(0.85, 1.65),
        opacity: 1,
        duration: () => gsap.utils.random(1.7, 3.1),
        stagger: 0.07,
        ease: "back.out(1.7)",
      }, 0.05);
      timeline.to(ref.current.children, {
        scale: () => gsap.utils.random(0.7, 1.2),
        yoyo: true,
        repeat: 1,
        duration: 0.22,
        stagger: 0.04,
        ease: "power1.inOut",
      }, "<0.35");
      timeline.to(ref.current, { opacity: 0, duration: 0.4 }, "-=0.35");
      if (failed) timeline.to(document.body, { x: -8, duration: 0.06, repeat: 5, yoyo: true, ease: "power1.inOut" }, 0.05);
    }, ref);
    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={`payment-animation ${failed ? "payment-animation-failed" : ""}`} aria-hidden="true">
    {symbols.map((symbol, index) => <span key={`${symbol}-${index}`}>{symbol}</span>)}
  </div>;
}
