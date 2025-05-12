<template>
  <v-date-input
    variant="outlined"
    class="base-date-input"
    prepend-icon=""
    :append-inner-icon="calendarIcon"
    v-model="model"
  />
</template>

<script setup lang="ts">
const model = defineModel();
const calendarIcon = () =>
  h(
    "svg",
    {
      width: "18",
      height: "20",
      viewBox: "0 0 18 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    },
    [
      h("path", {
        d: "M5.5 1V3.7",
        stroke: "#103793",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M12.6992 1V3.7",
        stroke: "#103793",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M1.44922 7.38086L16.7492 7.38086",
        stroke: "#103793",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M17.2 6.84961V14.4996C17.2 17.1996 15.85 18.9996 12.7 18.9996H5.5C2.35 18.9996 1 17.1996 1 14.4996L1 6.84961C1 4.14961 2.35 2.34961 5.5 2.34961L12.7 2.34961C15.85 2.34961 17.2 4.14961 17.2 6.84961Z",
        stroke: "#103793",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M12.4236 11.5301H12.4317",
        stroke: "#103793",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M12.4236 14.2293H12.4317",
        stroke: "#103793",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M9.09545 11.5301H9.10353",
        stroke: "#103793",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M9.09545 14.2293H9.10353",
        stroke: "#103793",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M5.76537 11.5301H5.77345",
        stroke: "#103793",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("path", {
        d: "M5.76537 14.2293H5.77345",
        stroke: "#103793",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    ]
  );
</script>

<style lang="scss">
.base-date-input {
  .v-field {
    border-radius: 6px;
  }
  .v-field__input {
    padding: 10px 14px;
    min-height: 44px;
    color: rgba(62, 73, 103, 1);
    opacity: 1;
    input {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      left: 14px;
      &::placeholder {
        color: rgba(62, 73, 103, 1);
        opacity: 1;
      }
    }
  }
  .v-field__outline {
    --v-field-border-opacity: 1;
    .v-field__outline__start,
    .v-field__outline__end {
      border-color: rgba(234, 234, 241, 1);
    }
    .v-field__outline__notch {
      &::before,
      &::after {
        border-color: rgba(234, 234, 241, 1);
      }
    }
  }
}
</style>
