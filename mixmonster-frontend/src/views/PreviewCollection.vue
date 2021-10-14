<template>
  <v-app>
    <v-main>
      <RandomGenerator v-if='collection' :collection='collection'></RandomGenerator>
      <v-container>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="$router.push({ name: 'Collections' })"
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
import Component from 'vue-class-component';
import RandomGenerator from '@/components/RandomGenerator.vue';
import { Collection } from '@/types/generated/graphql';

const PreviewCollectionProps = Vue.extend({
  props: {
    collectionId: {
      type: String,
      required: true,
    },
  },
});

@Component({
  components: {
    RandomGenerator,
  },
})
export default class PreviewCollection extends PreviewCollectionProps {
  get collection(): Collection | undefined {
    return this.$store.getters.getCollections(this.collectionId);
  }
}
</script>
