import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Obra de origen dentro del universo Saint Seiya, compartida por varias colecciones.
const origenEnum = z.enum([
  'manga_kurumada',
  'anime_clasico',
  'pelicula',
  'lost_canvas',
  'episode_g',
  'next_dimension',
  'saintia_sho',
  'omega',
  'soul_of_gold',
  'otro',
]);

const personajes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/personajes' }),
  schema: z.object({
    nombre: z.string(),
    nombreJapones: z.string().optional(),
    alias: z.array(z.string()).default([]),
    tipo: z.enum([
      'santo_bronce',
      'santo_plata',
      'santo_oro',
      'santo_acero',
      'dios',
      'diosa',
      'guerrero_dios',
      'marina_general',
      'espectro',
      'juez_infierno',
      'humano',
      'otro',
    ]),
    rangoArmadura: z.string().optional(),
    faccion: reference('facciones').optional(),
    armaduraPrincipal: reference('armaduras').optional(),
    armadurasSecundarias: z.array(reference('armaduras')).default([]),
    tecnicas: z.array(reference('tecnicas')).default([]),
    sagas: z.array(reference('sagas')).default([]),
    relaciones: z
      .array(
        z.object({
          personaje: reference('personajes'),
          tipo: z.enum(['maestro', 'discipulo', 'hermano', 'aliado', 'rival', 'enemigo', 'otro']),
        }),
      )
      .default([]),
    origen: origenEnum,
    obraPrincipal: reference('obras').optional(),
    estadoNarrativo: z
      .enum(['vivo', 'muerto', 'resucitado', 'desconocido', 'variable_segun_obra'])
      .default('desconocido'),
    imagen: z.string().url().optional(),
    imagenAtribucion: z.string().optional(),
    resumen: z.string().min(1),
    destacado: z.boolean().default(false),
  }),
});

const sagas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/sagas' }),
  schema: z.object({
    nombre: z.string(),
    ordenCanonico: z.number(),
    obra: reference('obras'),
    arco: z.enum(['santuario', 'asgard', 'poseidon', 'hades', 'pelicula', 'spin_off']),
    sinopsis: z.string().min(1),
    personajesClave: z.array(reference('personajes')).default([]),
    lugares: z.array(reference('lugares')).default([]),
    facciones: z.array(reference('facciones')).default([]),
  }),
});

const tecnicas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tecnicas' }),
  schema: z.object({
    nombre: z.string(),
    nombreJapones: z.string().optional(),
    usuarios: z.array(reference('personajes')).default([]),
    tipoAtaque: z.enum(['puno', 'energia', 'velocidad', 'especial']),
    descripcion: z.string().min(1),
    origen: origenEnum,
  }),
});

const armaduras = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/armaduras' }),
  schema: z.object({
    nombre: z.string(),
    tipo: z.enum(['bronce', 'plata', 'oro', 'dios', 'surplice', 'scale', 'otro']),
    constelacion: z.string().optional(),
    portadores: z.array(reference('personajes')).default([]),
    descripcion: z.string().min(1),
    imagen: z.string().url().optional(),
    imagenAtribucion: z.string().optional(),
  }),
});

const lugares = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lugares' }),
  schema: z.object({
    nombre: z.string(),
    region: z.enum(['grecia', 'asgard', 'fondo_del_mar', 'inframundo', 'otro']),
    descripcion: z.string().min(1),
    sagasAsociadas: z.array(reference('sagas')).default([]),
  }),
});

const facciones = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/facciones' }),
  schema: z.object({
    nombre: z.string(),
    tipoFaccion: z.enum(['ejercito', 'panteon', 'orden', 'otro']),
    liderazgo: z.string().optional(),
    descripcion: z.string().min(1),
  }),
});

const obras = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/obras' }),
  schema: z.object({
    nombre: z.string(),
    tipo: z.enum(['manga', 'anime', 'pelicula', 'spin_off_manga', 'spin_off_anime']),
    autor: z.string().optional(),
    anioInicio: z.number().optional(),
    anioFin: z.number().optional(),
    esCanon: z.boolean(),
  }),
});

export const collections = { personajes, sagas, tecnicas, armaduras, lugares, facciones, obras };
