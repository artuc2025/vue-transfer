<script setup lang="ts">
import { ref } from "vue";

const uploaderRef = ref<any>(null);

const form = reactive({
  title: "",
  amount: 0,
  note: "",
});

async function onSubmit() {
  const fd = new FormData();

  // 1) Текстовые/числовые поля
  fd.append("title", form.title);
  fd.append("amount", String(form.amount));
  fd.append("note", form.note ?? "");

  // 2) Файлы из компонента
  const items = uploaderRef.value.items as Array<{
    file: File;
    status: string;
  }>;
  for (const it of items) {
    // Отправляем только валидные/готовые (или queued, если сервер сам валидирует)
    if (it.status === "queued" || it.status === "done") {
      fd.append("files[]", it.file, it.file.name);
    }
  }

  fd.forEach((item) => console.log(item));
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FileUploader
      ref="uploaderRef"
      :accept="['pdf', 'jpg', 'png']"
      :limits="{
        pdf: { size: '1mb' },
        jpg: { size: '5mb' },
        png: { size: '5mb' },
      }"
      :max-files="5"
      @error="(e: any) => console.warn(e)"
    />
    <button type="submit">Submit</button>
  </form>
</template>
