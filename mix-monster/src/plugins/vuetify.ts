import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#b43092',
        secondary: '#323639',
        accent: '#ea5a00',
        error: '#c81e0f',
      },
    },
  },
});
