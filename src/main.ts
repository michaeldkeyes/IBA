import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import "./assets/main.scss";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
