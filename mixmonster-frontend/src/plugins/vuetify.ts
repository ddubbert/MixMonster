import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#b43092',
        secondary: '#323639',
        accent: '#ec6b1a', // '#ea5a00',
        error: '#c81e0f',
        primary_light: '#ad4994',
      },
      dark: {
        primary: '#b43092',
        secondary: '#323639',
        accent: '#ec6b1a', // '#ea5a00',
        error: '#c81e0f',
        primary_light: '#ad4994',
      },
    },
  },
});
