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
                v-for='(criteria, criteriaIndex) in category.criteria'
                :key='`criteria${criteriaIndex}`'
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
                        v-model='criteria.title'
                        label='Kriterium'
                      >
                      </v-text-field>
                    </v-row>

                    <v-row
                      align='center'
                      justify='start'
                      class='ma-1'
                    >
                      <v-text-field
                        v-model='criteria.image'
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
                      <v-card v-if='criteria.image'>
                        <v-img
                          contain
                          :width='imageSize'
                          :height='imageSize'
                          :src='criteria.image'
                        ></v-img>
                      </v-card>
                    </v-row>
                    <v-row
                      align='center'
                      justify='center'
                      class='ma-1'
                    >
                      <v-tooltip top v-if='criteria.image'>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            @click='removeImage(index, criteriaIndex)'
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
                            @click='deleteCriteria(index, criteriaIndex)'
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
                    @click='addCriteria(index)'
                    color='accent'
                    class='ma-1'
                    large
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large>mdi-plus-circle</v-icon>
                  </v-btn>
                </template>
                <span>Kriterium hinzufügen</span>
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
import Component from 'vue-class-component';
import { Collection, Criteria } from '@/types/generated/graphql';

const EditorProps = Vue.extend({
  props: {
    initialCollection: {
      type: Object as () => Collection,
      required: true,
    },
  },
});

@Component
export default class CollectionEditor extends EditorProps {
  collection = this.initialCollection;

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

  addCategory(): void {
    this.collection.categories.push({
      title: 'Kategoriename',
      selectable: true,
      criteriaRollAmount: 1,
      criteria: [{
        title: 'Kriterium',
      }] as Criteria[],
    });
  }

  deleteCategory(categoryIndex: number): void {
    this.collection.categories.splice(categoryIndex, 1);
  }

  addCriteria(categoryIndex: number): void {
    this.collection.categories[categoryIndex].criteria.push({ title: 'Kriterium' });
  }

  deleteCriteria(categoryIndex: number, criteriaIndex: number): void {
    this.collection.categories[categoryIndex].criteria.splice(criteriaIndex, 1);
  }

  selectedImage(categoryIndex: number, criteriaIndex: number, event: Event): void {
    if (event.target) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        this.$set(
          this.collection.categories[categoryIndex].criteria[criteriaIndex],
          'file',
          target.files[0],
        );
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const r = e.target?.result || undefined;
          this.$set(
            this.collection.categories[categoryIndex].criteria[criteriaIndex],
            'image',
            (typeof r === 'string') ? r : undefined,
          );
        };
        fileReader.readAsDataURL(target.files[0]);
      }
    }
  }

  removeImage(categoryIndex: number, criteriaIndex: number): void {
    this.$set(
      this.collection.categories[categoryIndex].criteria[criteriaIndex],
      'file',
      undefined,
    );
    this.$set(
      this.collection.categories[categoryIndex].criteria[criteriaIndex],
      'image',
      undefined,
    );
  }
}

export type CollectionEditorType = InstanceType<typeof CollectionEditor>;
</script>
