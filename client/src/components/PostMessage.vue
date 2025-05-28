<template>
  <form class="max-w-md mx-auto p-4 bg-white shadow-md rounded-md" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-4">
      <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
      <input id="author" v-model="author" type="text" class="border border-gray-300 rounded-md p-2" required />

      <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
      <textarea id="content" v-model="content" rows="4" class="border border-gray-300 rounded-md p-2" required></textarea>

      <button type="submit" :disabled="loading" class="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 disabled:opacity-50">
        {{ loading ? 'Envoi...' : 'Post Message' }}
      </button>
      <div v-if="error" class="text-red-500 text-sm">{{ error.message }}</div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useFetch from '@/composables/useFetch'
const emit = defineEmits<{ 'sent': void }>()

const author = ref('')
const content = ref('')

const { execute: sendMessage, loading, error } =
  useFetch<{ success: boolean }>('https://api-omnichat.2linares.fr/api/messages', {
    method: 'POST',
    headers: { 'X-Service': 'website' },
    immediate: false,
  })

async function onSubmit() {
  await sendMessage({ author: author.value, content: content.value })
  author.value = ''
  content.value = ''
  emit('sent')
}
</script>
