<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center'>
          <v-col cols='12' xl='4' lg='4' md='8' sm='10' xs='12' class='pa-5'>
            <v-img
              alt="MixMonster Logo"
              class="shrink mr-2"
              contain
              :src="$store.state.icon"
              transition="scale-transition"
            />
          </v-col>
        </v-row>

        <v-row align='center' justify='center' class='mt-10 mb-5'>
          <span class='text-h4 text-md-h3' align='center' v-if='collection'>
            Erstelle deinen persönlichen
            <strong v-if='collection'>
              {{ collection.title }}
            </strong>
            Monster-Mix
          </span>
          <span class='text-h4 text-md-h3' align='center' v-else>
            <strong>MixMonster nicht gefunden!</strong>
          </span>
        </v-row>
      </v-container>

      <v-container>
        <RandomGenerator v-if='collection' :collection='collection'></RandomGenerator>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import RandomGenerator from '@/components/RandomGenerator.vue';
import { Collection } from '@/types/generated/graphql';

const UseCollectionProps = Vue.extend({
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
export default class UseCollection extends UseCollectionProps {
  get collection(): Promise<Collection> | undefined {
    return this.$store.getters.getCollection(this.collectionId);
  }

  mounted(): void {
    this.$store.dispatch('getCollection', this.collectionId);
  }
}
</script>
