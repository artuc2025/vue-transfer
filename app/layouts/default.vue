<template>
  <div class="layout-container">
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>
<style scoped>
.layout-container {
  background-color: var(--ui-bg);
  height: calc(100vh - 4rem);
}
.main-content {
  height: 100%;
  margin-top: 4rem;
}
</style>
