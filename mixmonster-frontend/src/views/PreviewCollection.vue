<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center'>
          <v-col cols='8' xl='2' lg='2' md='4' sm='4' xs='8'  class='pa-5'>
            <v-img
              alt="MixMonster Logo"
              class="shrink mr-2"
              contain
              src="@/assets/icon.png"
              transition="scale-transition"
            />
          </v-col>
        </v-row>

        <v-row align='center' justify='center' class='mt-10 mb-5'>
          <span class='text-h3' align='center' v-if='collection'>
            Dein persönlicher
            <strong v-if='collection'>
              {{ collection.title }}
            </strong>
            Monster-Mix
          </span>
          <span class='text-h3' align='center' v-else>
            <strong>Sammlung nicht gefunden!</strong>
          </span>
        </v-row>
      </v-container>

      <v-container>
        <RandomGenerator v-if='collection' :collection='collection'></RandomGenerator>
      </v-container>

      <v-container>
        <v-row align='center' justify='center'>
          <v-col xs='12' sm='12' md='12' lg='8'>
            <v-row align='center' justify='center'>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                         @click="$router.push({ name: 'Collections' })"
                         fab
                         color='error'
                         class='ma-3'
                         x-large
                         v-bind="attrs"
                         v-on="on"
                  >
                    <v-icon x-large>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                </template>
                <span>Zurück zur Übersicht</span>
              </v-tooltip>
            </v-row>
          </v-col>
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
  get collection(): Promise<Collection> | undefined {
    return this.$store.getters.getCollection(this.collectionId);
  }

  mounted(): void {
    if (!this.collection) this.$store.dispatch('getCollection', this.collectionId);
  }
}
</script>
