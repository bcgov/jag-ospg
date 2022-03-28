<template>
  <div>
    <div v-if="showIntakeAlert" class="alert alert-info" role="alert">
      Completed Intake cannot be viewed
    </div>
    <div v-if="jwttoken">
      <CamundaTasklist
        class="ospg-issue-list px-3"
        :bpmApiUrl="configs.BPM_URL"
        :token="jwttoken"
        :formsflowaiUrl="configs.FORM_FLOW_URL"
        :formsflowaiApiUrl="configs.FORM_FLOW_API_URL"
        :getTaskId="getTaskId"
        taskSortBy="dueDate"
        formIOJwtSecret="--- change me now ---"
        taskSortOrder="asc"
        :webSocketEncryptkey="configs.WEB_SOCKET_ENCRYPT_KEY"
        :formIO="configs.FORMIO_CONFIG"
        :hideTaskDetails="{
          assignee: false,
          group: true,
          followUpDate: true,
          dueDate: true,
          createdDate: true,
        }"
        :disableComponents="{
          filterList: true,
          filterTask: false,
          sort: true,
          form: false,
        }"
        :listItemCardStyle="false"
        :taskDefaultFilterListNames="['OSPG Issue']"
        v-if="isServiceFLowEnabled"
      />
    </div>
    <div class="no-content" v-else>
      You shouldnot be here !!!
      <h1>Hello</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CamundaTasklist from "camunda-formio-tasklist-vue/src/components/TaskList.vue";
import router from "@/router";

@Component({
  components: {
    CamundaTasklist,
  },
  computed: {
    getTaskId: {
      get: function () {
        return this.$route.params.taskId;
      },
    },
  },
})
export default class TaskList extends Vue {
  public configs = {
    BPM_URL: process.env.VUE_APP_BPM_URL,
    FORM_FLOW_API_URL: process.env.VUE_APP_FORM_FLOW_API_URL,
    FORM_FLOW_URL: process.env.VUE_APP_FORM_FLOW_URL,
    SERVICEFLOW_ENABLED: true,
    FORMIO_CONFIG: {
      apiUrl: process.env.VUE_APP_FORM_IO_API_URL,
      resourceId: process.env.VUE_APP_FORM_IO_RESOURCE_ID,
      reviewerId: process.env.VUE_APP_FORM_IO_REVIEWER_ID,
      reviewer: process.env.VUE_APP_FORM_IO_REVIEWER,
      userRoles: process.env.VUE_APP_FORMIO_ROLES,
    },
    FORMIO_JWT_SECRET: "--- change me now ---",
    WEB_SOCKET_ENCRYPT_KEY: process.env.VUE_WEB_SOCKET_ENCRYPT_KEY,
  };

  public isServiceFLowEnabled: boolean = true;
  public jwttoken: string | boolean = false;
  public showIntakeAlert: boolean = false;
  resetAlertTime() {
    this.showIntakeAlert = false;
  }
  created() {
    this.resetAlertTime();
    this.jwttoken = Vue.prototype.$keycloak.token;
    this.isServiceFLowEnabled = true;
    this.$root.$on("goToIntake", (customEvent: any) => {
      this.resetAlertTime();
      if (customEvent?.customEvent?.taskDetails.length === 0) {
        this.showIntakeAlert = true;
        setTimeout(this.resetAlertTime, 5000);
      }
      const [taskDetails] = customEvent?.customEvent?.taskDetails;
      if (taskDetails?.id) {
        router.push({ name: "Intakes", params: { taskId: taskDetails.id } });
        this.$router.go(0);
      }
    });
  }
}
</script>
<style>
.ospg-issue-list {
  height: 90vh;
}
/* todo: remove below 2 styles, when new npm package is released */
.cft-list-group {
  height: 79vh !important;
}
.ctf-task-details-container .task-details {
  height: 79vh !important;
}
.cft-list-group {
  border-right: inset #eee;
}
:root {
  --bs-primary: #2699fb;
  --bs-body-color: #003366;
  scrollbar-color: auto;
}
body {
  scrollbar-width: auto;
  scrollbar-color: #2699fb aliceblue;
}
</style>
