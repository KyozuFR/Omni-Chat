<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav class="bg-blue-900 text-white text-lg font-bold">
        <RouterLink to="/">Home</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>
