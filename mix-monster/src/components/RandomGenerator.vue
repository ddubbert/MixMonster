<template>
  <v-container>
    <v-row align='center' justify='center'>
      <v-spacer></v-spacer>
      <b class='myHeading'>{{collection.title}}</b>
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
        v-for='(category, index) in collection.categories'
        :key='index'
      >
        <v-card style='height: 100%'>
          <v-alert
            outlined
            color='primary'
            style='border-width: 2px !important; height: 100%'
            class='pa-0'
          >
            <v-toolbar dark color='primary' flat width='100%'>
              <v-card-title class='pl-0'><b>{{ category.title }}</b></v-card-title>
            </v-toolbar>

            <v-card-text>
              <v-expansion-panels multiple>
                <v-expansion-panel
                  v-for="(expression, i) in category.expressions"
                  :key='`panel${i}`'
                  :readonly='!expression.image'
                >
                  <v-expansion-panel-header disable-icon-rotate>
                    <template v-slot:actions>
                      <v-icon
                        color='accent'
                        :style='`display:${!expression.image ? "none" : "visible"}`'
                      >
                        mdi-camera
                      </v-icon>
                    </template>
                    {{ expression.title }}
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
                            :src='expression.image'
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
        <b class='mixButton'>Mix It!</b>
      </v-btn>
      <v-spacer></v-spacer>
    </v-row>

    <v-row class='ma-3' align='center' justify='center' v-if='randomSelection.length > 0'>
      <v-spacer></v-spacer>
      <b class='text-h4'>Dein persönlicher Monster-Mix:</b>
      <v-spacer></v-spacer>
    </v-row>

    <v-row
      align='center'
      justify='center'
      class='ma-2'
      v-if='randomSelection.length > 0'
    >
      <v-col
        v-for='(expression, expIndex) in randomSelection'
        :key='`exp${expIndex}`'
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
                {{ collection.categories[expIndex].title }}
              </v-card-title>
            </v-row>

            <v-row
              align='center'
              justify='center'
              class='ma-1'
              v-if='expression.title.length > 0'
            >
              <v-chip
                class="mb-4"
                color='primary'
              >
                <b>{{ expression.title }}</b>
              </v-chip>
            </v-row>

            <v-row
              align='center'
              justify='center'
              class='ma-1  mb-3'
              v-if='expression.image'
            >
              <v-card flat>
                <v-alert outlined color='error'>
                  <v-img
                    contain
                    :width='imageSize'
                    :height='imageSize'
                    :src='expression.image'
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
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Category, Collection, Expression } from 'src/types/collection';

export default Vue.extend({
  name: 'RandomGenerator',

  props: {
    collection: {
      type: Object as () => Collection,
      required: true,
    },
  },

  data() {
    return {
      randomSelection: [] as Expression[],
    };
  },

  computed: {
    imageSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 200;
        case 'sm': return 150;
        case 'md': return 150;
        case 'lg': return 150;
        case 'xl': return 200;
        default: return 150;
      }
    },
  },

  methods: {
    generateRandomSelection() {
      const random = this.collection.categories.map((cat: Category) => cat
        .expressions[Math.floor(Math.random() * cat.expressions.length)]);

      this.randomSelection.splice(0, this.randomSelection.length);
      this.randomSelection.push(...random);
    },
  },
});
</script>

<style scoped>
.mixButton {
  font-size: 2.5rem;
}
</style>
