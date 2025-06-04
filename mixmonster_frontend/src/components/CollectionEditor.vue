<template>
  <v-container>
    <v-row align='center' justify='center'>
      <v-col xs='12' sm='12' md='12' lg='8'>
        <v-text-field
          outlined
          v-model='collection.title'
          label='Name des MixMonsters'
          clearable
          class='text-h6 text-md-h5'
          :rules="[
            () => !!collection.title
              && collection.title.length >= 1
              && collection.title.trim().length >= 1
              || `Das MixMonster muss einen Namen haben!`,
          ]"
          @blur='checkTitle()'
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-row align='center' justify="center" class='mt-n5'>
      <v-col  xs='12' sm='12' md='12' lg='8'>
        <v-row align='center' justify='center'>
          <v-switch inset v-model="collection.allowReRoll"/>
          <div>
            Erneutes würfeln erlauben?
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on='on' medium color='primary' class='mb-10'>
                  mdi-message-question-outline
                </v-icon>
              </template>
              Nutzende, die mit ihrem zufälligen MonsterMix nicht zufrieden sind,
              erhalten hierdurch die Möglichkeit, erneut zu würfeln.
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
        <v-expansion-panels multiple v-model="categoryPanels">
          <v-expansion-panel
            v-for='(category, categoryIndex) in collection.categories'
            :key='`category${categoryIndex}`'
            class='mt-2 mb-2'
          >
            <v-expansion-panel-header color='primary'>
              <template v-slot:actions>
                <v-icon x-large color='white'>mdi-menu-down</v-icon>
              </template>

              <v-col cols='1' xl='1' lg='1' md='1' sm='1'>
                <v-row>
                  <v-btn
                    @click.stop='moveCategoryUp(categoryIndex)'
                    icon
                    color='white'
                    :disabled='categoryIndex === 0'
                  >
                    <v-icon v-bind='categoryIconSize'>mdi-chevron-up</v-icon>
                  </v-btn>
                </v-row>

                <v-row>
                  <v-btn
                    @click.stop='moveCategoryDown(categoryIndex)'
                    icon
                    color='white'
                    :disabled='categoryIndex === collection.categories.length - 1'
                  >
                    <v-icon v-bind='categoryIconSize'>mdi-chevron-down</v-icon>
                  </v-btn>
                </v-row>
              </v-col>

              <v-col cols='11' xl='11' lg='11' md='11' sm='11'>
                <span class='text-h6 text-md-h5 white--text text-break'>
                  <strong>{{ category.title }}</strong>
                </span>
              </v-col>
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
                    @blur='checkCategoryTitle(categoryIndex)'
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row align='center' justify="center" class='mt-n5'>
                <v-col sm='12' md='6'>
                  <v-row align='center' justify='center'>
                    <v-switch inset v-model="category.selectable" color='accent'/>
                    <div>
                      Vorauswahl erlauben?
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on='on' medium color='accent' class='mb-10'>
                            mdi-message-question-outline
                          </v-icon>
                        </template>
                        Nutzende des MixMonsters können mögliche Kriterien dieser Kategorie vor
                        einem MonsterMix eingrenzen bzw. eine Vorauswahl tätigen.
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
                        @blur='checkCriteriaRollAmount(categoryIndex)'
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
                        Diese Zahl bestimmt, wie viele Kriterien bei einem MonsterMix für diese
                        Kategorie generiert werden.
                      </v-tooltip>
                    </div>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col class='pa-0'>
                  <v-expansion-panels multiple v-model="criteriaPanels[categoryIndex]">
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

                            <v-row align='center'>
                              <v-col cols='1' xl='1' lg='1' md='1' sm='1'>
                                <v-row>
                                  <v-btn
                                    @click.stop='moveCriteriaUp(categoryIndex, criteriaIndex)'
                                    icon
                                    color='white'
                                    :disabled='criteriaIndex === 0'
                                  >
                                    <v-icon v-bind='criteriaIconSize'>mdi-chevron-up</v-icon>
                                  </v-btn>
                                </v-row>

                                <v-row>
                                  <v-btn
                                    @click.stop='moveCriteriaDown(categoryIndex, criteriaIndex)'
                                    icon
                                    color='white'
                                    :disabled='criteriaIndex === collection
                                      .categories[categoryIndex].criteria.length - 1'
                                  >
                                    <v-icon v-bind='criteriaIconSize'>mdi-chevron-down</v-icon>
                                  </v-btn>
                                </v-row>
                              </v-col>

                              <v-col class='pa-0 pl-md-5 pl-sm-3 pl-3 shrink'>
                                <v-avatar size='45'
                                          rounded
                                          style='border: 2px solid white;'>
                                  <v-img v-if='!!criteria.image'
                                         :aspect-ratio='16/9'
                                         :src='criteria.image'
                                         alt='Bild des Kriteriums'/>
                                </v-avatar>
                              </v-col>

                              <v-col>
                                <span v-if='criteria.showTitle'
                                      class='text-subtitle-1 text-md-h6 white--text text-break'>
                                  <strong>{{ criteria.title }}</strong>
                                </span>
                                <span v-else
                                      class='text-subtitle-1 text-md-h6 white--text text-break
                                      text-decoration-line-through'>
                                  <strong>{{ criteria.title }}</strong>
                                </span>
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
                                required
                                v-model='criteria.title'
                                label='Name des Kriteriums'
                                clearable
                                color='accent'
                                :rules="[
                                  () => !!criteria.title
                                    && criteria.title.length >= 1
                                    && criteria.title.trim().length >= 1
                                    || `Es muss ein Name für Kriterien vergeben werden!`,
                                ]"
                                @blur='checkCriteriaTitle(categoryIndex, criteriaIndex)'
                              >
                                <template v-slot:append-outer>
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        v-model="criteria.showTitle"
                                        :color='criteria.showTitle ? "accent" : "gray"'
                                        v-on='on'
                                        @click.stop='criteria.showTitle = !criteria.showTitle'
                                      >
                                        {{ criteria.showTitle ? 'mdi-eye' : 'mdi-eye-off' }}
                                      </v-icon>
                                    </template>
                                    Titel für Nutzende des MixMonsters anzeigen?<br>
                                    Wird dies ausgeschaltet, ist nur das Bild sichtbar.
                                  </v-tooltip>
                                </template>
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
                                append-outer-icon='mdi-camera'
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
                              justify='end'
                              class='mt-1'
                            >
                              <v-btn
                                @click='deleteCriteria(categoryIndex, criteriaIndex)'
                                text
                                class='ml-1 mr-1'
                                color='error'
                                x-large
                              >
                                Kriterium Löschen
                              </v-btn>
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
        showTitle: true,
        title: 'Kriterium',
      },
    ],
  };

  primary = this.$vuetify.theme.themes.dark.primary;

  accent = this.$vuetify.theme.themes.dark.accent;

  collection: Collection = JSON.parse(JSON.stringify(this.initialCollection));

  categoryPanels : number[] = [];

  criteriaPanels : number[][] = [];

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

  get categoryIconSize() {
    const size = ({
      xs: 'medium',
      sm: 'medium',
      lg: 'large',
      xl: 'large',
    } as { [key: string]: string })[this.$vuetify.breakpoint.name];
    return size ? { [size]: true } : {};
  }

  get criteriaIconSize() {
    const size = ({
      xs: 'small',
      sm: 'small',
      lg: 'medium',
      xl: 'medium',
    } as { [key: string]: string })[this.$vuetify.breakpoint.name];
    return size ? { [size]: true } : {};
  }

  checkTitle(): void {
    const { title } = this.collection;

    if (!title || title.trim().length === 0) this.collection.title = 'MixMonster';
  }

  checkCategoryTitle(catIndex: number): void {
    const { title } = this.collection.categories[catIndex];

    if (!title || title.trim().length === 0) {
      this.collection.categories[catIndex].title = `Kategorie ${catIndex + 1}`;
    }
  }

  checkCriteriaRollAmount(catIndex: number): void {
    const criteriaAmount = this.collection.categories[catIndex].criteria.length;

    if (!this.collection.categories[catIndex].criteriaRollAmount
      || this.collection.categories[catIndex].criteriaRollAmount <= 0
      || this.collection.categories[catIndex].criteriaRollAmount > criteriaAmount) {
      this.collection.categories[catIndex].criteriaRollAmount = 1;
    }
  }

  checkCriteriaTitle(catIndex: number, critIndex: number): void {
    const { title } = this.collection.categories[catIndex].criteria[critIndex];

    if (!title || title.trim().length === 0) {
      this.collection.categories[catIndex].criteria[critIndex].title = `Kriterium ${critIndex + 1}`;
    }
  }

  addCategory(): void {
    this.collection.categories.push(JSON.parse(JSON.stringify(this.categoryTemplate)));
    this.categoryPanels.push(this.collection.categories.length - 1);
    this.criteriaPanels.push([0]);
  }

  deleteCategory(categoryIndex: number): void {
    const updated = this.categoryPanels
      .filter((it) => it !== categoryIndex)
      .map((it) => (it > categoryIndex ? it - 1 : it));

    this.categoryPanels.splice(0);
    this.categoryPanels.push(...updated);
    this.criteriaPanels.splice(categoryIndex, 1);
    this.collection.categories.splice(categoryIndex, 1);
  }

  moveCategoryDown(categoryIndex: number): void {
    const updated = this.categoryPanels.map((it) => {
      if (it === categoryIndex + 1) return categoryIndex;
      if (it === categoryIndex) return categoryIndex + 1;
      return it;
    });

    this.categoryPanels.splice(0);
    this.categoryPanels.push(...updated);

    this.criteriaPanels
      .splice(categoryIndex + 1, 0, this.criteriaPanels.splice(categoryIndex, 1)[0]);
    this.collection.categories
      .splice(categoryIndex + 1, 0, this.collection.categories.splice(categoryIndex, 1)[0]);
  }

  moveCategoryUp(categoryIndex: number): void {
    const updated = this.categoryPanels.map((it) => {
      if (it === categoryIndex - 1) return categoryIndex;
      if (it === categoryIndex) return categoryIndex - 1;
      return it;
    });

    this.categoryPanels.splice(0);
    this.categoryPanels.push(...updated);

    this.criteriaPanels
      .splice(categoryIndex - 1, 0, this.criteriaPanels.splice(categoryIndex, 1)[0]);
    this.collection.categories
      .splice(categoryIndex - 1, 0, this.collection.categories.splice(categoryIndex, 1)[0]);
  }

  addCriteria(categoryIndex: number): void {
    this.collection.categories[categoryIndex].criteria.push({
      showTitle: true,
      title: `Kriterium ${this.collection.categories[categoryIndex].criteria.length + 1}`,
    });

    this.criteriaPanels[categoryIndex]
      .push(this.collection.categories[categoryIndex].criteria.length - 1);
  }

  deleteCriteria(categoryIndex: number, criteriaIndex: number): void {
    const updated = this.criteriaPanels[categoryIndex]
      .filter((it) => it !== criteriaIndex)
      .map((it) => (it > criteriaIndex ? it - 1 : it));

    this.criteriaPanels[categoryIndex].splice(0);
    this.criteriaPanels[categoryIndex].push(...updated);
    this.collection.categories[categoryIndex].criteria.splice(criteriaIndex, 1);
  }

  moveCriteriaDown(categoryIndex: number, criteriaIndex: number): void {
    const updated = this.criteriaPanels[categoryIndex].map((it) => {
      if (it === criteriaIndex + 1) return criteriaIndex;
      if (it === criteriaIndex) return criteriaIndex + 1;
      return it;
    });

    this.criteriaPanels[categoryIndex].splice(0);
    this.criteriaPanels[categoryIndex].push(...updated);

    this.collection.categories[categoryIndex].criteria.splice(
      criteriaIndex + 1, 0,
      this.collection.categories[categoryIndex].criteria.splice(criteriaIndex, 1)[0],
    );
  }

  moveCriteriaUp(categoryIndex: number, criteriaIndex: number): void {
    const updated = this.criteriaPanels[categoryIndex].map((it) => {
      if (it === criteriaIndex - 1) return criteriaIndex;
      if (it === criteriaIndex) return criteriaIndex - 1;
      return it;
    });

    this.criteriaPanels[categoryIndex].splice(0);
    this.criteriaPanels[categoryIndex].push(...updated);

    this.collection.categories[categoryIndex].criteria.splice(
      criteriaIndex - 1, 0,
      this.collection.categories[categoryIndex].criteria.splice(criteriaIndex, 1)[0],
    );
  }

  mounted(): void {
    this.criteriaPanels.push(...new Array<number[]>(this.collection.categories.length));
  }

  // selectedImage(categoryIndex: number, criteriaIndex: number, event: Event): void {
  //   if (event.target) {
  //     const target = event.target as HTMLInputElement;
  //     if (target.files && target.files[0]) {
  //       this.$set(
  //         this.collection.categories[categoryIndex].criteria[criteriaIndex],
  //         'file',
  //         target.files[0],
  //       );
  //       const fileReader = new FileReader();
  //       fileReader.onload = (e) => {
  //         const r = e.target?.result || undefined;
  //         this.$set(
  //           this.collection.categories[categoryIndex].criteria[criteriaIndex],
  //           'image',
  //           (typeof r === 'string') ? r : undefined,
  //         );
  //       };
  //       fileReader.readAsDataURL(target.files[0]);
  //     }
  //   }
  // }
  //
  // removeImage(categoryIndex: number, criteriaIndex: number): void {
  //   this.$set(
  //     this.collection.categories[categoryIndex].criteria[criteriaIndex],
  //     'file',
  //     undefined,
  //   );
  //   this.$set(
  //     this.collection.categories[categoryIndex].criteria[criteriaIndex],
  //     'image',
  //     undefined,
  //   );
  // }
}

export type CollectionEditorType = InstanceType<typeof CollectionEditor>;
</script>
