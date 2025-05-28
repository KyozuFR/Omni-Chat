<template>
  <main>
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else>
      <MessageCard v-for="msg in messages" :key="msg.id" :message="msg" />
    </div>
    <PostMessage />
  </main>
</template>

<script setup lang="ts">
import MessageCard from '@/components/MessageCard.vue'
import { type Message } from '@/types/message.types'
import useFetch from '@/composables/useFetch'
import PostMessage from '@/components/PostMessage.vue'

const {
  data: messages,
  error,
  loading,
} = useFetch<Message[]>('https://api-omnichat.2linares.fr/api/messages')
</script>
