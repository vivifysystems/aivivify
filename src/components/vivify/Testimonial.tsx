export function Testimonial() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <div className="glass relative overflow-hidden rounded-3xl p-10 sm:p-14">
          <div className="absolute -right-10 -top-10 font-display text-[12rem] leading-none text-primary/10 select-none">
            “
          </div>
          <p className="font-display text-2xl leading-snug text-foreground sm:text-3xl">
            “Bobby never sleeps. Our customers get answered <span className="neon-text">instantly</span>, even at 2 AM, and bookings just keep coming in. It honestly feels like we hired five people overnight — except this one never calls in sick.”
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary">
              B
            </div>
            <div>
              <p className="font-semibold">Bobert G.</p>
              <p className="font-mono-ui text-xs uppercase tracking-widest text-foreground/55">
                Owner · Bobert’s Yummy Lechon
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}