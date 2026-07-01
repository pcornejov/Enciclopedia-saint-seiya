/** Prefija una ruta absoluta con el `base` configurado en astro.config.mjs (necesario para GitHub Pages). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
