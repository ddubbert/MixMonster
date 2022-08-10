<template>
  <v-container
    v-if='currentCollection'
  >
    <v-container ref='screenshotArea' :style='containerStyle'>
      <v-row
        align='center'
        justify='center'
        class='mb-8'
      >
        <v-btn-toggle
          active-class=''
          shaped
          dense
          background-color='transparent'
          dark
          v-model='toggleNone'
          v-if='!isTakingScreenshot'
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
              {{ reRollAllowed ? 'Mix It!' : 'Mix It!' }}
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
                <v-icon x-large>mdi-download</v-icon>
              </v-btn>
            </template>
            <span>Aktuellen MonsterMix als Bild herunterladen</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-row>

      <v-row class='mb-8 mt-4' align='center' justify='center' v-if='isTakingScreenshot'>
        <span v-if='isTakingScreenshot' class='text-h4 text-md-h3 text-break' align='center'>
            Dein persönlicher
            <strong v-if='currentCollection'>
              {{ currentCollection.title }}
            </strong>
            Monster-Mix
        </span>
      </v-row>

      <v-row class='mt-8' align='center' justify='center' v-if='isTakingScreenshot'>
        <v-col cols='12' xl='4' lg='4' md='8' sm='10' xs='12' class='pa-5 pt-3'>
          <v-img
            alt="MixMonster Logo"
            class="shrink mr-2"
            contain
            :src="$store.state.icon"
            transition="scale-transition"
          />
        </v-col>
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
                        :color='!isTakingScreenshot ? "white" : "primary"'
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
                          <span v-bind="attrs" v-on="on">
                            <v-checkbox
                              :input-value=
                                "selected[categoryIndex].length === category.criteria.length"
                              color='primary'
                              @click='changeWholeSelectionFor(categoryIndex)'
                            ></v-checkbox>
                          </span>
                        </template>
                        {{
                          selected[categoryIndex].length === category.criteria.length
                            ? `Alles abwählen (für diese Kategorie
                                ${category.criteriaRollAmount > 1 ? 'müssen' : 'muss'} mindestens
                                ${category.criteriaRollAmount} ausgewählt sein)`
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
                      <v-avatar size='60'
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

                <v-list
                  v-else-if='randomSelection.length > 0'
                  nav
                  :style="{
                    ['background-color']: 'white !important',
                  }"
                >
                  <v-list-item
                    v-for='(criteria, criteriaIndex) in randomSelection[categoryIndex]'
                    :key='`selection${categoryIndex}_criteria${criteriaIndex}`'
                    :input-value='true'
                    @click='openImageFor(criteria)'
                    :color='generationPossible ? "accent" : "gray"'
                    :style="{
                      ['background-color']: 'white !important',
                     }"
                  >
                    <v-list-item-icon>
                      <v-avatar size='60'
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
                                         :class="`text-break ${isTakingScreenshot ? 'pl-8' : ''}`">
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    v-if='currentCollection.allowReRoll && rollCount > 0 && !isTakingScreenshot'
                    :input-value='true'
                  >
                    <v-list-item-content>
                      <v-row justify='center'>
                        <v-btn
                          @click.stop='rerollSelectionFor(categoryIndex)'
                          icon
                          x-large
                          :disabled='!generationPossible'
                        >
                          <v-icon color='accent' x-large>mdi-reload</v-icon>
                        </v-btn>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>

    <v-overlay :value="overlay" @click.native='overlay = false'>
      <v-img
        :src='overlayImage'
        @click='overlay = false'
        style='border: 5px solid white;'
      ></v-img>
    </v-overlay>

    <v-overlay :value="showLoadingOverlay" :opacity="1" color='white'>
      <v-progress-circular
        indeterminate
        size="64"
        color='primary'
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import html2canvas from 'html2canvas';
import Component from 'vue-class-component';
import { Collection, Criteria } from '@/types/generated/graphql';
import { copyToClipboard as copy } from '@/utils/ClipboardManager';

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

  isTakingScreenshot = false

  showLoadingOverlay = false

  containerStyle = {
    background: 'white',
  }

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

  async copyToClipboard(): Promise<void> {
    try {
      const base = `Dein ${this.currentCollection.title} MonsterMix:`;
      const selection = this.randomSelection.reduce((acc, randomCriteria, index) => {
        const criteriaString = randomCriteria.map((it) => it.title).join(', ');
        return `${acc}

        ${this.currentCollection.categories[index].title} - ${criteriaString}`;
      }, base);

      await copy(selection);
      await this.downloadAsImage();
    } catch (e) {
      console.log(e);
    }
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

  animateSelectionForCategory(categoryIndex: number, selection: Criteria[]): void {
    this.generationPossible = false;
    const allIndices = this.currentCollection.categories[categoryIndex].criteria.map((_, i) => i);

    this.animationIntervalRef = setInterval(() => {
      this.randomSelection[categoryIndex].splice(0);
      const random = getRandomSubArray(allIndices, selection.length);
      this.randomSelection[categoryIndex].push(...this.currentCollection
        .categories[categoryIndex]
        .criteria
        .filter((_, i) => random.includes(i)));
    }, this.animationInterval);

    setTimeout(() => {
      clearInterval(this.animationIntervalRef);
      this.randomSelection[categoryIndex].splice(0);
      this.randomSelection[categoryIndex].push(...selection);
      this.generationPossible = true;
    }, this.animationDuration);
  }

  animateSelection(selection: Criteria[][]): void {
    this.generationPossible = false;
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

  generateRandomSelectionForCategory(categoryIndex: number) : Criteria[] {
    const { criteriaRollAmount } = this.currentCollection.categories[categoryIndex];
    const selection = [...this.selected[categoryIndex]];

    const randomIndices = getRandomSubArray(selection, criteriaRollAmount);
    return this.currentCollection.categories[categoryIndex].criteria
      .filter((_, i) => randomIndices.includes(i));
  }

  generateRandomSelection(): void {
    if (this.canRoll) {
      this.editableCategory = -1;
      const random = this.currentCollection.categories
        .map((category, categoryIndex) => this.generateRandomSelectionForCategory(categoryIndex));

      this.animateSelection(random);
    }
  }

  rerollSelectionFor(categoryIndex: number): void {
    if (this.canRoll
      && categoryIndex >= 0
      && categoryIndex < this.currentCollection.categories.length) {
      this.editableCategory = -1;
      const categoryRandom = this.generateRandomSelectionForCategory(categoryIndex);

      this.animateSelectionForCategory(categoryIndex, categoryRandom);
    }
  }

  mounted(): void {
    const emptySelection = this.currentCollection.categories
      .map((category) => [...Array(category.criteriaRollAmount)].map(() => ({
        showTitle: false,
        title: '',
        image: `${this.$store.state.rootUrl}/mixmonster_question.png`,
      })));
    this.randomSelection.splice(0, this.randomSelection.length);
    this.randomSelection.push(...emptySelection);
  }

  async downloadAsImage(): Promise<void> {
    this.showLoadingOverlay = true;
    setTimeout(async () => {
      this.isTakingScreenshot = true;
      setTimeout(async () => {
        const row = this.$refs.screenshotArea as HTMLElement;
        const canvas = await html2canvas(row);
        const image = canvas.toDataURL();
        const l = document.createElement('a');

        l.download = `${this.currentCollection.title}.jpeg`;
        l.href = image;
        l.click();

        this.isTakingScreenshot = false;
        this.showLoadingOverlay = false;
      }, 500);
    }, 500);
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

.v-sheet.v-list:not(.v-sheet--outlined) {
  box-shadow: 0 0 0 0 white, 0 0 0 0 white, 0 0 0 0 white !important;
}
</style>
