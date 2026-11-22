import { ArrowUpRight } from "lucide-react";
import { links } from "@/content";
import { cn } from "@/lib/utils";

/** The one primary conversion action, used everywhere with the same label and destination. */
export function BookingLink({
  className,
  label = links.bookingCall.label,
  onClick,
}: {
  className?: string;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={links.bookingCall.href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      className={cn("btn btn-primary", className)}
    >
      {label}
      <ArrowUpRight className="h-4 w-4" aria-hidden />
      <span className="sr-only">(opens Calendly in a new tab)</span>
    </a>
  );
}
