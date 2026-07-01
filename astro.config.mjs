// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://pcornejov.github.io',
  base: '/Enciclopedia-saint-seiya',
  integrations: [mdx()]
});