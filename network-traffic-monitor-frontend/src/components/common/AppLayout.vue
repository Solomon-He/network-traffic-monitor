<template>
  <div class="app-layout">
    <header class="app-layout__header">
      <div class="container app-layout__header-content">
        <div class="app-layout__logo">
          <router-link to="/">网络流量监测工具</router-link>
        </div>
        <nav class="app-layout__nav">
          <router-link
            to="/"
            class="app-layout__nav-item"
            active-class="app-layout__nav-item--active"
          >
            仪表盘
          </router-link>
          <router-link
            to="/monitor"
            class="app-layout__nav-item"
            active-class="app-layout__nav-item--active"
          >
            详细监控
          </router-link>
        </nav>
        <div class="app-layout__actions">
          <ThemeSwitch />
        </div>
      </div>
    </header>

    <main class="app-layout__main">
      <div class="container">
        <slot></slot>
      </div>
    </main>

    <footer class="app-layout__footer">
      <div class="container">
        <p class="text-center">网络流量监测工具 &copy; {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitch from './ThemeSwitch.vue'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__header {
    background-color: var(--background-color-component);
    box-shadow: var(--box-shadow-base);
    position: sticky;
    top: 0;
    z-index: 100;
    transition:
      background-color vars.$transition-normal,
      box-shadow vars.$transition-normal;
  }

  &__header-content {
    display: flex;
    align-items: center;
    height: 64px;
  }

  &__logo {
    font-size: 1.2rem;
    font-weight: vars.$font-weight-bold;
    margin-right: vars.$spacing-xl;

    a {
      color: var(--primary-color);
    }
  }

  &__nav {
    display: flex;
    flex: 1;
  }

  &__nav-item {
    padding: vars.$spacing-md;
    color: var(--text-color-secondary);
    position: relative;
    transition: color vars.$transition-fast;

    &:hover {
      color: var(--primary-color);
    }

    &--active {
      color: var(--primary-color);

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: vars.$spacing-md;
        right: vars.$spacing-md;
        height: 2px;
        background-color: var(--primary-color);
      }
    }
  }

  &__main {
    flex: 1;
    padding: vars.$spacing-lg 0;
  }

  &__footer {
    background-color: var(--background-color-component);
    padding: vars.$spacing-lg 0;
    margin-top: auto;
    transition: background-color vars.$transition-normal;
  }
}

@media (max-width: vars.$breakpoint-md) {
  .app-layout {
    &__logo {
      margin-right: vars.$spacing-md;
    }

    &__nav-item {
      padding: vars.$spacing-sm;
    }
  }
}
</style>
