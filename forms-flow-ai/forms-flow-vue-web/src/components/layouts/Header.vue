<template>
  <nav class="navbar navbar-dark ospg-nav">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"
        ><img alt="OSPG" class="ospg-logo" src="../../assets/logo.svg" />
        <span class="ospg-brand mx-4">OSPG Case Management System</span></a
      >
      <span class="ospg-header-menu" @click="goToIntakes">Intakes</span>
      <span class="ospg-header-menu" @click="goToIssues">Issues</span>
      <span class="ospg-header-menu">Dashboard</span>
      <div class="dropdown">
        <a
          href="#"
          class="dropdown-toggle ospg-header-dropdown"
          data-bs-toggle="dropdown"
          ><span class="ospg-initial-shell">
            <span class="ospg-initial-logo px-1">{{ initial }}</span>
          </span>
          <span class="px-1">{{ firstName }} {{ lastName }}</span></a
        >
        <div class="dropdown-menu">
          <a href="#" class="dropdown-item" @click="logout">Log Out</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import router from "@/router";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  public firstName = "";
  public lastName = "";
  private initial = "";

  logout() {
    Vue.prototype.$keycloak.logout({ redirectUri: window.location.origin });
    localStorage.removeItem("ospgLastActivity");
  }

  mounted() {
    this.firstName = Vue.prototype.$keycloak.tokenParsed.given_name;
    this.lastName = Vue.prototype.$keycloak.tokenParsed.family_name;
    if (this.firstName) this.initial += this.firstName.charAt(0);
    if (this.lastName) this.initial += this.lastName.charAt(0);
  }

  goToIntakes() {
    router.push({ name: "Intakes" });
    this.$router.go(0);
  }

  goToIssues() {
    router.push({ name: "Issues" });
    this.$router.go(0);
  }
}
</script>

<style scoped>
.header {
  background-color: #fdb44e;
}

.button-css {
  margin: 10px;
}

.username {
  font-size: 1.5em;
  color: #fff;
}
.ospg-nav {
  background-color: #003366;
}
.ospg-brand {
  font: normal normal bold 20px/8px "BC Sans normal";
  color: #f1f9ff;
  opacity: 1;
}
.ospg-logo {
  background-position: 0%;
  background-size: initial;
  background-repeat: no-repeat;
  background-attachment: initial;
  background-origin: padding-box;
  background-clip: padding-box;
  background-color: transparent;
  opacity: 1;
}
.ospg-header-menu {
  /* UI Properties */
  font: normal normal normal 16px/8px "BC Sans normal";
  letter-spacing: 0px;
  color: #f1f9ff;
  opacity: 1;
  cursor: pointer;
}
.ospg-header-dropdown {
  font: normal normal normal 14px/9px "BC Sans normal";
  letter-spacing: 0px;
  color: #ffffff;
  opacity: 1;
}
.ospg-initial-logo {
  font: normal normal bold 12px/24px "BC Sans normal";
  letter-spacing: 0px;
  color: #0056ff;
  opacity: 1;
}
.ospg-initial-shell {
  /* UI Properties */
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 4px;
  opacity: 1;
}
</style>
