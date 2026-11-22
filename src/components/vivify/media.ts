// Resolves the asset names used in src/content to bundled, optimized image URLs.
// Originals in src/assets are kept untouched; see scripts/optimize-media.sh.

const cardImages = import.meta.glob<string>("/src/assets/optimized/card/*.webp", {
  eager: true,
  import: "default",
});
const fullImages = import.meta.glob<string>("/src/assets/optimized/full/*.webp", {
  eager: true,
  import: "default",
});

/** ≤800px-wide WebP for cards and thumbnails. */
export function cardImage(name: string | undefined): string | undefined {
  return name ? cardImages[`/src/assets/optimized/card/${name}.webp`] : undefined;
}

/** ≤1600px-wide WebP for full-size proofs in the case-study modal. */
export function fullImage(name: string | undefined): string | undefined {
  return name ? fullImages[`/src/assets/optimized/full/${name}.webp`] : undefined;
}
