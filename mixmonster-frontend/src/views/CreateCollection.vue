<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <strong class='myHeading'>Neue Sammlung erstellen:</strong>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>

      <CollectionEditor ref='editor' :initial-collection='collection'></CollectionEditor>

      <v-container>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
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
                  to='/collections'
                >
                  Bearbeitung abbrechen
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click='save()'
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
            <span>Sammlung speichern</span>
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

@Component({
  components: {
    CollectionEditor,
  },
})
export default class CreateCollection extends Vue {
  dialog = false;

  collection : Collection = {
    id: '0',
    allowReRoll: true,
    title: 'Sammlung',
    categories: [
      {
        title: 'Kategorie',
        selectable: true,
        criteriaRollAmount: 1,
        criteria: [
          {
            title: 'Kriterium',
          },
        ],
      },
    ],
  };

  save(): void {
    this.$store.dispatch(
      'createCollection',
      (this.$refs.editor as CollectionEditorType).collection,
    );
    this.$router.push('/collections');
  }
}
</script>
