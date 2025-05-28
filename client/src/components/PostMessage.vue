<template>
  <form class="max-w-md mx-auto p-4 bg-white shadow-md rounded-md" @submit.prevent>
    <div class="flex flex-col gap-4">
      <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
      <input id="author" type="text" class="border border-gray-300 rounded-md p-2" />

      <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
      <textarea id="content" rows="4" class="border border-gray-300 rounded-md p-2"></textarea>

      <button type="submit" class="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600">
        Post Message
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">

</script>
