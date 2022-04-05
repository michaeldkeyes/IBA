import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import "./assets/main.scss";

const app = createApp(App);
app.use(createPinia());
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
