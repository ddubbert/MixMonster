<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      ref="appBar"
    >
      <div class="d-flex align-center ml-2">
<!--        <v-img-->
<!--          alt="MixMonster Logo"-->
<!--          class="shrink mr-2"-->
<!--          contain-->
<!--          src="@/assets/icon.png"-->
<!--          transition="scale-transition"-->
<!--          width="50"-->
<!--        />-->

        <v-toolbar-title>
          <span
            class='text-h4'
            @click.stop="$router.push({ name: 'Home' })"
            style='cursor: pointer'
          >
            <strong>MixMonster</strong>
          </span>
        </v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-menu
        open-on-hover
        bottom
        dark
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            icon
            v-bind="attrs"
            v-on="on"
            class='mr-2'
          >
            <v-icon x-large>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click.stop="$router.push({ name: 'Home' })">
            <v-list-item-title>
              <span class='text-h6'>
                Home
              </span>
            </v-list-item-title>

            <v-list-item-icon class='mr-3'>
              <v-icon x-large>mdi-home-circle</v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-item  v-if='$store.state.token' @click.stop="logout">
            <v-list-item-title>
              <span class='text-h6'>
                Logout
              </span>
            </v-list-item-title>

            <v-list-item-icon class='mr-3'>
              <v-icon x-large>mdi-logout</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-alert
      v-if='!!$store.state.error'
      border='top'
      type='error'
      class='ma-0'
      :style='`position: fixed; top: ${barHeight}px; width: 100%; z-index: 100; border-radius: 0px`'
    >
      {{ $store.state.error }}
    </v-alert>

    <v-main class='pt-10 pb-16 mb-16' ref='main'>
      <router-view/>
    </v-main>

    <v-footer
      color="secondary"
      padless
      :absolute="windowWidth < 500"
      :fixed="windowWidth >= 500"
    >
      <cookie-law
        v-if="$route.name !== 'Datenschutz'"
        theme="dark-lime"
        buttonText="Alles klar!"
        storageName="MixMonster:cookie:consent"
      >
        <div slot="message">
          Für die Erstellung und Verwaltung der MixMonster sind Cookies notwendig um den
          jeweiligen Nutzer identifizieren zu können. Dabei handelt es sich ausschließlich um
          funktionale Cookies, ohne die unser Service nicht funktionieren würde. Bei der reinen
          Verwendung eines MixMonsters hingegen werden keine Cookies angelegt.
          Genauere Informationen hierzu können unserem
          <router-link to="privacy">Datenschutzhinweis</router-link> entnommen werden.
        </div>
      </cookie-law>

      <v-row
        justify="center"
        no-gutters
      >
        <v-btn
          v-for="link in links"
          :key="link"
          color="white"
          text
          rounded
          class="my-2"
          @click.stop="$router.push({ name: link })"
        >
          {{ link }}
        </v-btn>

        <v-btn
          color="white"
          text
          rounded
          class="my-2"
          @click.stop="$router.push({ name: 'Haftung' })"
        >
          Haftung
        </v-btn>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CookieLaw from 'vue-cookie-law';

@Component({
  components: {
    CookieLaw,
  },
})
export default class App extends Vue {
  links = [
    'Impressum',
    'Datenschutz',
  ]

  barHeight = 0;

  windowWidth = 0;

  setWidth() {
    const ref = this.$refs.main;
    this.windowWidth = ref ? (ref as Vue).$el.clientWidth : 0;
  }

  mounted(): void {
    const ref = this.$refs.appBar;
    this.barHeight = ref ? (ref as Vue).$el.clientHeight : 0;
    this.setWidth();
  }

  logout(): void {
    this.$store.dispatch(
      'logout',
      // `http://${process.env.VUE_APP_FRONTEND_HOST}:${process.env.VUE_APP_FRONTEND_PORT}`,
    );
  }
}
</script>
