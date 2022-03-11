<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row align='center' justify='center'>
          <v-col cols='12' xl='4' lg='4' md='8' sm='10' xs='12' class='pa-5'>
            <v-img
              alt="MixMonster Logo"
              class="shrink mr-2"
              contain
              :src="$store.state.icon"
              transition="scale-transition"
            />
          </v-col>
        </v-row>

        <v-row align='center' justify='center' class='mb-10'>
          <v-spacer></v-spacer>
          <span class='text-h4 text-md-h3' align='center'>
            <strong>Deine MixMonster:</strong>
          </span>
          <v-spacer></v-spacer>
        </v-row>

        <v-row v-if='collections.length > 0'>
          <v-col>
            <v-row
              align='center'
              justify='center'
              v-for='(collection, index) in collections'
              :key='collection.id'
            >
              <v-col cols='12' xs='12' sm='10' md='8'>
                <v-card dark class="elevation-2" @click.stop='edit(index)' color='primary'>
                  <v-row
                    align='center'
                    justify='start'
                    class='pl-5 pr-3 mb-2 pt-sm-5 pb-sm-5'
                  >
                    <v-col cols='12' xs='12' sm='6' md='6' lg='6' xl='6'>
                      <span class='text-h5 white--text'>
                        <strong>{{ collection.title }}</strong>
                      </span>
                    </v-col>

                    <v-col cols='12' xs='12' sm='6' md='6' lg='6' xl='6' class='text-right'>
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
                            @click.stop='openRemoveDialogFor(index)'
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
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row align='center' justify='center' class='mt-5 mb-10'>
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
            <span>Neues MixMonster erstellen</span>
          </v-tooltip>

          <input
            style='display: none'
            type='file'
            accept='text/csv, .xls, .xlsx'
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
            <span>Bestehendes MixMonster hochladen</span>
          </v-tooltip>
          <v-spacer></v-spacer>
        </v-row>

        <v-dialog
          v-model="removeDialog"
        >
          <v-card>
            <v-card-title class='text-h5 text-center'>
              <v-spacer></v-spacer>
              MixMonster wirklich löschen?
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-row align='center' justify='center' class='text-center mt-1'>
                Gelöschte MixMonster können nicht wieder hergestellt werden.
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-row align='center' justify='center' class='mt-2 mb-3'>
                <v-btn
                  color="primary"
                  dark
                  class='ma-1'
                  @click="removeDialog = false"
                >
                  Löschvorgang abbrechen
                </v-btn>

                <v-btn
                  color="error"
                  dark
                  text
                  class='ma-1'
                  @click="remove(removeIndex)"
                >
                  Endgültig löschen
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-if='collections.length > 0'
          v-model="shareDialog"
        >
          <v-card>
            <v-card-title class='text-h5 text-center'>
              <v-spacer></v-spacer>
              {{ `${collections[shareIndex].title} teilen:` }}
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-row align='center' justify='center' class='fill-height'>
                <v-col cols='12' xs='12' sm='12' md='8' lg='4' xl='3'>
                  <v-row align='center' justify='center' class='mt-1'>
                    <v-col>
                      <v-text-field
                        :value='collections[shareIndex].id'
                        readonly
                        label='Referenznummer'
                        class='pt-0'
                        ref='idInput'
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color='primary'
                                dark
                                icon
                                v-bind="attrs"
                                v-on="on"
                                class='ma-1'
                                @click.stop='copyToClipboard("idInput")'
                              >
                                <v-icon large>mdi-content-copy</v-icon>
                              </v-btn>
                            </template>
                            <span>Kopieren</span>
                          </v-tooltip>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row align='center' justify='center'>
                    <v-col>
                      <v-text-field
                        :value='`${previewRootUrl}${collections[shareIndex].id}`'
                        readonly
                        label='Vollständiger Link'
                        class='pt-0'
                        ref='linkInput'
                      >
                        <template v-slot:append>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color='primary'
                                dark
                                icon
                                v-bind="attrs"
                                v-on="on"
                                class='ma-1'
                                @click.stop='copyToClipboard("linkInput")'
                              >
                                <v-icon large>mdi-content-copy</v-icon>
                              </v-btn>
                            </template>
                            <span>Kopieren</span>
                          </v-tooltip>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols='12'
                       xs='12'
                       sm='12'
                       md='4'
                       lg='2'
                       xl='2'
                       class='text-center'
                >
                  <qrcode-vue :value="`${previewRootUrl}${collections[shareIndex].id}`"
                              level="H"
                              size='150'
                              class='pt-2'
                              style='cursor: pointer;'
                              @click.native='zoomQr(
                                `${previewRootUrl}${collections[shareIndex].id}`
                              )'
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-row align='center' justify='center' class='mt-2 mb-3'>
                <v-btn
                  color='error'
                  dark
                  text
                  class='ma-1'
                  @click='shareDialog = false'
                >
                  Schließen
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-overlay :z-index='300' :value="qrOverlay" @click.native='qrOverlay = false'>
          <qrcode-vue :value="qrValue"
                      level="H"
                      :size='size'
                      style='border: black solid 5px; background-color: white; border-radius: 2%;'
                      class='pa-5 pb-3'
                      @click='qrOverlay = false'
          />
        </v-overlay>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import * as XLSX from 'sheetjs-style';
import * as SHEETJS from 'xlsx';
import Component from 'vue-class-component';
import QrcodeVue from 'qrcode.vue';
import { Collection } from '@/types/generated/graphql';
import ExcelManager from '@/utils/ExcelManager';
import { getValidCreate } from '@/utils/InputCreator';

@Component({
  components: {
    QrcodeVue,
  },
})
export default class Collections extends Vue {
  shareDialog = false

  removeDialog = false

  removeIndex = 0

  shareIndex = 0

  qrOverlay = false

  qrValue = ''

  rootUrl = `http://${process.env.VUE_APP_FRONTEND_HOST}:${process.env.VUE_APP_FRONTEND_PORT}`;

  previewRootUrl = `${this.rootUrl}/collections/use/`

  get collections(): Collection[] {
    return this.$store.state.collections;
  }

  // eslint-disable-next-line class-methods-use-this
  get size(): number {
    const height = window.innerHeight;
    const width = window.innerWidth;
    return height < width ? height / 1.5 : width / 1.5;
  }

  async copyToClipboard(refName: string): Promise<void> {
    const vTextField = this.$refs[refName];
    if (!vTextField || !(vTextField instanceof Vue)) return;

    const input = (vTextField as Vue).$el.querySelector('input');
    if (!input) return;

    input.select();
    document.execCommand('copy');
  }

  zoomQr(value: string): void {
    this.qrValue = value;
    this.qrOverlay = true;
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
    this.removeDialog = false;
  }

  openRemoveDialogFor(index: number): void {
    this.removeIndex = index;
    this.removeDialog = true;
  }

  share(index: number): void {
    this.shareIndex = index;
    this.shareDialog = true;
  }

  download(index: number): void {
    const collection = this.collections[index];
    const workbook = ExcelManager.createWorkbookFor(collection);
    const workbookOptions: XLSX.WritingOptions = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'array',
    };
    const workbookOutput = XLSX.write(workbook, workbookOptions);
    const exportedFilename = `${collection.title}.xlsx`;
    const blob = new Blob([workbookOutput], { type: 'application/octet-stream' });

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

  async upload(event: Event): Promise<void> {
    if (event.target) {
      const target = event.target as HTMLInputElement;

      if (target.files && target.files[0]) {
        const file = target.files[0];
        const data = await file.arrayBuffer();
        const workbook = SHEETJS.read(data, { type: 'base64' });

        const collections = ExcelManager.createCollectionFrom(workbook);
        collections.forEach((col) => {
          this.$store.dispatch('createCollection', getValidCreate(col));
        });
      }
    }
  }

  mounted(): void {
    if (!this.$keycloak.token) {
      this.$store.dispatch(
        'login',
        `http://${process.env.VUE_APP_FRONTEND_HOST}:${process.env.VUE_APP_FRONTEND_PORT}/collections`,
      ).then((auth) => {
        if (!auth) {
          // window.location.reload();
          this.$router.push('Home');
        } else {
          this.$store.dispatch('getCollections');
        }
      });
    }
  }
}
</script>
