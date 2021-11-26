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

        <v-row align='center' justify='center' class='mb-5'>
          <span class='text-h4 text-md-h3' align='center'>
            <strong>Willkommen beim MixMonster!</strong>
          </span>
        </v-row>

        <v-row align='center' justify='center'>
          <v-col xl='4' lg='4' md='6' sm='8' xs='12'  class='pa-5'>
            <v-row align='center' justify='center' class='mb-5 mt-5'>
              <span class='text-h5 text-md-h4'>
                <strong>Du kannst</strong>
              </span>
            </v-row>

            <v-row align='center' justify='center' class='mb-10'>
              <v-btn
                to='collections'
                class='ml-1 mr-1'
                color='primary'
                x-large
              >
                MixMonster verwalten
              </v-btn>
            </v-row>

            <v-row align='center' justify='center'>
              <span class='text-h5 text-md-h4'>
                <strong>oder</strong>
              </span>
            </v-row>

            <v-row align='center' justify='center' class='mt-10 mb-10'>
              <v-col>
                <v-row align='center' justify='center'>
                  <v-text-field
                    v-model="id"
                    outlined
                    clearable
                    label="Referenznummer des MixMonsters"
                    type="text"
                  ></v-text-field>
                </v-row>
                <v-row align='center' justify='center'>
                  <v-btn
                    @click.stop='useCollection'
                    class='ml-1 mr-1'
                    color='primary'
                    x-large
                  >
                    MixMonster nutzen
                  </v-btn>
                </v-row>
              </v-col>
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
import 'vue-class-component/hooks';

@Component
export default class Home extends Vue {
  name = 'Home';

  id = '';

  useCollection(): void {
    if (this.id) {
      this.$router.push({
        name: 'UseCollection',
        params: {
          collectionId: this.id,
        },
      });
    }
  }
}
</script>
