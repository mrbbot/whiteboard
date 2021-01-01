import "normalize.css";

import Vue from "vue";
import App from "./client/App.vue";
import router from "./client/router";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSyncAlt,
  faPen,
  faHandPointer,
  faEraser,
  faTrash,
  faCloudUploadAlt,
  faCamera,
  faInfoCircle,
  faUndo,
  faRandom
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faSyncAlt,
  faPen,
  faHandPointer,
  faEraser,
  faTrash,
  faCloudUploadAlt,
  faCamera,
  faInfoCircle,
  faUndo,
  faRandom
);
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
