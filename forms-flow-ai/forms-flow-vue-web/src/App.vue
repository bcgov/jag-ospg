<template>
  <div id="app">
    <div v-if="!jwttoken">
      <router-view />
    </div>
    <div v-else>
      <full-layout>
        <template>
          <router-view />
        </template>
      </full-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FullLayout from "@/components/layouts/FullLayout.vue";

@Component({
  components: {
    FullLayout,
  },
})
export default class App extends Vue {
  public jwttoken: string | boolean = false;

  created() {
    this.jwttoken = Vue.prototype.$keycloak.token;
  }
}
</script>
