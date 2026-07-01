---
name: image-loop
description: Busca y agrega imágenes verificadas (vía AniList, con Jikan/MyAnimeList como fallback) a personajes y armaduras de la Enciclopedia Saint Seiya siguiendo IMAGE_BACKLOG.md. Loop autónomo separado de content-loop, especializado solo en imágenes. Usar cuando toque avanzar el backlog de imágenes.
---

# Image Loop — Enciclopedia Saint Seiya

Cada corrida de este skill es **una iteración autónoma**: busca imágenes, las verifica, las agrega al frontmatter,
valida, commitea, pushea, abre/mergea el PR a `main` y dispara el deploy — todo sin pedir confirmación. Comparte la
rama `content/auto-loop` y el mismo flujo de PR que `content-loop` (ver ese skill para el detalle del flujo de
GitHub); acá solo se documenta lo específico de imágenes.

## Por qué existe este skill (contexto de decisión)

El usuario pidió automatizar imágenes. Se evaluó y descartó bajar/republicar arte oficial "a mano" o generarlo con
IA por defecto; se optó por **AniList** (`https://graphql.anilist.co`, GraphQL, sin API key) porque expone
imágenes de personajes ya alojadas en su propio CDN, con **Jikan/MyAnimeList** (`https://api.jikan.moe/v4`, REST,
sin API key) como fallback cuando AniList no tiene match. Importante: **esto no elimina el copyright** — las
imágenes siguen siendo arte oficial de Toei/Kurumada/Shueisha, solo que alojadas por AniList o MyAnimeList. Es la
misma práctica de bajo riesgo (no nulo) que usan la mayoría de las wikis de fans no comerciales. Por eso:

- Siempre usar la URL remota de AniList o Jikan/MAL directamente (`imagen: z.string().url()`), **nunca descargar y
  commitear el binario al repo** — así no creamos una copia persistente propia, solo un enlace/embed, que es la
  forma de menor riesgo.
- Siempre completar `imagenAtribucion` con el crédito a la fuente usada (AniList o MyAnimeList/Jikan) + Toei/Kurumada.
- Jikan tiene rate limit bajo (~3 req/seg, ~60/min) — espaciar las consultas con una pequeña pausa entre requests.

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
   - Si no hay match verificado en AniList: **antes de marcar `[skip]`, probar el fallback de Jikan** (ver paso
     4bis) — no marcar `[skip]` directamente solo porque AniList no encontró nada.
4bis. **Fallback en Jikan/MyAnimeList si AniList no dio match**:
   - La búsqueda libre de Jikan (`GET /v4/characters?q=<nombre>`) trae demasiado ruido de otras series (nombres
     cortos como "Ban" devuelven decenas de personajes de otros animes) — **no usar ese endpoint solo, siempre
     verificar contra el roster oficial de la obra**.
   - Mejor: resolver primero el `mal_id` de la obra correspondiente (`GET /v4/anime?q=Saint Seiya` — la serie
     clásica es id `1254`; Lost Canvas es `6171`/`9130`; usar el `obraPrincipal` del `.mdx` como pista de cuál
     obra buscar) y pedir su roster completo: `GET /v4/anime/<mal_id>/characters`. Esa respuesta lista todos los
     personajes que oficialmente pertenecen a esa obra (con su `role`: Main/Supporting), lo cual **ya es la
     verificación** — no hace falta chequear títulos de media por separado como en AniList.
   - Buscar el nombre (o alias) del personaje dentro de ese roster (los nombres en Jikan suelen venir como
     "Constelación, Nombre", ej. `"Lionet, Ban"`, `"Centaurus, Babel"` — revisar variantes con y sin coma).
   - Si aparece: usar `GET /v4/characters/<mal_id>` para obtener `images.jpg.image_url`; `imagen` = esa URL;
     `imagenAtribucion` = `Imagen vía MyAnimeList/Jikan (myanimelist.net/character/<mal_id>) — © Toei Animation /
     Masami Kurumada` (ajustar autor según la obra).
   - **Aprovechar el roster para detectar errores de datos**: si el nombre de constelación/rango que aparece en
     Jikan no coincide con el `rangoArmadura`/alias ya escritos en el `.mdx` (ver caso real: "Ban de Osa Mayor"
     resultó ser incorrecto, el roster oficial lo lista como "Lionet, Ban" = León Menor), corregir el `.mdx`
     (nombre, alias, `rangoArmadura`, y si aplica renombrar el archivo/slug) como parte de la misma iteración, y
     dejar constancia del cambio en el mensaje de commit y en `CONTENT_BACKLOG.md`.
   - Si tampoco aparece en el roster de Jikan: recién ahí marcar `[skip]` en `IMAGE_BACKLOG.md`, indicando que se
     probó tanto AniList como Jikan.
   - Rate limit de Jikan: espaciar las consultas (una pequeña pausa entre requests) para no chocar con el límite
     de ~3 req/seg.
5. **Armaduras**: ni la búsqueda de personajes de AniList ni la de Jikan cubren piezas de equipo (ambas son bases
   de datos de personajes, no de objetos). Salvo que aparezca un resultado verificado específico para la armadura
   misma (raro), marcar como `[skip]` directamente. No usar la imagen del personaje que la porta como si fuera la
   imagen de la armadura — son entidades distintas y sería incorrecto.
6. **Actualizar `IMAGE_BACKLOG.md`**: marcar cada ítem del lote como `[x]` (con imagen) o `[skip]` (sin match),
   ambos con fecha. Actualizar "Última iteración" en "Estado global".
7. **Validar con `npm run build`** antes de commitear — el schema exige que `imagen` sea una URL válida.
8. **Commit + push** a `content/auto-loop`, ej: `content(imagenes): añade imágenes de 5 Santos Dorados (verificadas vía AniList)`.
9. **Abrir/mergear PR a `main`** y **resincronizar `content/auto-loop`**: pasos idénticos a `content-loop` (pasos 9
   y 10 de ese skill) — usar las mismas herramientas MCP de GitHub, mismo `merge_method: squash`, mismo
   `git reset --hard origin/main` + `push --force-with-lease` sobre `content/auto-loop` (ya autorizado por el
   usuario).
10. **Encadenar la siguiente iteración de inmediato, ALTERNANDO con `content-loop`** (a pedido del usuario): al
    terminar esta iteración, no volver a invocar `image-loop` — invocar el skill **`content-loop`** (Skill tool)
    ahora mismo. `content-loop` avanza el backlog de contenido y, al terminar, vuelve a invocar `image-loop`, y así
    sucesivamente. Reglas de la alternancia:
    - Si `IMAGE_BACKLOG.md` queda sin ítems pendientes pero `CONTENT_BACKLOG.md` todavía tiene, igual invocar
      `content-loop` (para que siga avanzando) en vez de detener toda la cadena.
    - Si **ambos** backlogs (`IMAGE_BACKLOG.md` y `CONTENT_BACKLOG.md`) están sin ítems pendientes, ahí sí parar
      del todo (no invocar a ningún skill).
    - El cron de `/loop` sigue programado cada 30 min como red de seguridad, solo por si la cadena se corta.
11. **Condición de parada de este skill**: si `IMAGE_BACKLOG.md` no tiene ítems sin marcar (ni `[ ]`), no generar
    commit ni PR vacío en esta corrida — pero igual seguir la regla de alternancia del paso 10 antes de terminar
    el turno.

## Notas

- Cuando `content-loop` agregue personajes/armaduras nuevas, las agrega también a `IMAGE_BACKLOG.md` en el mismo
  commit (ver notas de `content-loop`). Si de todas formas `image-loop` encuentra un personaje en
  `src/content/personajes/` que no está listado en `IMAGE_BACKLOG.md`, agregarlo primero como parte de la misma
  iteración antes de seguir.
- No hay campo de imagen para `sagas`, `tecnicas`, `lugares` ni `facciones` en el schema — este skill es
  exclusivamente para `personajes` y `armaduras`.
