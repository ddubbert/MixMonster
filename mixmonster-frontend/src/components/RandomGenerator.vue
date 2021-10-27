<template>
  <v-container>
    <v-row align='center' justify='center'>
      <v-spacer></v-spacer>
      <strong class='myHeading' align='center'>{{ currentCollection.title }}</strong>
      <v-spacer></v-spacer>
    </v-row>

    <v-row
      align='stretch'
      justify='center'
    >
      <v-col
        xs='6'
        sm='4'
        md='3'
        v-for='(category, catIndex) in currentCollection.categories'
        :key='`category${catIndex}`'
      >
        <v-card style='height: 100%'>
          <v-alert
            outlined
            color='primary'
            style='border-width: 2px !important; height: 100%'
            class='pa-0'
          >
            <v-toolbar dark color='primary' flat width='100%'>
              <v-card-title class='pl-0'>
                <strong>{{ category.title }}</strong>
              </v-card-title>
            </v-toolbar>

            <v-card-text>
              <v-expansion-panels multiple>
                <v-expansion-panel
                  v-for="(criteria, critIndex) in category.criteria"
                  :key='`panel${critIndex}`'
                  :readonly='!criteria.image'
                >
                  <v-expansion-panel-header disable-icon-rotate>
                    <template v-slot:actions>
                      <v-icon
                        color='accent'
                        :style='`display:${!criteria.image ? "none" : "visible"}`'
                      >
                        mdi-camera
                      </v-icon>
                    </template>
                    {{ criteria.title }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row
                      align='center'
                      justify='center'
                      class='ma-1  mb-3'
                    >
                      <v-card flat>
                        <v-alert outlined color='error'>
                          <v-img
                            contain
                            :width='imageSize'
                            :height='imageSize'
                            :src='criteria.image'
                          ></v-img>
                        </v-alert>
                      </v-card>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <v-row align='center' justify='center' class='ma-10'>
      <v-spacer></v-spacer>
      <v-btn
        @click='generateRandomSelection()'
        color='accent'
        class='ma-3'
        x-large
      >
        <strong class='mixButton'>Mix It!</strong>
      </v-btn>
      <v-spacer></v-spacer>
    </v-row>

    <v-row class='ma-3' align='center' justify='center' v-if='randomSelection.length > 0'>
      <v-spacer></v-spacer>
      <strong class='text-h4'>Dein persönlicher Monster-Mix:</strong>
      <v-spacer></v-spacer>
    </v-row>

    <v-row
      align='center'
      justify='center'
      class='ma-2'
      v-if='randomSelection.length > 0'
    >
      <v-col
        v-for='(criteria, critIndex) in randomSelection'
        :key='`criteria${critIndex}`'
        xs='6'
        sm='4'
        md='3'
        class='pa-0'
      >
        <v-card class='ma-2'>
          <v-alert
            outlined
            color='accent'
            style='border-width: 2px !important;'
          >
            <v-row
              align='center'
              justify='center'
              class='ma-1'
            >
              <v-card-title class='secondary--text'>
                {{ collection.categories[critIndex].title }}
              </v-card-title>
            </v-row>

            <v-row
              align='center'
              justify='center'
              class='ma-1'
              v-if='criteria.title.length > 0'
            >
              <v-chip
                class="mb-4"
                color='primary'
              >
                <strong>{{ criteria.title }}</strong>
              </v-chip>
            </v-row>

            <v-row
              align='center'
              justify='center'
              class='ma-1  mb-3'
              v-if='criteria.image'
            >
              <v-card flat>
                <v-alert outlined color='error'>
                  <v-img
                    contain
                    :width='imageSize'
                    :height='imageSize'
                    :src='criteria.image'
                  ></v-img>
                </v-alert>
              </v-card>
            </v-row>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Collection, Criteria } from '@/types/generated/graphql';

const RandomGeneratorProps = Vue.extend({
  props: {
    collection: {
      type: Object as () => Collection,
      required: true,
    },
  },
});

@Component
export default class RandomGenerator extends RandomGeneratorProps {
  currentCollection: Collection = { ...this.collection };

  randomSelection: Criteria[] = [];

  get imageSize(): number {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs': return 200;
      case 'sm': return 150;
      case 'md': return 150;
      case 'lg': return 150;
      case 'xl': return 200;
      default: return 150;
    }
  }

  generateRandomSelection(): void {
    const random = this.collection.categories.map((cat) => cat
      .criteria[Math.floor(Math.random() * cat.criteria.length)]);

    this.randomSelection.splice(0, this.randomSelection.length);
    this.randomSelection.push(...random);
  }
}
</script>

<style scoped>
.mixButton {
  font-size: 2.5rem;
}
</style>
