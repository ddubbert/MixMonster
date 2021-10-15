<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center' class='mt-10 mb-10'>
          <v-spacer></v-spacer>
          <span class='text-h3' align='center'>
            <strong>Deine Sammlungen:</strong>
          </span>
          <v-spacer></v-spacer>
        </v-row>
        <v-row
          align='center'
          justify='center'
          v-for='(collection, index) in collections'
          :key='collection.id'
        >
          <v-col xs='12' sm='10' md='8'>
            <v-card class="elevation-2" @click.stop='edit(index)'>
              <v-toolbar dark color="primary">
                <v-toolbar-title><strong>{{ collection.title }}</strong></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click.stop='preview(index)'
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
                      @click.stop='edit(index)'
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
                      @click.stop='duplicate(index)'
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
                      @click.stop='share(index)'
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
                      @click.stop='download(index)'
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
                      @click.stop='remove(index)'
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
                @click.stop="$router.push({ name: 'CreateCollection' })"
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
                @click.stop='$refs.upload.click()'
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
import Component from 'vue-class-component';
import { Collection } from '@/types/generated/graphql';
import CSVManager from '@/utils/CSVManager';
import { getValidCreate } from '@/utils/InputCreator';

@Component
export default class Collections extends Vue {
  get collections(): Collection[] {
    return this.$store.state.collections;
  }

  duplicate(index: number): void {
    this.$store.dispatch('createCollection', getValidCreate(this.collections[index]));
  }

  preview(index: number): void {
    this.$router.push({
      name: 'PreviewCollection',
      params: {
        collectionId: this.collections[index].id,
      },
    });
  }

  edit(index: number): void {
    this.$router.push({
      name: 'EditCollection',
      params: {
        collectionId: this.collections[index].id,
      },
    });
  }

  remove(index: number): void {
    this.$store.dispatch('removeCollection', this.collections[index].id);
  }

  share(index: number): void {
    console.log('share ', this.collections[index].id);
  }

  download(index: number): void {
    const collection = this.collections[index];
    const manager = new CSVManager();
    const csv = manager.createCSV(collection);
    const exportedFilename = `${collection.title}.csv`;
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
  }

  upload(event: Event): void {
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
  }

  mounted(): void {
    if (!this.$keycloak.token) {
      this.$keycloak.init({
        onLoad: 'login-required',
        redirectUri: 'http://localhost:8080/collections',
      }).then((auth) => {
        if (!auth) {
          window.location.reload();
        } else {
          this.$store.dispatch('getCollections');
        }

        // Token Refresh
        setInterval(() => {
          this.$keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
              console.log(`Token refreshed ${refreshed}`);
            } else if (this.$keycloak.tokenParsed?.exp && this.$keycloak.timeSkew) {
              console.warn(`Token still valid for ${
                Math.round(
                  this.$keycloak.tokenParsed.exp
                  + this.$keycloak.timeSkew
                  - new Date().getTime()
                  / 1000,
                )
              } seconds`);
            }
          }).catch(() => {
            console.error('Failed to refresh token');
          });
        }, 6000);
      }).catch((e) => {
        console.log(e);
        console.error('Authenticated Failed');
      });
    }
  }
}
</script>
