## Proyecto

Enciclopedia en español sobre el manga y anime de Saint Seiya (Caballeros del Zodiaco), construida con Astro + Content
Collections. El contenido se genera de forma iterativa: gran parte de las entradas la va agregando el skill
`/content-loop` corriendo en `/loop`, no una sola sesión manual.

## Estructura de contenido

7 colecciones en `src/content/`, definidas en `src/content.config.ts` con schema Zod: `personajes`, `sagas`,
`tecnicas`, `armaduras`, `lugares`, `facciones`, `obras`. Las relaciones entre colecciones usan `reference()` — si
un ítem referenciado todavía no existe, omitir la referencia en vez de crear un slug roto (rompe `npm run build`).

- `sagas.obra` es una referencia **obligatoria**: antes de crear una saga tiene que existir su `obras/*.mdx`.
- El campo `imagen` de `personajes` queda vacío — no descargar ni inventar imágenes con copyright dudoso.

## Backlog de contenido

`CONTENT_BACKLOG.md` en la raíz es la fuente de verdad de qué falta escribir, agrupado por prioridad con el path de
archivo exacto de cada ítem. Se actualiza (checkbox + fecha) en el mismo commit que agrega el `.mdx` correspondiente.

## Reglas de redacción

- Contenido **original**: prohibido copiar texto de wikis con copyright (Wikipedia, Fandom, etc.); reformular con
  palabras propias. Se puede usar como referencia factual (nombres, fechas, relaciones) el dataset JSON gratuito
  `raw.githubusercontent.com/diegochagas/saint-seiya-api-data/main/<carpeta>/<archivo>.json`, o las APIs públicas
  AniList (`https://graphql.anilist.co`) y Jikan (`https://docs.api.jikan.moe/`) — nunca su prosa.
- Citar capítulo/episodio cuando aporte precisión (ej. "aparece por primera vez en el capítulo 1 del manga").
- Longitud mínima: 150 palabras en `resumen`/`sinopsis` de `personajes` y `sagas`; 80 palabras en
  `descripcion` de `tecnicas`, `armaduras`, `lugares`, `facciones`.

## Comandos

- `npm run build` — build de producción; valida el schema Zod de cada `.mdx` (falla con error localizado si falta
  un campo o hay una referencia rota). Correrlo antes de cualquier commit que agregue/edite contenido.
- `npm run check` — `astro check`, valida tipos y referencias cruzadas.
- `npm run dev` — servidor de desarrollo. Pagefind (`/pagefind/...`) solo se genera en `npm run build`
  (script `postbuild`), no en dev.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
