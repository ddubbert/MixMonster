<template>
  <v-container>
    <v-row align='center' justify='center'>
      <v-col xs='12' sm='12' md='12' lg='8'>
        <v-text-field
          outlined
          v-model='collection.title'
          label='Sammlungsname'
          clearable
          class='text-h5'
          :rules="[
            () => !!collection.title
              && collection.title.length >= 1
              && collection.title.trim().length >= 1
              || `Es muss ein Name für die Sammlung vergeben werden!`,
          ]"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row align='center' justify="center" class='mt-n10'>
      <v-col  xs='12' sm='12' md='12' lg='8'>
        <v-row align='center' justify='center'>
          <v-switch v-model="collection.allowReRoll"/>
          <div>
            Erneutes würfeln erlauben?
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on='on' medium color='primary' class='mb-10'>
                  mdi-message-question-outline
                </v-icon>
              </template>
              Nutzer die mit ihrem zufälligen MonsterMix nicht zufrieden sind
              erhalten hierdurch die Möglichkeit erneut zu würfeln.
            </v-tooltip>
          </div>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      align='center'
      justify='center'
    >
      <v-col  xs='12' sm='12' md='12' lg='8'>
        <v-expansion-panels multiple>
          <v-expansion-panel
            v-for='(category, categoryIndex) in collection.categories'
            :key='`category${categoryIndex}`'
            class='mt-2 mb-2'
          >
            <v-expansion-panel-header color='primary'>
              <template v-slot:actions>
                <v-icon x-large color='white'>mdi-menu-down</v-icon>
              </template>

              <span class='text-h5 white--text'><strong>{{ category.title }}</strong></span>
            </v-expansion-panel-header>

            <v-expansion-panel-content
              :style="{
                border: `5px solid ${primary}`,
                ['border-bottom-left-radius']: 'inherit',
                ['border-bottom-right-radius']: 'inherit',
              }"
            >
              <v-row class='mt-2' align='center' justify='start'>
                <v-col cols='12' xs='12' sm='10' md='8' lg='6'>
                  <v-text-field
                    v-model='category.title'
                    label='Kategoriename'
                    clearable
                    :rules="[
                      () => !!category.title
                        && category.title.length >= 1
                        && category.title.trim().length >= 1
                        || `Es muss ein Name für die Kategorie vergeben werden!`,
                    ]"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row align='center' justify="center" class='mt-n5'>
                <v-col sm='12' md='6'>
                  <v-row align='center' justify='center'>
                    <v-switch v-model="category.selectable" color='accent'/>
                    <div>
                      Vorauswahl erlauben?
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on='on' medium color='accent' class='mb-10'>
                            mdi-message-question-outline
                          </v-icon>
                        </template>
                        Nutzer können mögliche Kriterien dieser Kategorie vor einem MonsterMix
                        eingrenzen bzw. eine Vorauswahl tätigen.
                      </v-tooltip>
                    </div>
                  </v-row>
                </v-col>

                <v-col cols='12' xs='12' sm='12' md='6'>
                  <v-row align='center' justify='center'>
                    <v-col cols='2'>
                      <v-text-field
                        color='accent'
                        v-model.number='category.criteriaRollAmount'
                        :rules="[
                          () => !!category.criteriaRollAmount
                            && category.criteriaRollAmount >= 1
                            && category.criteriaRollAmount <= category.criteria.length
                            || `Zahl muss mindestens 1 und maximal die Anzahl der Kriterien sein!`,
                        ]"
                        type='number'
                      />
                    </v-col>

                    <div>
                      <span>Anzahl der Zufallskriterien</span>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on='on' medium color='accent' class='mb-10'>
                            mdi-message-question-outline
                          </v-icon>
                        </template>
                        Diese Zahl bestimmt, wieviele Zufallskriterium für Nutzer bei einem
                        MonsterMix für diese Kategorie generiert werden.
                      </v-tooltip>
                    </div>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col class='pa-0'>
                  <v-expansion-panels multiple>
                    <v-row
                      align='start'
                      class='ma-2 justify-sm-center justify-lg-start'
                    >
                      <v-col
                        v-for='(criteria, criteriaIndex) in category.criteria'
                        :key='`criteria${criteriaIndex}`'
                        cols='12'
                        xs='12'
                        sm='6'
                        md='6'
                        lg='6'
                        xl='4'
                        class='pa-1'
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color='accent'>
                            <template v-slot:actions>
                              <v-icon x-large color='white'>mdi-menu-down</v-icon>
                            </template>

                            <v-row>
                              <v-col v-if='!!criteria.title'>
                                <span class='text-h6 white--text'>
                                  <strong>{{ criteria.title }}</strong>
                                </span>
                              </v-col>

                              <v-col v-else-if='!!criteria.image' class='pa-0'>
                                <v-avatar color='white'
                                          size='45'
                                          rounded
                                          style='border: 2px solid white;'>
                                  <v-img :aspect-ratio='16/9'
                                         :src='criteria.image'
                                         alt='Bild des Kriteriums'/>
                                </v-avatar>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content
                            :style="{
                              border: `5px solid ${accent}`,
                              ['border-bottom-left-radius']: 'inherit',
                              ['border-bottom-right-radius']: 'inherit',
                            }"
                          >
                            <v-row
                              align='center'
                              justify='start'
                              class='mt-3'
                            >
                              <v-text-field
                                v-model='criteria.title'
                                label='Kriterium'
                                clearable
                                color='accent'
                              >
                              </v-text-field>
                            </v-row>

                            <v-row
                              align='center'
                              justify='start'
                              class='mt-1'
                            >
                              <v-text-field
                                v-model='criteria.image'
                                label='Bild URL'
                                prepend-icon='mdi-camera'
                                clearable
                                color='accent'
                              >
                              </v-text-field>
                            </v-row>

                            <v-row
                              align='center'
                              justify='center'
                              class='mt-1 mb-2'
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
                              class='mt-1'
                            >
                              <v-tooltip top v-if='criteria.image'>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    @click='removeImage(categoryIndex, criteriaIndex)'
                                    icon
                                    class='ml-1 mr-1'
                                    v-bind="attrs"
                                    v-on="on"
                                    color='error'
                                    x-large
                                  >
                                    <v-icon large>mdi-camera-off</v-icon>
                                  </v-btn>
                                </template>
                                <span>Bild entfernen</span>
                              </v-tooltip>
                              <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    @click='deleteCriteria(categoryIndex, criteriaIndex)'
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
                                <span>Löschen</span>
                              </v-tooltip>
                            </v-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-col>
                    </v-row>
                  </v-expansion-panels>
                </v-col>
              </v-row>

              <v-row class='ma-2' justify='center' align='center'>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click='addCriteria(categoryIndex)'
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
              </v-row>

              <v-row justify='end' align='center'>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click.stop='deleteCategory(categoryIndex)'
                      text
                      v-bind="attrs"
                      v-on="on"
                      color='error'
                      x-large
                    >
                      Kategorie Löschen
                    </v-btn>
                  </template>
                  <span>Kategorie löschen</span>
                </v-tooltip>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row align='center' justify='center'>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click='addCategory()'
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
import { Collection } from '@/types/generated/graphql';

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
  categoryTemplate = {
    title: 'Kategorie',
    selectable: true,
    criteriaRollAmount: 1,
    criteria: [
      {
        title: 'Kriterium',
      },
    ],
  };

  primary = this.$vuetify.theme.themes.dark.primary;

  accent = this.$vuetify.theme.themes.dark.accent;

  collection: Collection = JSON.parse(JSON.stringify(this.initialCollection));

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
    this.collection.categories.push({ ...this.categoryTemplate });
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
