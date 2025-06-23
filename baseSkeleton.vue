<template>
  <div
    class="skeleton-container"
    :class="customClass"
    :style="{ flexDirection: normalizedDirection, gap, ...customStyle }"
  >
    <div
      v-for="n in count"
      :key="n"
      class="skeleton-item"
      :class="animationClass"
      :style="{
        width,
        height,
        borderRadius: radius,
        '--skeleton-base': baseColor,
        '--skeleton-highlight': highlightColor,
      }"
    ></div>
  </div>
</template>

<script setup>

const props = defineProps({
  customClass: {
    type: String,
    default: '',
  },
  count: {
    type: Number,
    default: 1,
  },
  gap: {
    type: String,
    default: '12px',
  },
  direction: {
    type: String,
    default: 'vertical',
    validator: (v) => ['horizontal', 'vertical'].includes(v),
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '16px',
  },
  radius: {
    type: String,
    default: '6px',
  },
  animation: {
    type: String,
    default: 'shimmer',
    validator: (v) => ['shimmer', 'pulse'].includes(v),
  },
  baseColor: {
    type: String,
    default: 'rgba(var(--v-theme-light-blue-1))', // #F4F7FC
  },
  highlightColor: {
    type: String,
    default: 'rgba(var(--v-theme-background))', // #FFFFFF
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
})

const normalizedDirection = computed(() =>
  props.direction === 'horizontal' ? 'row' : 'column'
)

const animationClass = computed(() => {
  return props.animation === 'pulse' ? 'pulse' : 'shimmer'
})
</script>

<style scoped>
.skeleton-container {
  display: flex;
}

.skeleton-item {
  background-color: var(--skeleton-base);
  position: relative;
  overflow: hidden;
}

/* —— PULSE animation —— */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-item.pulse {
  background-color: var(--skeleton-highlight);
  animation: pulse 1.5s ease-in-out infinite;
}

/* —— SHIMMER animation —— */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.skeleton-item.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--skeleton-highlight) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>
