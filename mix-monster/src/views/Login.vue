<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-row align='center' justify='center'>
          <v-col xs='12' sm='8' md='4'>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Anmelden</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="mdi-at"
                    name="email"
                    label="Email"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Passwort"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" to="/">Anmelden</v-btn>
                <v-btn color="primary" to="/" text>Noch keinen Account?</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Login',

  components: {
  },
});
</script>
