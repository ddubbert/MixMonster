<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
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
          <span class='text-h4'>
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

    <v-main class='pt-10 pb-16 mb-16'>
      <router-view/>
    </v-main>

    <v-footer
      color="secondary"
      padless
      fixed
    >
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
        >
          {{ link }}
        </v-btn>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  links = [
    'Home',
    'About Us',
    'Team',
    'Services',
    'Blog',
    'Contact Us',
  ]

  logout(): void {
    this.$store.dispatch('logout', 'http://localhost:8080/');
  }
}
</script>
