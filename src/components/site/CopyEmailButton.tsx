import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Copies text with the Clipboard API, falling back to a hidden textarea on older browsers. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Copies the public email address. The result is announced to screen readers and shown on screen. */
export function CopyEmailButton({ address, className }: { address: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyText(address);
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 4000);
  };

  return (
    <>
      <button type="button" onClick={copy} className={cn("btn btn-ghost", className)}>
        <Copy className="h-4 w-4" aria-hidden /> {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" aria-live="polite" className="basis-full text-sm text-mist empty:hidden">
        {state === "copied"
          ? `${address} copied to the clipboard.`
          : state === "failed"
            ? "Couldn't copy automatically. Select the address above and copy it."
            : ""}
      </span>
    </>
  );
}
