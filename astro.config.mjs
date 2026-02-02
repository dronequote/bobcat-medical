import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://bobcatmedical.com',
  integrations: [
    tailwind(),
    sitemap(),
    icon(),
  ],
  output: 'server',
  adapter: vercel({
    imageService: true,
  }),
});
