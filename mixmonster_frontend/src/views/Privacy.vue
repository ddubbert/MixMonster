<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center' class='mb-5'>
          <span class='text-h4 text-md-h3' align='center'>
            <strong>Datenschutz:</strong>
          </span>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import 'vue-class-component/hooks';

@Component
export default class Privacy extends Vue {
  name = 'Datenschutz';

  id = '';
}
</script>
