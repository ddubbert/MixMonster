module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    https: true,
    port: process.env.VUE_APP_FRONTEND_PORT || 8080,
    host: process.env.VUE_APP_FRONTEND_HOST || 'localhost',
  },
};
