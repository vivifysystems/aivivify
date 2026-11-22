import { cn } from "@/lib/utils";
import { viviArt } from "./vivi-art";

/** VIVI's head-and-shoulders avatar, cropped from the official head close-up. */
export function ViviAvatar({
  size = 48,
  className,
  ring = true,
  eager = false,
}: {
  size?: number;
  className?: string;
  ring?: boolean;
  eager?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-navy-700",
        ring && "ring-2 ring-purple/70 ring-offset-2 ring-offset-transparent",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        src={size > 80 ? viviArt.avatar : viviArt.avatarSm}
        alt=""
        width={size}
        height={size}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </span>
  );
}

/** A small speech bubble attributed to VIVI. */
export function ViviSays({
  children,
  className,
  tone = "dark",
  avatar = true,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
  avatar?: boolean;
}) {
  return (
    <figure className={cn("flex items-end gap-3", className)}>
      {avatar && <ViviAvatar size={44} />}
      <blockquote
        className={cn(
          "relative max-w-sm rounded-2xl rounded-bl-md px-4 py-3 text-[0.95rem] leading-snug",
          tone === "dark" ? "bg-navy-700 text-snow" : "bg-white text-navy shadow-sm",
        )}
      >
        <figcaption
          className={cn(
            "tech-label mb-1 !text-[0.8rem]",
            tone === "dark" ? "text-purple-300" : "text-purple-700",
          )}
        >
          VIVI · brand guide
        </figcaption>
        {children}
      </blockquote>
    </figure>
  );
}
