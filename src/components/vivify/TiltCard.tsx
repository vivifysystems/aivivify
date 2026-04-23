import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  max?: number;
  as?: "div" | "article";
}

export function TiltCard({ children, className, max = 8, as = "div", ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * max * 2;
      const ry = (x - 0.5) * max * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={cn("tilt-card transition-transform duration-500 ease-out will-change-transform", className)}
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
