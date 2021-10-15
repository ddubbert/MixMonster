<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="MixMonster Logo"
          class="shrink mr-2"
          contain
          src="@/assets/icon.png"
          transition="scale-transition"
          width="50"
        />

        <v-toolbar-title>
          <span class='text-h3'>
            <strong>MixMonster</strong>
          </span>
        </v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click.stop="$router.push({ name: 'Home' })"
        icon
        class='ml-2 mr-2'
      >
        <v-icon x-large>mdi-home-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
}
</script>
