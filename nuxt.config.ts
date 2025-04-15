// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      uploadUrl: process.env.NUXT_PUBLIC_UPLOAD_URL || '/uploads',
      appName: 'Wholesale Platform'
    },
    private: {
      slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
      uploadDir: process.env.UPLOAD_DIR || 'uploads',
      jwtSecret: process.env.JWT_SECRET || 'secret-key'
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Wholesale Platform',
      meta: [
        { name: 'description', content: 'Wholesale platform for business inquiries' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  nitro: {
    storage: {
      products: {
        driver: 'fs',
        base: './server/data/products'
      },
      orders: {
        driver: 'fs',
        base: './server/data/orders'
      },
      users: {
        driver: 'fs',
        base: './server/data/users'
      }
    }
  },

  build: {
    transpile: ['@headlessui/vue', '@heroicons/vue']
  },

  compatibilityDate: '2025-04-15'
})