# Backlog de Imágenes — Enciclopedia Saint Seiya

> Reglas de uso completas: ver `.claude/skills/image-loop/SKILL.md`.
> Fuente: AniList (`https://graphql.anilist.co`), verificando que el personaje encontrado pertenezca a algún
> título "Saint Seiya" antes de usar su imagen (ver skill). Nunca se generan ni descargan imágenes de otra forma.
> Cada ítem marcado `[x]` debe tener `imagen` + `imagenAtribucion` en el frontmatter del `.mdx` correspondiente.
> Si no se encuentra una imagen verificada, el ítem se marca `[skip]` (no `[x]`) con la fecha y se sigue de largo —
> no bloquea la iteración ni se reintenta indefinidamente.

## Estado global
- Última iteración: 2026-07-01 (image-loop: Mu, Aldebarán, Saga, Deathmask, Aioria, Shaka, Dohko, Milo)
- Rama de trabajo: `content/auto-loop` (comparte rama y flujo de PR con `content-loop`)

## Personajes
- [x] Seiya de Pegaso (`personajes/seiya-pegaso.mdx`) — 2026-07-01
- [x] Hyoga de Cisne (`personajes/hyoga-cisne.mdx`) — 2026-07-01
- [x] Shiryu de Dragón (`personajes/shiryu-dragon.mdx`) — 2026-07-01
- [x] Shun de Andrómeda (`personajes/shun-andromeda.mdx`) — 2026-07-01
- [x] Ikki de Fénix (`personajes/ikki-fenix.mdx`) — 2026-07-01
- [x] Saori Kido / Athena (`personajes/saori-kido-athena.mdx`) — 2026-07-01
- [x] Mu de Aries (`personajes/mu-aries.mdx`) — 2026-07-01
- [x] Aldebarán de Tauro (`personajes/aldebaran-tauro.mdx`) — 2026-07-01
- [x] Saga de Géminis (`personajes/saga-geminis.mdx`) — 2026-07-01
- [x] Deathmask de Cáncer (`personajes/deathmask-cancer.mdx`) — 2026-07-01
- [x] Aioria de Leo (`personajes/aioria-leo.mdx`) — 2026-07-01
- [x] Shaka de Virgo (`personajes/shaka-virgo.mdx`) — 2026-07-01
- [x] Dohko de Libra (`personajes/dohko-libra.mdx`) — 2026-07-01
- [x] Milo de Escorpio (`personajes/milo-escorpio.mdx`) — 2026-07-01
- [ ] Aioros de Sagitario (`personajes/aioros-sagitario.mdx`)
- [ ] Shura de Capricornio (`personajes/shura-capricornio.mdx`)
- [ ] Camus de Acuario (`personajes/camus-acuario.mdx`)
- [ ] Afrodita de Piscis (`personajes/afrodita-piscis.mdx`)
- [ ] Shion de Aries, Patriarca (`personajes/shion-patriarca.mdx`)
- [ ] Poseidon / Julian Solo (`personajes/poseidon-julian-solo.mdx`)
- [ ] Hades / Alone (`personajes/hades-alone.mdx`)
- [ ] Pandora (`personajes/pandora.mdx`)
- [ ] Aiacos de Garuda (`personajes/aiacos-garuda.mdx`)
- [ ] Minos de Grifo (`personajes/minos-grifo.mdx`)
- [ ] Radamanthys de Wyvern (`personajes/radamanthys-wyvern.mdx`)

## Armaduras
> Cobertura esperada baja: AniList indexa personajes, no piezas de equipo por separado. La mayoría de estos ítems
> van a terminar en `[skip]` salvo que se encuentre una imagen de la armadura específica (no del personaje que la
> porta) en algún campo de descripción/imagen de la obra relacionada.
- [ ] Armadura de Pegaso (`armaduras/armadura-pegaso.mdx`)
- [ ] Armadura de Aries (`armaduras/armadura-aries.mdx`)
- [ ] Armadura de Tauro (`armaduras/armadura-tauro.mdx`)
- [ ] Armadura de Géminis (`armaduras/armadura-geminis.mdx`)
- [ ] Armadura de Cáncer (`armaduras/armadura-cancer.mdx`)
- [ ] Armadura de Leo (`armaduras/armadura-leo.mdx`)

> Nota: a medida que el loop de contenido (`content-loop`) agregue nuevos personajes/armaduras, agregar acá los
> ítems correspondientes con su path exacto antes de tomarlos, siguiendo el mismo formato.
