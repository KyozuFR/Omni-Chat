<template>
  <main class="max-w-xl mx-auto p-4">
    <!-- Message list -->
    <div v-if="fetchLoading" class="text-center py-4">Chargement...</div>
    <div v-else-if="fetchError" class="text-center text-red-500 py-4">{{ fetchError.message }}</div>
    <div v-else class="space-y-2">
      <MessageCard v-for="msg in messages" :key="msg.id" :message="msg" />
    </div>

    <!-- Inline form for posting messages -->
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 mt-6 p-4 border rounded-lg bg-white">
      <input v-model="author" type="text" placeholder="Auteur" class="p-2 border rounded" required />
      <textarea v-model="content" rows="3" placeholder="Message" class="p-2 border rounded" required></textarea>
      <button type="submit" :disabled="posting" class="self-end bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700">
        {{ posting ? 'Envoi...' : 'Envoyer' }}
      </button>
      <div v-if="postError" class="text-red-500 text-sm">{{ postError.message }}</div>
    </form>
  </main>
</template>

<script setup lang="ts">
import MessageCard from '@/components/MessageCard.vue'
import useFetch from '@/composables/useFetch'
import { type Message } from '@/types/message.types'
import { ref, onMounted } from 'vue'

// GET messages
const { data: messages, error: fetchError, loading: fetchLoading, execute: fetchMessages } =
  useFetch<Message[]>('https://api-omnichat.2linares.fr/api/messages')

// POST new message
const author = ref('')
const content = ref('')
const { error: postError, loading: posting, execute: sendMessage } =
  useFetch<{ id: number }>('https://api-omnichat.2linares.fr/api/messages', {
    method: 'POST',
    headers: { 'X-Service': 'website' },
    immediate: false,
  })

async function handleSubmit() {
  await sendMessage({ author: author.value, content: content.value })
  author.value = ''
  content.value = ''
  await fetchMessages()
}

onMounted(fetchMessages)
</script>

<style scoped>
/* no additional styles */
</style>

