---
name: content-loop
description: Agrega el siguiente lote de contenido a la Enciclopedia Saint Seiya siguiendo CONTENT_BACKLOG.md. Se invoca periódicamente vía /loop para hacer entregas iterables automáticas. Usar cuando toque avanzar el backlog de personajes/sagas/técnicas/armaduras/lugares/facciones del sitio.
---

# Content Loop — Enciclopedia Saint Seiya

Cada corrida de este skill es **una iteración autónoma**: investiga, redacta, valida, commitea, pushea, abre/mergea el
PR a `main` y dispara el deploy a GitHub Pages — todo sin pedir confirmación. El trabajo de contenido se hace sobre
la rama `content/auto-loop` (nunca se commitea directo a `main`), pero al final de cada iteración esa rama se
mergea a `main` automáticamente para que el sitio publicado se vea actualizado en cada corrida.

Antes de empezar, leer `AGENTS.md`/`CLAUDE.md` (convenciones del proyecto) si no se hizo en esta sesión.

Para los pasos de GitHub (crear/mergear PR) usar las herramientas MCP de GitHub (`mcp__github__create_pull_request`,
`mcp__github__merge_pull_request`, `mcp__github__pull_request_read` con método `get`/`get_status`) — esta sesión no
tiene CLI `gh`. Si en otro entorno solo hay `gh` disponible, usar `gh pr create` / `gh pr merge --squash` como
equivalente.

## Pasos

1. **Verificar rama**: si no estás en `content/auto-loop`, hacer checkout/crearla desde `main` (`git checkout -B content/auto-loop origin/main` o similar) y hacer `git pull` si ya existe en remoto.
2. **Leer estado**: abrir `CONTENT_BACKLOG.md`, ubicar el primer bloque de "Prioridad N" que tenga ítems sin marcar (`[ ]`).
3. **Seleccionar lote**: tomar entre **2 y 5 ítems** de ese mismo bloque de prioridad. No mezclar prioridades distintas en una misma iteración. Si el bloque es de sagas (1 saga = contenido extenso), tomar solo **1** saga por iteración.
   - Si el bloque tomado es "Prioridad 1" (sagas) y la saga referencia una obra que todavía no existe en `src/content/obras/`, resolver primero esa obra (crearla) como parte del mismo lote, aunque no esté explícita en el backlog como ítem separado — usar `obras/<slug-de-la-obra>.mdx` como path.
4. **Investigar (opcional, con cuidado)**: si hace falta un dato factual puntual (nombre japonés, capítulo/episodio de debut, relaciones), se puede consultar como referencia:
   - `https://raw.githubusercontent.com/diegochagas/saint-seiya-api-data/main/<carpeta>/<archivo>.json` (dataset específico de Saint Seiya, sin auth)
   - `https://graphql.anilist.co` (GraphQL, sin auth, metadata general de anime/manga)
   - `https://docs.api.jikan.moe/` (API no oficial de MyAnimeList)
   Estas fuentes son solo para **datos**, nunca para copiar prosa.
5. **Redactar contenido original** para cada ítem del lote:
   - Prohibido copiar/pegar texto de wikis con copyright (Wikipedia, Fandom, etc.) — reformular siempre con palabras propias.
   - Citar capítulo del manga y/o episodio del anime cuando aporte precisión.
   - Longitud mínima: 150 palabras en `resumen`/`sinopsis` de `personajes` y `sagas`; 80 palabras en `descripcion` de `tecnicas`, `armaduras`, `lugares`, `facciones`.
   - Cumplir el schema Zod de `src/content.config.ts` en el frontmatter. Si una referencia cruzada (`reference()`) apunta a un ítem que todavía no existe, **omitirla** en vez de dejar un slug roto.
   - Usar el path de archivo exacto indicado en `CONTENT_BACKLOG.md`.
6. **Actualizar el backlog**: marcar cada ítem completado como `[x]` y agregar la fecha (`YYYY-MM-DD`) al final de la línea. Actualizar "Última iteración" en la sección "Estado global".
7. **Validar antes de commitear**: correr `npm run build`. Si falla por error de schema o referencia rota, corregir antes de continuar — nunca commitear un build roto.
8. **Commit + push autónomo** a `content/auto-loop`, con mensaje de commit descriptivo del bloque cubierto, por ejemplo:
   `content(personajes): añade fichas de Shiryu, Hyoga y Shun (P2)`
   Incluir en el mismo commit tanto los `.mdx` nuevos/editados como el `CONTENT_BACKLOG.md` actualizado.
9. **Abrir y mergear el PR a `main`, sin pedir confirmación**:
   - Buscar si ya existe un PR abierto `content/auto-loop` → `main` (`mcp__github__pull_request_read` método `get`, o listar PRs abiertos). Si existe, ya quedó actualizado con el push del paso 8.
   - Si no existe, crearlo con `mcp__github__create_pull_request` (`head: content/auto-loop`, `base: main`), con un título/resumen breve del lote de esta iteración.
   - Antes de mergear, chequear el estado del último commit (`mcp__github__pull_request_read` método `get_status` o `get_check_runs`) por si hay checks de CI configurados; si algún check obligatorio está en curso o falló, no forzar el merge — reportarlo y dejarlo para la próxima iteración.
   - Mergear con `mcp__github__merge_pull_request` (`merge_method: squash`). Esto pushea a `main` y dispara automáticamente `.github/workflows/deploy.yml`, publicando el cambio en GitHub Pages en 1-2 minutos.
   - No hace falta resetear ni recrear `content/auto-loop` después del merge: la próxima iteración sigue commiteando sobre la misma rama; el próximo PR va a mostrar solo el diff nuevo aunque el historial no haga fast-forward.
10. **Condición de parada**: si `CONTENT_BACKLOG.md` no tiene ningún ítem pendiente, reportarlo y no generar un commit ni PR vacío.

## Notas

- El campo `imagen` de `personajes` queda sin llenar — no descargar ni inventar imágenes.
- Las listas abiertas del backlog (Prioridad 9 y 10) no tienen paths concretos todavía: al llegar a ellas, primero agregar sub-ítems concretos con su path (siguiendo el mismo formato que las prioridades anteriores) en un paso previo, y recién después tomarlos como lote.
- Cada iteración deja el sitio publicado (`https://pcornejov.github.io/Enciclopedia-saint-seiya/`) actualizado con el lote de esa corrida, sin intervención manual. Si el merge o el deploy fallan, diagnosticar igual que un fix de infraestructura normal (ver logs del job con `mcp__github__get_job_logs`), corregir, y volver a intentar — no dejar el PR abierto sin resolver de una corrida a la otra.
