module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешить POST
    }
  },
];
