<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center' class='mt-10 mb-10'>
          <span class='text-h4 text-md-h3' align='center'>
            <strong v-if='collection'>{{ collection.title }} bearbeiten:</strong>
            <strong v-else class='myHeading'>MixMonster nicht gefunden!</strong>
          </span>
        </v-row>
      </v-container>

      <CollectionEditor
        v-if='collection'
        ref='editor'
        :initial-collection='collection'
      ></CollectionEditor>

      <v-container>
        <v-row align='center' justify='center'>
          <v-col xs='12' sm='12' md='12' lg='8'>
            <v-row align='center' justify='space-between'>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-if='collection'
                    @click='dialog = true'
                    fab
                    color='error'
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
                    color='error'
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
            </v-row>
          </v-col>
        </v-row>

        <v-dialog
          v-model="dialog"
        >
          <v-card>
            <v-card-title class='text-h5 text-center'>
              <v-spacer></v-spacer>
              Bearbeitung abbrechen?
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-row align='center' justify='center' class='text-center mt-1'>
                Wenn du die Bearbeitung abbrichst, gehen alle Änderungen unwiderruflich verloren.
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-row align='center' justify='center' class='mt-2 mb-3'>
                <v-btn
                  color="primary"
                  dark
                  class='ma-1'
                  @click="dialog = false"
                >
                  Weiter bearbeiten
                </v-btn>

                <v-btn
                  color="error"
                  dark
                  text
                  class='ma-1'
                  @click="$router.push({ name: 'Collections' })"
                >
                  Bearbeitung abbrechen
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CollectionEditor, { CollectionEditorType } from '@/components/CollectionEditor.vue';
import { Category, Collection } from '@/types/generated/graphql';
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
    return this.$store.getters.getCollection(this.collectionId);
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
