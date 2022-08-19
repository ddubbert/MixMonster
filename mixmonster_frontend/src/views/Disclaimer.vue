<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center' class='ml-2 mr-2'>
          <v-col cols='12' xl='6' lg='8' md='10' sm='10' xs='12'>
            <v-row class='mb-16' align='center' justify='left'>
              <span class='text-h4 text-md-h3' align='center'>
                <strong>Haftungshinweis</strong>
              </span>
            </v-row>

            <v-row class='mb-16' align='center' justify='start'>
              <v-col class='ma-0 pa-0'>
                <span class='text-break text-body-1'>
                  Trotz sorgfältiger inhaltlicher Kontrolle kann keine Haftung für die Inhalte
                  dieser Website (MixMonster) übernommen werden. Entsprechend kann auch keine
                  Gewährleistung für die Korrektheit, Vollständigkeit und Anwendbarkeit der
                  enthaltenen Informationen übernommen werden.<br>
                  <br>
                  Für die Inhalte von verlinkten Fremdangeboten sind die jeweiligen Herausgeber
                  verantwortlich. Eine Haftung für eventuelle Datenschutz- und sonstige
                  Rechtsverletzungen aus diesen verlinkten Seiten wird nicht übernommen. Vor dem
                  Einrichten von Links sind die Webseiten der anderen Anbieter sorgfältig überprüft
                  worden. Es kann jedoch keine Gewähr für die Vollständigkeit und Richtigkeit von
                  Informationen übernommen werden, die über weiterführende Hyperlinks erreicht
                  werden. Falls von der Website MixMonster auf Seiten verwiesen wird, deren Inhalt
                  Anlass zu Beanstandungen gibt, wird um entsprechende Mitteilung an die
                  Webredaktion gebeten.<br>
                  <br>
                  Die Informationen auf den Seiten des MixMonsters stellen keinen Rechtsrat dar und
                  ersetzen in keinem Falle eine rechtskundige Beratung.<br>
                  <br>
                  Links aus anderen Websites auf Seiten des MixMonsters sind zulässig, sofern auf
                  die Herkunft angemessen hingewiesen wird.<br>
                  <br>
                  Seiten, die nur zum hochschulinternen Gebrauch bestimmt sind, dürfen nicht kopiert
                  und unter anderer URL weiteren Kreisen zugänglich gemacht werden, auch nicht unter
                  Angabe der Herkunft.<br>
                  <br>
                  <br>
                  <br>
                  Weitere wichtige Informationen finden Sie in unserem
                  <router-link to="impressum">Impressum</router-link> und
                  <router-link to="privacy">Datenschutzhinweis</router-link>.
                </span>
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
export default class Privacy extends Vue {
  name = 'Datenschutz';

  id = '';

  cookieHeader = [
    {
      text: 'Cookie',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Quelle',
      value: 'source',
    },
    {
      text: 'Zweck',
      value: 'reason',
    },
    {
      text: 'Speicherdauer',
      value: 'timeToLive',
    },
  ];

  cookies = [
    {
      name: 'AUTH_SESSION_ID',
      source: 'Keycloak',
      reason: 'Enthält die Identifikationsnummer der aktuellen Authentifizierungssitzung',
      timeToLive: 'Bis zum Ende der Browser-Sitzung',
    },
    {
      name: 'AUTH_SESSION_ID_LEGACY',
      source: 'Keycloak',
      reason: 'Enthält die Identifikationsnummer der aktuellen Authentifizierungssitzung',
      timeToLive: 'Bis zum Ende der Browser-Sitzung',
    },
    {
      name: 'KEYCLOAK_IDENTITY',
      source: 'Keycloak',
      reason: 'Enthält ein Token mit der Identifikationsnummer des aktuellen Benutzers',
      timeToLive: 'Bis zum Ende der Browser-Sitzung',
    },
    {
      name: 'KEYCLOAK_IDENTITY_LEGACY',
      source: 'Keycloak',
      reason: 'Enthält ein Token mit der Identifikationsnummer des aktuellen Benutzers',
      timeToLive: 'Bis zum Ende der Browser-Sitzung',
    },
    {
      name: 'KEYCLOAK_SESSION',
      source: 'Keycloak',
      reason: 'Enthält die Identifikationsnummer der aktuellen Browsersitzung',
      timeToLive: '10 Stunden',
    },
    {
      name: 'KEYCLOAK_SESSION_LEGACY',
      source: 'Keycloak',
      reason: 'Enthält die Identifikationsnummer der aktuellen Browsersitzung',
      timeToLive: '10 Stunden',
    },
  ];
}
</script>
