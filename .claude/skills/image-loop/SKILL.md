---
name: image-loop
description: Busca y agrega imágenes verificadas (vía AniList) a personajes y armaduras de la Enciclopedia Saint Seiya siguiendo IMAGE_BACKLOG.md. Loop autónomo separado de content-loop, especializado solo en imágenes. Usar cuando toque avanzar el backlog de imágenes.
---

# Image Loop — Enciclopedia Saint Seiya

Cada corrida de este skill es **una iteración autónoma**: busca imágenes, las verifica, las agrega al frontmatter,
valida, commitea, pushea, abre/mergea el PR a `main` y dispara el deploy — todo sin pedir confirmación. Comparte la
rama `content/auto-loop` y el mismo flujo de PR que `content-loop` (ver ese skill para el detalle del flujo de
GitHub); acá solo se documenta lo específico de imágenes.

## Por qué existe este skill (contexto de decisión)

El usuario pidió automatizar imágenes. Se evaluó y descartó bajar/republicar arte oficial "a mano" o generarlo con
IA por defecto; se optó por **AniList** (`https://graphql.anilist.co`, GraphQL, sin API key) porque expone
imágenes de personajes ya alojadas en su propio CDN. Importante: **esto no elimina el copyright** — las imágenes
siguen siendo arte oficial de Toei/Kurumada/Shueisha, solo que alojado por AniList. Es la misma práctica de bajo
riesgo (no nulo) que usan la mayoría de las wikis de fans no comerciales. Por eso:

- Siempre usar la URL remota de AniList directamente (`imagen: z.string().url()`), **nunca descargar y commitear
  el binario al repo** — así no creamos una copia persistente propia, solo un enlace/embed, que es la forma de
  menor riesgo.
- Siempre completar `imagenAtribucion` con el crédito a AniList + Toei/Kurumada.

## Pasos

1. **Verificar rama**: igual que `content-loop` — estar en `content/auto-loop`, sincronizada con `origin/main`.
2. **Leer estado**: abrir `IMAGE_BACKLOG.md`, tomar el primer bloque (`Personajes` primero, `Armaduras` después)
   con ítems sin marcar (`[ ]`, no `[x]` ni `[skip]`).
3. **Seleccionar lote**: tomar entre **3 y 8 ítems** sin marcar del mismo bloque.
4. **Para cada ítem, buscar y verificar en AniList**:
   - Query GraphQL (`Page.characters(search: "<nombre>")`, `perPage: 15`) pidiendo `name.full`, `image.large`,
     `media(perPage: 5) { nodes { title { romaji english } } }`.
   - Probar primero con el `nombre` del frontmatter; si no hay match verificado, reintentar con cada `alias`.
   - **Verificación obligatoria**: de los resultados devueltos, tomar el primero cuyo `media.nodes[].title`
     (romaji o english) contenga "saint seiya" (case-insensitive). Si ningún resultado verifica, es un ítem sin
     match — no usar ninguna imagen de ese lote de resultados aunque el nombre "parezca" correcto (ver ejemplo:
     buscar "Mu" o "Shaka" sin verificar trae personajes de Attack on Titan / Jujutsu Kaisen con esos mismos
     nombres cortos).
   - Si hay match verificado: `imagen` = el `image.large` de ese personaje; `imagenAtribucion` = algo como
     `Imagen vía AniList (anilist.co/character/<id>) — © Toei Animation / Masami Kurumada` (ajustar el crédito de
     autor si la ficha indica otro origen, ej. Shiori Teshirogi para personajes de The Lost Canvas).
   - Si no hay match verificado: dejar el `.mdx` sin tocar y marcar el ítem como `[skip]` en `IMAGE_BACKLOG.md`
     (con fecha), no como `[x]`.
5. **Armaduras**: la búsqueda de personajes de AniList no cubre piezas de equipo. Salvo que aparezca un resultado
   verificado específico para la armadura misma (raro), marcar como `[skip]` directamente. No usar la imagen del
   personaje que la porta como si fuera la imagen de la armadura — son entidades distintas y sería incorrecto.
6. **Actualizar `IMAGE_BACKLOG.md`**: marcar cada ítem del lote como `[x]` (con imagen) o `[skip]` (sin match),
   ambos con fecha. Actualizar "Última iteración" en "Estado global".
7. **Validar con `npm run build`** antes de commitear — el schema exige que `imagen` sea una URL válida.
8. **Commit + push** a `content/auto-loop`, ej: `content(imagenes): añade imágenes de 5 Santos Dorados (verificadas vía AniList)`.
9. **Abrir/mergear PR a `main`** y **resincronizar `content/auto-loop`**: pasos idénticos a `content-loop` (pasos 9
   y 10 de ese skill) — usar las mismas herramientas MCP de GitHub, mismo `merge_method: squash`, mismo
   `git reset --hard origin/main` + `push --force-with-lease` sobre `content/auto-loop` (ya autorizado por el
   usuario).
10. **Encadenar la siguiente iteración de inmediato**, igual que `content-loop`, hasta agotar `IMAGE_BACKLOG.md` o
    toparse con un bloqueo real.
11. **Condición de parada**: si `IMAGE_BACKLOG.md` no tiene ítems sin marcar (ni `[ ]`), reportarlo y no generar
    commit ni PR vacío.

## Notas

- Este skill **no** reemplaza a `content-loop`: si ambos backlogs tienen trabajo pendiente, priorizar terminar la
  cadena que esté corriendo antes de arrancar la otra, para no mezclar tipos de cambio en un mismo PR.
- Cuando `content-loop` agregue personajes/armaduras nuevas, agregar los ítems correspondientes a
  `IMAGE_BACKLOG.md` (con su path exacto) antes de que `image-loop` pueda tomarlos — si `image-loop` corre y
  encuentra un personaje en `src/content/personajes/` que no está listado en `IMAGE_BACKLOG.md`, agregarlo primero
  como parte de la misma iteración.
- No hay campo de imagen para `sagas`, `tecnicas`, `lugares` ni `facciones` en el schema — este skill es
  exclusivamente para `personajes` y `armaduras`.
