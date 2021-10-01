<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <b class='myHeading'>Deine Szenarien:</b>
          <v-spacer></v-spacer>
        </v-row>
        <v-row
          align='center'
          justify='center'
          v-for='(collection, index) in collections'
          :key='index'>
          <v-col xs='12' sm='10' md='8'>
            <v-card class="elevation-2">
              <v-toolbar dark color="primary">
                <v-toolbar-title><b>{{collection.title}}</b></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click='preview(index)'
                      icon
                      class='ml-1 mr-1'
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon large>mdi-magnify</v-icon>
                    </v-btn>
                  </template>
                  <span>Probeansicht</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click='edit(index)'
                      icon
                      class='ml-1 mr-1'
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon large>mdi-circle-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Bearbeiten</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click='duplicate(index)'
                      icon
                      class='ml-1 mr-1'
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon large>mdi-content-duplicate</v-icon>
                    </v-btn>
                  </template>
                  <span>Duplizieren</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      to='/'
                      icon
                      class='ml-1 mr-1'
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon large>mdi-share-variant</v-icon>
                    </v-btn>
                  </template>
                  <span>Teilen</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click='download(index)'
                      icon
                      class='ml-1 mr-1'
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon large>mdi-download-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Herunterladen</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click='remove(index)'
                      icon
                      class='ml-1 mr-1'
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon large>mdi-delete-forever</v-icon>
                    </v-btn>
                  </template>
                  <span>Löschen</span>
                </v-tooltip>
              </v-toolbar>
            </v-card>
          </v-col>
        </v-row>
        <v-row align='center' justify='center'>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                to='/create-collection'
                fab
                color='primary'
                class='ma-3'
                x-large
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large>mdi-plus-circle</v-icon>
              </v-btn>
            </template>
            <span>Neue Sammlung erstellen</span>
          </v-tooltip>

          <input
            style='display: none'
            type='file'
            accept='text/csv'
            ref='upload'
            @change='upload'
          >

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click='$refs.upload.click()'
                fab
                color='primary'
                class='ma-3'
                x-large
                v-bind="attrs"
                v-on="on"
              >
                <v-icon x-large>mdi-cloud-upload</v-icon>
              </v-btn>
            </template>
            <span>Vorlage hochladen</span>
          </v-tooltip>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Collection } from '@/types/collection';
import CSVManager from '@/models/CSVManager';

export default Vue.extend({
  name: 'Collections',

  components: {
  },

  data: () => ({}),

  computed: {
    collections(): Collection[] {
      return this.$store.state.collections;
    },
  },

  methods: {
    duplicate(index: number) {
      this.$store.dispatch('createCollection', this.collections[index]);
    },
    preview(index: number) {
      this.$router.push({
        name: 'PreviewCollection',
        params: {
          collectionIndex: `${index}`,
        },
      });
    },
    edit(index: number) {
      this.$router.push({
        name: 'EditCollection',
        params: {
          collectionIndex: `${index}`,
        },
      });
    },
    remove(index: number) {
      this.$store.dispatch('removeCollection', this.collections[index]);
    },
    download(index: number) {
      const manager = new CSVManager();
      const csv = manager.createCSV(this.collections[index]);
      const exportedFilename = `${this.collections[index].title}.csv`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilename);
      } else {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    upload(event: Event) {
      if (event.target) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const manager = new CSVManager();

          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const r = e.target?.result as string;
            if (r) {
              const collections = manager.createCollectionFrom(r);
              collections.forEach((col) => { this.$store.dispatch('createCollection', col); });
            }
          };
          fileReader.readAsText(target.files[0]);
        }
      }
    },
  },
});
</script>
