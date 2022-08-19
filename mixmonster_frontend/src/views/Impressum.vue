<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center' class='ml-2 mr-2'>
          <v-col cols='12' xl='6' lg='8' md='10' sm='10' xs='12'>
            <v-row class='mb-10' align='center' justify='left'>
              <span class='text-h4 text-md-h3' align='center'>
                <strong>Impressum</strong>
              </span>
            </v-row>

            <v-row align='center' justify='start'>
              <span class='text-break text-body-1'>
                <strong>Technische Hochschule Köln</strong> <br>
                Claudiusstr. 1 <br>
                50678 Köln <br>
                <br>
                <br>
                <strong>Postanschrift</strong> <br>
                Gustav-Heinemann-Ufer 54 <br>
                50968 Köln <br>
                <br>
                <br>
                T: + 49 221-8275-0 <br>
                F: + 49 221-8275-3131 <br>
                E: poststelle@th-koeln.de <br>
                <br>
                <br>
                Die TH Köln (Technische Hochschule Köln) ist eine Körperschaft des Öffentlichen
                Rechts. <br>
                Sie wird durch den Präsidenten Prof. Dr. Stefan Herzig gesetzlich vertreten. <br>
                <br>
                <br>
                <strong>Zuständige Aufsichtsbehörde:</strong> <br>
                Ministerium für Kultur und Wissenschaft des Landes Nordrhein-Westfalen <br>
                Völklinger Str. 49 <br>
                40221 Düsseldorf <br>
                T: +49 211-896-04 <br>
                F: +49 211-896-4555 <br>
                http://www.wissenschaft.nrw.de/ <br>
                <br>
                <br>
                Umsatzsteuer-Identifikationsnummer gem. § 27a Umsatzsteuergesetz: <br>
                DE 122653679 <br>
                <br>
                <br>
                <br>
                Weitere wichtige Informationen finden Sie in unserem
                <router-link to="disclaimer">Haftungshinweis</router-link> und
                <router-link to="privacy">Datenschutzhinweis</router-link>.
              </span>
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
export default class Impressum extends Vue {
  name = 'Impressum';

  id = '';
}
</script>
