<template>
  <v-container v-if='currentCollection'>
    <v-row align='center' justify='center' class='mb-8'>
      <v-btn-toggle
        active-class=''
        shaped
        dense
        background-color='transparent'
        dark
        v-model='toggleNone'
      >
        <v-btn
          @click.stop='generateRandomSelection()'
          class='pa-8'
          x-large
          light
          :loading='!generationPossible'
          :disabled='rollCount > 0 && !currentCollection.allowReRoll'
          color='accent'
          :style='{ border: `${rollCount > 0 ? primary : accent} solid 5px !important` }'
        >
          <strong class='text-h5 text-md-h3'>
            {{ reRollAllowed ? 'Mix It!' : '...' }}
          </strong>
        </v-btn>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color='primary'
              light
              v-bind="attrs"
              v-on="on"
              class='pt-8 pb-8'
              @click.stop='copyToClipboard()'
              x-large
              :disabled='rollCount <= 0'
              :style='{ border: `${rollCount > 0 ? primary : accent} solid 5px !important` }'
            >
              <v-icon x-large>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Zufallsauswahl in die Zwischenablage kopieren</span>
        </v-tooltip>
      </v-btn-toggle>
    </v-row>

    <v-row
      justify='center'
      align='start'
      class='pa-2'
    >
      <v-col
        xs='12'
        sm='6'
        md='6'
        lg='4'
        xl='3'
        cols='12'
        v-for='(category, categoryIndex) in currentCollection.categories'
        :key='`category${categoryIndex}`'
      >
        <v-expansion-panels
          readonly
          :value='0'
        >
          <v-expansion-panel class='mb-2'>
            <v-expansion-panel-header
              :color='editableCategory === categoryIndex ? "accent" : "primary"'
            >
              <template v-slot:actions>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      x-large
                      color='white'
                      @click.stop='activateCategory(categoryIndex)'
                    >
                      {{ category.selectable ? 'mdi-cog' : 'mdi-eye' }}
                    </v-icon>
                  </template>
                  {{ category.selectable ? 'Vorauswahl bearbeiten' : 'Kriterien anzeigen' }}
                </v-tooltip>
              </template>

              <span class='text-h5 white--text text-break'>
                <strong>{{ category.title }}</strong>
              </span>
            </v-expansion-panel-header>

            <v-expansion-panel-content
              :style="{
                border: `5px solid ${editableCategory === categoryIndex ? accent : primary}`,
                ['border-bottom-left-radius']: 'inherit',
                ['border-bottom-right-radius']: 'inherit',
              }"
              class='pa-0'
            >
              <v-list nav v-if='editableCategory === categoryIndex'>
                <v-list-item
                  :key='`category${categoryIndex}_edit_title`'
                  readonly
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class='text-h6 text-break'
                      v-text='category.selectable
                        ? "Deine Vorauswahl"
                        : "Kriterien dieser Kategorie"'
                    >
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action v-if='category.selectable'>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-checkbox
                          v-bind="attrs"
                          v-on="on"
                          :input-value="selected[categoryIndex].length === category.criteria.length"
                          color='primary'
                          @click='changeWholeSelectionFor(categoryIndex)'
                        ></v-checkbox>
                      </template>
                      {{
                        selected[categoryIndex].length === category.criteria.length
                          ? 'Alles abwählen'
                          : 'Alles auswählen'
                      }}
                    </v-tooltip>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item
                  v-for='(criteria, criteriaIndex) in category.criteria'
                  :key='`category${categoryIndex}_criteria${criteriaIndex}`'
                  :input-value='selected[categoryIndex].includes(criteriaIndex)'
                  @click='changeSelected(categoryIndex, criteriaIndex)'
                  :color='randomSelection.length > 0
                    && randomSelection[categoryIndex].includes(criteria) ? "accent" : "primary"'
                >
                  <v-list-item-icon>
                    <v-avatar size='45'
                              rounded
                              style='border: 2px solid white;'
                              @click.stop='openImageFor(criteria)'
                    >
                      <v-img :aspect-ratio='16/9'
                             :src='criteria.image'
                             alt='Bild des Kriteriums'
                             v-if='!!criteria.image'
                      />
                    </v-avatar>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title v-if='criteria.showTitle'
                                       v-text='criteria.title'
                                       class='text-break'>
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action v-if='category.selectable'>
                    <v-checkbox
                      :input-value="selected[categoryIndex].includes(criteriaIndex)"
                      color='primary'
                      readonly
                    ></v-checkbox>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-list nav v-else-if='randomSelection.length > 0'>
                <v-list-item
                  v-for='(criteria, criteriaIndex) in randomSelection[categoryIndex]'
                  :key='`selection${categoryIndex}_criteria${criteriaIndex}`'
                  :input-value='true'
                  @click='openImageFor(criteria)'
                  :color='generationPossible ? "accent" : "gray"'
                >
                  <v-list-item-icon>
                    <v-avatar size='45'
                              rounded
                              style='border: 2px solid white;'
                              @click.stop='openImageFor(criteria)'
                    >
                      <v-img :aspect-ratio='16/9'
                             :src='criteria.image'
                             alt='Bild des Kriteriums'
                             v-if='!!criteria.image'
                      />
                    </v-avatar>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title v-if='criteria.showTitle'
                                       v-text='criteria.title'
                                       class='text-break'>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-overlay :value="overlay" @click.native='overlay = false'>
      <v-img
        :src='overlayImage'
        @click='overlay = false'
        style='border: 5px solid white;'
      ></v-img>
    </v-overlay>
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

function getRandomSubArray<T>(array: T[], subArrayLength: number): T[] {
  let amount = subArrayLength;
  let len = array.length;
  const result = new Array(subArrayLength);
  const taken = new Array(len);

  if (amount > len) {
    throw new RangeError('getRandomCriteriaSelection: more elements taken than available');
  }
  while (amount--) {
    const x = Math.floor(Math.random() * len);
    result[amount] = array[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

@Component
export default class RandomGenerator extends RandomGeneratorProps {
  primary = this.$vuetify.theme.themes.dark.primary;

  accent = this.$vuetify.theme.themes.dark.accent;

  secondary = this.$vuetify.theme.themes.dark.secondary;

  randomSelection: Criteria[][] = [];

  currentCollection: Collection = { ...this.collection };

  selected: number[][] = this.collection.categories
    .map((category) => category.criteria.map((_, i) => i));

  overlay = false

  overlayImage = ''

  generationPossible = true

  animationIntervalRef: number | undefined = undefined

  animationInterval = 150

  animationDuration = 3000

  editableCategory = -1

  rollCount = 0

  toggleNone = null

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

  get canRoll(): boolean {
    return this.generationPossible && this.reRollAllowed;
  }

  get reRollAllowed(): boolean {
    return this.rollCount === 0 || this.currentCollection.allowReRoll;
  }

  copyToClipboard(): void {
    const base = `Dein ${this.currentCollection.title} MonsterMix:`;
    const selection = this.randomSelection.reduce((acc, randomCriteria, index) => {
      const criteriaString = randomCriteria.map((it) => it.title).join(', ');
      return `${acc}

        ${this.currentCollection.categories[index].title} - ${criteriaString}`;
    }, base);
    navigator.clipboard.writeText(selection);
  }

  changeWholeSelectionFor(categoryIndex: number): void {
    const originalCriteriaAmount = this.currentCollection.categories[categoryIndex].criteria.length;
    const selectedCriteriaAmount = this.selected[categoryIndex].length;
    this.selected[categoryIndex].splice(0);

    if (selectedCriteriaAmount !== originalCriteriaAmount) {
      this.selected[categoryIndex].push(...this.currentCollection
        .categories[categoryIndex].criteria.map((_, i) => i));
    } else {
      const minCriteriaAmount = this.currentCollection.categories[categoryIndex].criteriaRollAmount;
      this.selected[categoryIndex].push(...Array(minCriteriaAmount).keys());
    }
  }

  activateCategory(categoryIndex: number): void {
    this.editableCategory = this.editableCategory === categoryIndex ? -1 : categoryIndex;
  }

  changeSelected(categoryIndex: number, criteriaIndex: number): void {
    const { selectable, criteriaRollAmount } = this.currentCollection.categories[categoryIndex];
    if (!selectable) return;

    const index = this.selected[categoryIndex].indexOf(criteriaIndex);
    if (index >= 0) {
      if (this.selected[categoryIndex].length <= criteriaRollAmount) return;
      this.selected[categoryIndex].splice(index, 1);
    } else this.selected[categoryIndex].push(criteriaIndex);
  }

  openImageFor(criteria: Criteria): void {
    if (criteria.image && criteria.image.length > 0) {
      this.overlayImage = criteria.image;
      this.overlay = true;
    }
  }

  animateSelection(selection: Criteria[][]): void {
    this.generationPossible = false;
    // this.editableCategory = -1;
    const allIndices = this.currentCollection.categories.map((c) => c.criteria.map((_, i) => i));

    this.animationIntervalRef = setInterval(() => {
      this.randomSelection.splice(0, this.randomSelection.length);
      this.randomSelection.push(...this.currentCollection.categories.map((c, index) => {
        const randomIndices = getRandomSubArray(allIndices[index], c.criteriaRollAmount);
        return c.criteria.filter((_, i) => randomIndices.includes(i));
      }));
    }, this.animationInterval);

    setTimeout(() => {
      clearInterval(this.animationIntervalRef);
      this.randomSelection.splice(0, this.randomSelection.length);
      this.randomSelection.push(...selection);
      this.generationPossible = true;
      this.rollCount += 1;
    }, this.animationDuration);
  }

  generateRandomSelection(): void {
    if (this.canRoll) {
      const random = this.currentCollection.categories.map((category, categoryIndex) => {
        const { criteriaRollAmount } = category;
        const selection = [...this.selected[categoryIndex]];

        const randomIndices = getRandomSubArray(selection, criteriaRollAmount);
        return category.criteria.filter((_, i) => randomIndices.includes(i));
      });

      this.animateSelection(random);
    }
  }

  mounted(): void {
    const emptySelection = this.currentCollection.categories
      .map((category) => [...Array(category.criteriaRollAmount)].map(() => ({
        showTitle: false,
        title: '',
        image: 'https://i.pinimg.com/474x/2e/9d/dd/2e9dddaac786be790c35db3587469350.jpg',
      })));
    this.randomSelection.splice(0, this.randomSelection.length);
    this.randomSelection.push(...emptySelection);
  }
}
</script>

<style scoped>
.mixButton {
  font-size: 2.5rem;
}

.v-btn-toggle > .v-btn.v-btn {
  opacity: 1 !important;
}

.theme--light.v-btn--active::before,
.theme--light.v-btn--active:hover::before, .theme--light.v-btn--active  {
  opacity: 0 !important;
}

.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
