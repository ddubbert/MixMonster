import Vue from 'vue';
import Keycloak from 'keycloak-js';

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-shadow
  interface Vue {
    $keycloak: Keycloak.KeycloakInstance,
  }
}
