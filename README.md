# Enciclopedia Saint Seiya

Enciclopedia en español sobre el manga y anime de Saint Seiya (Caballeros del Zodiaco): personajes, sagas, técnicas,
armaduras, lugares y facciones de todo el universo, del canon clásico a los spin-offs.

Construida con [Astro](https://astro.build) + Content Collections. Gran parte del contenido se agrega de forma
iterativa y automática mediante el skill `content-loop` (ver `.claude/skills/content-loop/SKILL.md`), que avanza el
backlog definido en [`CONTENT_BACKLOG.md`](./CONTENT_BACKLOG.md).

## Desarrollo

```sh
npm install
npm run dev       # servidor de desarrollo en localhost:4321
npm run build     # build de producción + índice de búsqueda (Pagefind)
npm run check     # astro check (tipos y referencias entre colecciones)
```

Convenciones del proyecto, estructura de contenido y reglas de redacción: ver [`AGENTS.md`](./AGENTS.md).

## Estructura de contenido

7 colecciones bajo `src/content/` (`personajes`, `sagas`, `tecnicas`, `armaduras`, `lugares`, `facciones`, `obras`),
definidas con schema Zod en `src/content.config.ts`. El sitio se despliega en GitHub Pages vía
`.github/workflows/deploy.yml`.
