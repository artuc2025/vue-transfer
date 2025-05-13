import dayjs from "dayjs";
import "dayjs/locale/hy-am";
import "dayjs/locale/ru";

export default defineNuxtPlugin(() => {
  dayjs.locale("hy-am");
});
