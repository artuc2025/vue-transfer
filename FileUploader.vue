<template>
  <div class="uploader" :class="{ 'uploader--dragover': isDragOver }">
    <div class="uploader__header">
      <div class="uploader__title">uploader.title</div>
      <div class="uploader__subtitle">
        uploader.allowed
        <span class="uploader__formats">{{ accept.join(", ") }}</span>
      </div>

      <button type="button" class="uploader__btn" @click="onPick">
        uploader.pickButton
      </button>
      <input
        ref="fileInput"
        class="uploader__input"
        type="file"
        :multiple="true"
        :accept="acceptAttr"
        @change="onFileInputChange"
      />
    </div>

    <div
      class="uploader__drop"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div class="uploader__drop-text">uploader.dropHint</div>
    </div>

    <ul class="uploader__list" v-if="items.length">
      <li
        v-for="item in items"
        :key="item.id"
        class="uploader__item"
        :class="{
          'uploader__item--uploading': item.status === 'uploading',
          'uploader__item--done': item.status === 'done',
          'uploader__item--error': item.status === 'error',
        }"
      >
        <div class="uploader__icon" aria-hidden="true">
          <!-- simple file icon -->
          <svg viewBox="0 0 24 24"><path d="M6 2h8l4 4v16H6zM14 2v6h6" /></svg>
        </div>

        <div class="uploader__meta">
          <div class="uploader__name" :title="item.file.name">
            {{ item.file.name }}
          </div>
          <div class="uploader__size">{{ formatSize(item.file.size) }}</div>

          <div class="uploader__progress" v-if="item.status === 'uploading'">
            <div
              class="uploader__bar"
              :style="{ width: item.progress + '%' }"
            ></div>
          </div>

          <div class="uploader__status" v-else-if="item.status === 'done'">
            <svg class="uploader__check" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <div class="uploader__error" v-else-if="item.status === 'error'">
            <span>{{ item.error || "uploader.error" }}</span>
          </div>
        </div>

        <button
          class="uploader__remove"
          type="button"
          @click="removeItem(item.id)"
          aria-label="uploader.remove"
        >
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" /></svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
type FileStatus = "queued" | "uploading" | "done" | "error";

interface FileItem {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
  serverId?: string | number;
  url?: string;
}

interface Limits {
  size: string;
} // e.g. '1mb', '500kb'

const props = defineProps<{
  accept: string[]; // ['pdf','jpg','png']
  limits?: Record<string, Limits>; // { pdf:{size:'1mb'} }
  maxFiles?: number; // optional cap
  modelValue?: FileItem[]; // external control (optional)
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FileItem[]): void;
  (e: "change", value: FileItem[]): void;
  (
    e: "error",
    payload: { code: string; message: string; item?: FileItem }
  ): void;
}>();

const items = ref<FileItem[]>(
  props.modelValue ? structuredClone(props.modelValue) : []
);
watch(
  () => props.modelValue,
  (v) => {
    if (v) items.value = structuredClone(v);
  }
);

watch(
  items,
  (v) => {
    emit("update:modelValue", v);
    emit("change", v);
  },
  { deep: true }
);

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);

const EXT_TO_MIME: Record<string, string[]> = {
  pdf: ["application/pdf"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
};

const acceptAttr = computed(() => {
  // build accept attr like ".pdf,.jpg,.png"
  return props.accept?.map((ext) => `.${ext}`).join(",");
});

function onPick() {
  fileInput.value?.click();
}

function onFileInputChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  enqueueFiles(Array.from(files));
  (e.target as HTMLInputElement).value = ""; // allow re-pick same file
}

function onDragOver() {
  isDragOver.value = true;
}
function onDragLeave() {
  isDragOver.value = false;
}
function onDrop(e: DragEvent) {
  isDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (!files) return;
  enqueueFiles(Array.from(files));
}

function enqueueFiles(list: File[]) {
  const startCount = items.value.length;
  for (const file of list) {
    if (props.maxFiles && items.value.length >= props.maxFiles) {
      logError("MAX_FILES", `uploader.errMaxFiles ${props.maxFiles}`);
      break;
    }
    const val = validateFile(file);
    if (val !== true) {
      logError("VALIDATION", val);
      continue;
    }
    items.value.push({
      id: crypto.randomUUID(),
      file,
      status: "queued",
      progress: 0,
    });
  }
  if (items.value.length === startCount && list.length) {
    // all rejected -> still emit change (already happens via watch)
  }
}

function removeItem(id: string) {
  items.value = items.value.filter((x) => x.id !== id);
}

function validateFile(file: File): true | string {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const allowedExt = props.accept?.map((a) => a.toLowerCase()) || [];
  if (allowedExt.length && !allowedExt.includes(ext)) {
    return `uploader.errExt ${allowedExt.join(", ")}`;
  }
  // check MIME if we know mapping
  const mimes = EXT_TO_MIME[ext];
  if (mimes && !mimes.includes(file.type)) {
    return "uploader.errMime";
  }
  // size by ext if provided
  const lim = props.limits?.[ext];
  if (lim?.size) {
    const bytes = parseSize(lim.size);
    if (file.size > bytes) {
      return `uploader.errSize ${lim.size}`;
    }
  }
  return true;
}

function parseSize(s: string): number {
  // '1mb', '500kb', '2.5mb'
  const m = /^(\d+(\.\d+)?)\s*(kb|mb|gb)$/i.exec(s.trim());
  if (!m) return Number(s) || 0;
  const n = typeof m[1] === "string" ? parseFloat(m?.[1]) : 0;
  const unit = typeof m[3] === "string" ? m[3].toLowerCase() : "";
  const mul = unit === "kb" ? 1024 : unit === "mb" ? 1024 ** 2 : 1024 ** 3;
  return Math.round(n * mul);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function logError(code: string, message: string, item?: FileItem) {
  console.error(`[uploader:${code}]`, message, item);
  emit("error", { code, message, item });
}

/**
 * Public: собрать FormData (без отправки)
 * extra — любые доп. поля: { orderId: 123, note: '...' }
 * ключи файлов: files[] (массив)
 */
function getFormData(extra?: Record<string, any>): FormData {
  const fd = new FormData();
  for (const it of items.value) {
    fd.append("files[]", it.file, it.file.name);
  }
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      fd.append(k, typeof v === "string" ? v : JSON.stringify(v));
    }
  }
  return fd;
}

/**
 * Public: реальная отправка (опционально), XHR для прогресса
 * Возвращает массив результатов по каждому файлу
 */
type UploadResult = { id: string; ok: boolean; status: number; response?: any };
async function upload(
  url: string,
  extra?: Record<string, any>,
  config?: { headers?: Record<string, string> }
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  // прогресс будем считать общий, но разнесём визуально на все uploading
  const totalBytes = items.value.reduce((a, it) => a + it.file.size, 0);
  let loadedAll = 0;

  // помечаем все queued → uploading
  for (const it of items.value) {
    if (it.status === "queued" || it.status === "error") {
      it.status = "uploading";
      it.progress = 0;
    }
  }

  // Одиночный multipart запрос (files[]) чтобы был единый прогресс
  const fd = getFormData(extra);
  const xhr = new XMLHttpRequest();
  const promise = new Promise<UploadResult[]>((resolve, reject) => {
    xhr.upload.onprogress = (ev) => {
      if (!ev.lengthComputable) return;
      const p = Math.round((ev.loaded / ev.total) * 100);
      // распределим по элементам пропорционально их размеру
      let cumLoaded = ev.loaded;
      for (const it of items.value) {
        const ratio = it.file.size / totalBytes;
        const estLoaded = cumLoaded * ratio; // грубая пропорция
        it.progress = Math.min(
          100,
          Math.round((estLoaded / it.file.size) * 100)
        );
        if (it.progress < 0) it.progress = 0;
      }
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const ok = xhr.status >= 200 && xhr.status < 300;
        const resp = safeJson(xhr.responseText);
        for (const it of items.value) {
          it.status = ok ? "done" : "error";
          if (!ok) it.error = "uploader.error";
          // Если бэкенд вернёт айдишники в массиве — сюда их можно проставить
          // Пример: resp.files[i].id → it.serverId
        }
        results.push({ id: "batch", ok, status: xhr.status, response: resp });
        ok ? resolve(results) : reject(results);
      }
    };
    xhr.open("POST", url, true);
    const hdrs = config?.headers || {};
    for (const [k, v] of Object.entries(hdrs)) xhr.setRequestHeader(k, v);
    xhr.send(fd);
  });
  return promise;
}

function safeJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

function reset() {
  items.value = [];
}

defineExpose({ getFormData, upload, reset, items });
</script>

<style scoped lang="scss">
.uploader {
  border: 1px solid #e3e6ea;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  &--dragover {
    box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.15);
  }

  &__header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-row-gap: 8px;
    grid-column-gap: 12px;
    align-items: start;
  }
  &__title {
    font-weight: 600;
    font-size: 16px;
  }
  &__subtitle {
    font-size: 12px;
    color: #6b7280;
  }
  &__formats {
    font-weight: 500;
    margin-left: 4px;
  }

  &__btn {
    justify-self: end;
    padding: 8px 12px;
    background: #0d6efd;
    color: #fff;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
  &__input {
    display: none;
  }

  &__drop {
    margin-top: 12px;
    padding: 16px;
    border: 1px dashed #c7ccd3;
    border-radius: 10px;
    text-align: center;
    background: #fafbfc;
  }
  &__drop-text {
    font-size: 13px;
    color: #6b7280;
  }

  &__list {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  &__item {
    display: grid;
    grid-template-columns: 32px 1fr 24px;
    gap: 10px;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid #eef1f4;
    border-radius: 10px;
    background: #fff;
    &--uploading {
      border-color: #cfe2ff;
    }
    &--done {
      border-color: #d1e7dd;
    }
    &--error {
      border-color: #f8d7da;
    }
  }

  &__icon svg {
    width: 24px;
    height: 24px;
    stroke: #6b7280;
    fill: none;
    stroke-width: 1.6;
  }
  &__meta {
    min-width: 0;
  }
  &__name {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__size {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }

  &__progress {
    position: relative;
    margin-top: 8px;
    height: 4px;
    background: #eef2f7;
    border-radius: 4px;
    overflow: hidden;
  }
  &__bar {
    height: 100%;
    background: #0d6efd;
    width: 0%;
    transition: width 0.15s linear;
  }

  &__status {
    margin-top: 8px;
  }
  &__check {
    width: 18px;
    height: 18px;
    stroke: #198754;
    fill: none;
    stroke-width: 2;
  }

  &__error {
    margin-top: 6px;
    font-size: 12px;
    color: #b42318;
  }

  &__remove {
    justify-self: end;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    & svg {
      width: 18px;
      height: 18px;
      stroke: #6b7280;
      fill: none;
      stroke-width: 2;
    }
  }
}
</style>
