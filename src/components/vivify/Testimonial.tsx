export function Testimonial() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <article className="glass relative overflow-hidden rounded-3xl p-10 sm:p-12">
          <div className="absolute -right-8 -top-10 font-display text-[10rem] leading-none text-primary/10 select-none">
            “
          </div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">★★★★★</p>
          <p className="mt-4 font-display text-xl leading-snug text-foreground sm:text-2xl">
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
        </article>

        <article className="glass relative overflow-hidden rounded-3xl p-10 sm:p-12">
          <div className="absolute -right-8 -top-10 font-display text-[10rem] leading-none text-primary/10 select-none">
            “
          </div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-primary">★★★★★</p>
          <p className="mt-4 font-display text-xl leading-snug text-foreground sm:text-2xl">
            “Viviene mapped out an entire automation flow for our onboarding process in one session. What used to take our team <span className="neon-text">3 hours</span> now runs itself.”
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary">
              MA
            </div>
            <div>
              <p className="font-semibold">Marketing Agency Client</p>
              <p className="font-mono-ui text-xs uppercase tracking-widest text-foreground/55">
                Identity Protected
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}