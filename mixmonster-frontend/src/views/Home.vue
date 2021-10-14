<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center' class='mb-16'>
          <strong class='appTitle'>Willkommen beim MixMonster!</strong>
        </v-row>

        <v-row align='center' justify='center'>
          <v-col xl='4' lg='4' md='6' sm='8' xs='12'  class='pa-5'>
            <v-row align='center' justify='center' class='mb-10 mt-10'>
              <strong class='mySubtitle'>Du kannst</strong>
            </v-row>

            <v-row align='center' justify='center' class='mb-14'>
              <v-btn
                to='collections'
                class='ml-1 mr-1'
                color='primary'
                x-large
              >
                Zur MixMonster Verwaltung
              </v-btn>
            </v-row>

            <v-row align='center' justify='center'>
              <strong class='mySubtitle'>oder</strong>
            </v-row>

            <v-row align='center' justify='center' class='mt-16'>
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
                    Ein MixMonster nutzen
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
    console.log(this.id);
    // this.$router.push({
    //   name: 'Pre',
    // });
  }
}
</script>
