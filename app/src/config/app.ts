export default {
  host: process.env.APP_HOST || '0.0.0.0',
  httpsOn: process.env.NODE_ENV != 'development' ? 'https' : 'http',
  port: process.env.PORT || 8080,
  isDevelopment: process.env.NODE_ENV == 'development',
};
