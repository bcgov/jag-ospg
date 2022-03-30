<template>
  <div
    id="app"
    @mouseover="checkInactivity"
    @mouseout="checkInactivity"
    @click="checkInactivity"
    @keyup="checkInactivity"
    @keydown="checkInactivity"
  >
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
  public refreshInterval;
  public inactivityInterval;

  async renewTokenIfExpired() {
    const MINIMUM_TOKEN_VALIDITY = parseInt(
      process.env.VUE_APP_MINIMUM_TOKEN_VALIDITY ?? "180"
    );
    const tokenRefreshed = await Vue.prototype.$keycloak?.updateToken(
      MINIMUM_TOKEN_VALIDITY
    );
    if (tokenRefreshed) {
      this.$root.$emit("tokenRefreshed");
    }
  }

  logout() {
    Vue.prototype.$keycloak.logout({ redirectUri: window.location.origin });
    localStorage.removeItem("ospgLastActivity");
  }

  inactiveMoreThan5m() {
    const now: Date = new Date();
    const lastActivity = localStorage.getItem("ospgLastActivity");
    const lastActivityDate = lastActivity ? new Date(lastActivity) : now;
    const diffMs = +now - +lastActivityDate;
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    if (diffMins >= 5) {
      clearInterval(this.refreshInterval);
      clearInterval(this.inactivityInterval);
      this.logout();
    }
  }

  created() {
    localStorage.setItem("ospgLastActivity", new Date().toString());
    this.jwttoken = Vue.prototype.$keycloak.token;
    // refresh token logic
    const RENEW_AUTH_TOKEN_TIMER = parseInt(
      process.env.VUE_APP_RENEW_AUTH_TOKEN_TIMER ?? "30000"
    );
    if (Vue.prototype.$keycloak.authenticated) {
      this.refreshInterval = setInterval(
        this.renewTokenIfExpired,
        RENEW_AUTH_TOKEN_TIMER
      );
    } else {
      clearInterval(this.refreshInterval);
      clearInterval(this.inactivityInterval);
      this.logout();
    }

    // inactivity logic
    this.inactivityInterval = setInterval(this.inactiveMoreThan5m, 30000);
  }

  checkInactivity() {
    localStorage.setItem("ospgLastActivity", new Date().toString());
  }

  beforeCreate() {
    clearInterval(this.refreshInterval);
    clearInterval(this.inactivityInterval);
    localStorage.removeItem("ospgLastActivity");
  }

  beforeDestroy() {
    clearInterval(this.refreshInterval);
    clearInterval(this.inactivityInterval);
    localStorage.removeItem("ospgLastActivity");
  }
}
</script>
