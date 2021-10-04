<template>
  <hello-world />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ApolloClient, InMemoryCache } from '@apollo/client';
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
    const client = new ApolloClient({
      uri: 'http://localhost:4000/graphql',
      cache: new InMemoryCache(),
    });

    const requestCollections = await client.query({ query: GetCollections });

    console.log(requestCollections);
  }
}
</script>
