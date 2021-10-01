<template>
  <v-app>
    <v-main>
      <RandomGenerator :collection='collection'></RandomGenerator>
      <v-container>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                to='/collections'
                fab
                color='primary'
                class='ma-3'
                x-large
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large>mdi-arrow-left-circle</v-icon>
              </v-btn>
            </template>
            <span>Ansicht beenden</span>
          </v-tooltip>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import RandomGenerator from '@/components/RandomGenerator.vue';

export default Vue.extend({
  name: 'PreviewCollection',

  components: {
    RandomGenerator,
  },

  props: {
    collectionIndex: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      collection: this.$store.state.collections[+this.collectionIndex],
    };
  },

  methods: {
  },
});
</script>
