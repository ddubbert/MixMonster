<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <strong v-if='collection' class='myHeading'>Sammlung bearbeiten:</strong>
          <strong v-else class='myHeading'>Sammlung nicht gefunden!</strong>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>

      <CollectionEditor
        v-if='collection'
        ref='editor'
        :initial-collection='collection'
      ></CollectionEditor>

      <v-container>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if='collection'
                @click='dialog = true'
                fab
                color='primary'
                class='ma-3'
                x-large
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large>mdi-arrow-left-circle</v-icon>
              </v-btn>
              <v-btn v-else
                @click="$router.push({ name: 'Collections' })"
                fab
                color='primary'
                class='ma-3'
                x-large
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large>mdi-arrow-left-circle</v-icon>
              </v-btn>
            </template>
            <span>Bearbeitung abbrechen</span>
          </v-tooltip>

          <v-dialog
            v-model="dialog"
          >
            <v-card>
              <v-card-title class="text-h5">
                <v-spacer></v-spacer>
                Bearbeitung abbrechen?
                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text>
                <v-row align='center' justify='center'>
                Wenn du die Bearbeitung abbrichst, gehen alle Änderungen unwiderruflich verloren.
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="primary"
                  dark
                  @click="dialog = false"
                >
                  Bearbeitung fortsetzen
                </v-btn>

                <v-btn
                  color="error"
                  dark
                  @click="$router.push({ name: 'Collections' })"
                >
                  Bearbeitung abbrechen
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-tooltip v-if='collection' top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click='update()'
                fab
                color='primary'
                class='ma-3'
                x-large
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large>mdi-content-save-move</v-icon>
              </v-btn>
            </template>
            <span>Änderungen speichern</span>
          </v-tooltip>

          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CollectionEditor, { CollectionEditorType } from '@/components/CollectionEditor.vue';
import { Collection } from '@/types/generated/graphql';
import { getValidUpdate } from '@/utils/InputCreator';

const EditProps = Vue.extend({
  props: {
    collectionId: {
      type: String,
      required: true,
    },
  },
});

@Component({
  components: {
    CollectionEditor,
  },
})
export default class EditCollection extends EditProps {
  dialog = false;

  get collection(): Collection | undefined {
    return this.$store.getters.getCollections(this.collectionId);
  }

  update(): void {
    const variables = getValidUpdate((this.$refs.editor as CollectionEditorType).collection);

    this.$store.dispatch(
      'updateCollection',
      variables,
    );
    this.$router.push({ name: 'Collections' });
  }

  beforeCreate(): void {
    if (!this.$keycloak.token) {
      this.$router.push({ name: 'Collections' });
    }
  }
}
</script>
