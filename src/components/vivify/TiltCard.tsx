import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  as?: "div" | "article";
  /** Enable layered parallax (children with [data-depth]) and glint sweep */
  parallax?: boolean;
}

export function TiltCard({
  children,
  className,
  max = 9,
  as = "div",
  parallax = true,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const layers = parallax
      ? Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"))
      : [];
    const glint = parallax ? el.querySelector<HTMLElement>(".card-glint") : null;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateY(${(nx * max * 2).toFixed(2)}deg) rotateX(${(-ny * max * 2).toFixed(2)}deg) scale3d(1.025,1.025,1.025)`;
        el.style.transition = "transform 0.1s ease-out";
        layers.forEach((layer) => {
          const depth = parseFloat(layer.dataset.depth || "1") || 1;
          layer.style.transform = `translate3d(${(nx * depth * 12).toFixed(2)}px, ${(ny * depth * 12).toFixed(2)}px, 0)`;
          layer.style.transition = "transform 0.1s ease-out";
        });
        if (glint) {
          glint.style.background = `radial-gradient(circle at ${((nx + 0.5) * 100).toFixed(1)}% ${((ny + 0.5) * 100).toFixed(1)}%, rgba(0,255,136,0.18) 0%, transparent 60%)`;
        }
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)";
      el.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      layers.forEach((layer) => {
        layer.style.transform = "translate3d(0,0,0)";
        layer.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      });
      if (glint) glint.style.background = "transparent";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max, parallax]);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={cn(
        "tilt-card transition-transform duration-500 ease-out will-change-transform",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Hook to add staggered fade-in-up to children when scrolled into view
export function useStaggerReveal(selector = "[data-reveal]") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const i = Number(el.dataset.revealIndex ?? 0);
            el.style.transitionDelay = `${Math.min(i * 90, 600)}ms`;
            el.classList.add("is-revealed");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}
