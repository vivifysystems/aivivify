// Contact form validation and mailto composition. No network requests: the
// visitor's own email app sends the message. Pure functions, unit tested.
export type ContactInput = {
  name: string;
  email: string;
  business: string;
  interests: string[];
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: ContactInput): ContactErrors {
  const e: ContactErrors = {};
  const name = input.name.trim();
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > 80) e.name = "Please keep your name under 80 characters.";
  if (!EMAIL.test(input.email.trim()))
    e.email = "Please enter a valid email address, like name@business.com.";
  if (input.business.trim().length > 120) e.business = "Please keep this under 120 characters.";
  const msg = input.message.trim();
  if (msg.length < 10) e.message = "Please add a little more detail (at least 10 characters).";
  else if (msg.length > 2000) e.message = "Please keep your message under 2,000 characters.";
  return e;
}

/** Strips control characters (header-injection safety) and trims. */
function clean(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export function composeMessage(input: ContactInput, interestLabels: Record<string, string>) {
  const subject = `Discovery inquiry from ${clean(input.name).replace(/[\r\n]+/g, " ")}`.slice(
    0,
    120,
  );
  const lines = [
    `Name: ${clean(input.name)}`,
    `Email: ${clean(input.email)}`,
    input.business.trim() ? `Business: ${clean(input.business)}` : null,
    input.interests.length
      ? `Interested in: ${input.interests.map((i) => interestLabels[i] ?? i).join(", ")}`
      : null,
    "",
    clean(input.message),
  ].filter((l): l is string => l !== null);
  return { subject, body: lines.join("\n") };
}

export function mailtoHref(to: string, subject: string, body: string): string {
  const address = to.replace(/^mailto:/, "");
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
