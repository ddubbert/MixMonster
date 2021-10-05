<template>
  <hello-world />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import HelloWorld from '../components/HelloWorld.vue';
import { GetCollections } from '@/types/generated/graphql';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  name = 'Home';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    console.log(this.name);
    console.log(this.$keycloak);

    const link = createHttpLink({
      uri: 'http://localhost:4000/graphql',
      headers: {
        authorization: `Bearer ${this.$keycloak.token}`,
      },
    });
    const cache = new InMemoryCache();

    const client = new ApolloClient({
      link,
      cache,
    });

    const requestCollections = await client.query({ query: GetCollections });

    console.log(requestCollections.data.getCollections);
  }
}
</script>
