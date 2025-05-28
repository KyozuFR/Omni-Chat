<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 p-6 border border-gray-200 shadow-sm rounded-xl bg-white">
    <div class="space-y-1">
      <label for="author" class="block text-sm font-medium text-gray-700">Auteur</label>
      <input
        id="author"
        v-model="author"
        type="text"
        placeholder="Votre nom"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        required
      />
    </div>

    <div class="space-y-1">
      <label for="content" class="block text-sm font-medium text-gray-700">Message</label>
      <textarea
        id="content"
        v-model="content"
        rows="4"
        placeholder="Votre message..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        required
      ></textarea>
    </div>

    <div class="flex justify-between items-center mt-2">
      <div v-if="postError" class="text-red-500 text-sm">{{ postError.message }}</div>
      <button
        type="submit"
        :disabled="posting"
        class="ml-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <div class="flex items-center gap-2">
          <span v-if="posting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ posting ? 'Envoi en cours...' : 'Envoyer' }}
        </div>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import useFetch from '@/composables/useFetch'
import { type Message } from '@/types/message.types'
import { ref } from 'vue'

// Props and emits
const emit = defineEmits(['messagePosted'])

// POST new message
const author = ref('')
const content = ref('')
const {
  loading: posting,
  error: postError,
  execute: postMessage,
} = useFetch<Message>('https://api-omnichat.2linares.fr/api/messages', {
  method: 'POST',
  immediate: false,
})

// Submit form handler
const handleSubmit = async () => {
  await postMessage({
    author: author.value,
    content: content.value,
  })

  // Reset form after successful submission
  if (!postError.value) {
    content.value = ''

    // Emit event to notify parent component
    emit('messagePosted')
  }
}
</script>
