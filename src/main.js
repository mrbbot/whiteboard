import "normalize.css";

import Vue from "vue";
import App from "./client/App.vue";
import router from "./client/router";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPen,
  faHandPointer,
  faEraser,
  faTrash,
  faCloudUploadAlt,
  faCamera
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faPen,
  faHandPointer,
  faEraser,
  faTrash,
  faCloudUploadAlt,
  faCamera
);
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
