import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    // Server-only: used for SSR calls, reaches the API container directly.
    apiBase: 'http://laravel.test',
    public: {
      // Exposed to the browser: used for client-side calls to the API's published port.
      apiBase: 'http://localhost',
    },
  },

  app: {
    head: {
      title: 'Suivi Peau',
      meta: [
        { name: 'description', content: 'Suivi de traitement dermatologique' },
      ],
    },
  },
})
