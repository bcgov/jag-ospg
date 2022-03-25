<template>
  <div>
    <Header />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/layouts/Header.vue";

@Component({
  components: {
    Header,
  },
})
export default class FullLayout extends Vue {}
</script>
