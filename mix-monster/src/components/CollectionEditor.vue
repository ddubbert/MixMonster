<template>
  <v-container>
    <v-row align='center' justify='center'>
      <v-col xs='12' sm='10' md='8'>
        <v-text-field
          outlined
          v-model='collection.title'
          label='Sammlungsname'
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row
      align='center'
      justify='center'
      v-for='(category, index) in collection.categories'
      :key='index'
    >
      <v-col xs='12' sm='10' md='8'>
        <v-card>
          <v-alert outlined color='primary' style='border-width: 5px !important'>
            <v-row align='center' justify='start' class='ma-2'>
              <v-col xs='12' sm='8' md='4'>
                <v-text-field
                  v-model='category.title'
                  label='Kategoriename'
                >
                </v-text-field>
              </v-col>

              <v-col>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click='deleteCategory(index)'
                      icon
                      class='ml-1 mr-1'
                      v-bind="attrs"
                      v-on="on"
                      color='error'
                      x-large
                    >
                      <v-icon x-large>mdi-delete-forever</v-icon>
                    </v-btn>
                  </template>
                  <span>Kategorie löschen</span>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row
              align='center'
              justify='start'
              class='ma-2'
            >
              <v-col
                v-for='(expression, expIndex) in category.expressions'
                :key='`exp${expIndex}`'
                xs='12'
                sm='6'
                md='6'
                lg='4'
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
                      justify='start'
                      class='ma-1'
                    >
                      <v-text-field
                        v-model='expression.title'
                        label='Ausprägung'
                      >
                      </v-text-field>
                    </v-row>

                    <v-row
                      align='center'
                      justify='start'
                      class='ma-1'
                    >
                      <v-text-field
                        v-model='expression.image'
                        label='Bild URL'
                        prepend-icon='mdi-camera'
                      >
                      </v-text-field>
                    </v-row>

                    <v-row
                      align='center'
                      justify='center'
                      class='ma-1  mb-3'
                    >
<!--                      <input-->
<!--                        style='display: none'-->
<!--                        type='file'-->
<!--                        accept='image/*'-->
<!--                        :ref='`cat${index}input${expIndex}`'-->
<!--                        @change='(event) => selectedImage(index, expIndex, event)'-->
<!--                      >-->
<!--                      <v-tooltip top v-if='!expression.image'>-->
<!--                        <template v-slot:activator="{ on, attrs }">-->
<!--                          <v-btn-->
<!--                            @click='$refs[`cat${index}input${expIndex}`][0].click()'-->
<!--                            icon-->
<!--                            class='ml-1 mr-1'-->
<!--                            v-bind="attrs"-->
<!--                            v-on="on"-->
<!--                            color='secondary'-->
<!--                          >-->
<!--                            <v-icon>mdi-camera</v-icon>-->
<!--                          </v-btn>-->
<!--                        </template>-->
<!--                        <span>Bild hochladen</span>-->
<!--                      </v-tooltip>-->

<!--                      <v-card v-if='expression.image' style='cursor: pointer'>-->
<!--                        <v-img-->
<!--                          @click='$refs[`cat${index}input${expIndex}`][0].click()'-->
<!--                          contain-->
<!--                          :width='imageSize'-->
<!--                          :height='imageSize'-->
<!--                          :src='expression.image'-->
<!--                        ></v-img>-->
<!--                      </v-card>-->
                      <v-card v-if='expression.image'>
                        <v-img
                          contain
                          :width='imageSize'
                          :height='imageSize'
                          :src='expression.image'
                        ></v-img>
                      </v-card>
                    </v-row>
                    <v-row
                      align='center'
                      justify='center'
                      class='ma-1'
                    >
                      <v-tooltip top v-if='expression.image'>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            @click='removeImage(index, expIndex)'
                            icon
                            class='ml-1 mr-1'
                            v-bind="attrs"
                            v-on="on"
                            color='error'
                          >
                            <v-icon>mdi-camera-off</v-icon>
                          </v-btn>
                        </template>
                        <span>Bild entfernen</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            @click='deleteExpression(index, expIndex)'
                            icon
                            class='ml-1 mr-1'
                            v-bind="attrs"
                            v-on="on"
                            color='error'
                          >
                            <v-icon large>mdi-delete-forever</v-icon>
                          </v-btn>
                        </template>
                        <span>Löschen</span>
                      </v-tooltip>
                    </v-row>
                  </v-alert>
                </v-card>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click='addExpression(index)'
                    color='accent'
                    class='ma-1'
                    large
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>mdi-plus-circle</v-icon>
                  </v-btn>
                </template>
                <span>Ausprägung hinzufügen</span>
              </v-tooltip>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
    <v-row align='center' justify='center'>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click='addCategory()'
            fab
            color='primary'
            class='ma-3'
            x-large
            v-bind="attrs"
            v-on="on"
          >
            <v-icon x-large>mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>Kategorie hinzufügen</span>
      </v-tooltip>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Collection, Expression } from 'src/types/collection';

const CollectionEditor = Vue.extend({
  name: 'CollectionEditor',

  props: {
    initialCollection: {
      type: Object as () => Collection,
      required: true,
    },
  },

  data() {
    return {
      collection: this.initialCollection,
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
    addCategory() {
      this.collection.categories.push({
        title: 'Kategoriename',
        expressions: [{
          title: 'Ausprägung',
        }] as Expression[],
      });
    },
    deleteCategory(categoryIndex: number) {
      this.collection.categories.splice(categoryIndex, 1);
    },
    addExpression(categoryIndex: number) {
      this.collection.categories[categoryIndex].expressions.push({ title: 'Ausprägung' } as Expression);
    },
    deleteExpression(categoryIndex: number, expIndex: number) {
      this.collection.categories[categoryIndex].expressions.splice(expIndex, 1);
    },
    selectedImage(categoryIndex: number, expIndex: number, event: Event) {
      if (event.target) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          this.$set(
            this.collection.categories[categoryIndex].expressions[expIndex],
            'file',
            target.files[0],
          );
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const r = e.target?.result || undefined;
            this.$set(
              this.collection.categories[categoryIndex].expressions[expIndex],
              'image',
              (typeof r === 'string') ? r : undefined,
            );
          };
          fileReader.readAsDataURL(target.files[0]);
        }
      }
    },
    removeImage(categoryIndex: number, expIndex: number) {
      this.$set(
        this.collection.categories[categoryIndex].expressions[expIndex],
        'file',
        undefined,
      );
      this.$set(
        this.collection.categories[categoryIndex].expressions[expIndex],
        'image',
        undefined,
      );
    },
  },
});

export type CollectionEditorType = InstanceType<typeof CollectionEditor>;
export default CollectionEditor;
</script>
