// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/VDateInput";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VDateInput,
    },
  });
  app.vueApp.use(vuetify);
});
