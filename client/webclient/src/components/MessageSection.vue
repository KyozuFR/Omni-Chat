<template>
  <div class="h-1/2 overflow-y-auto mb-4 rounded-lg p-4 bg-gray-50">
    <div v-if="initialLoading" class="text-center py-4">Chargement...</div>
    <div v-else-if="fetchError" class="text-center text-red-500 py-4">{{ fetchError.message }}</div>
    <div v-else class="space-y-2">
      <TransitionGroup name="message-fade" tag="div" class="space-y-2">
        <MessageCard v-for="msg in displayedMessages" :key="msg.id" :message="msg" />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageCard from '@/components/MessageCard.vue'
import useFetch from '@/composables/useFetch'
import { type Message } from '@/types/message.types'
import { onMounted, onBeforeUnmount, ref } from 'vue'

// État pour le chargement initial vs les rafraîchissements
const initialLoading = ref(true)

// État pour stocker les messages affichés
const displayedMessages = ref<Message[]>([])

// GET messages
const {
  data: messages,
  error: fetchError,
  loading: fetchLoading,
  execute: fetchMessages,
} = useFetch<Message[]>('https://api-omnichat.2linares.fr/api/messages', {
  immediate: false // On désactive le chargement automatique pour le gérer manuellement
})

// Auto refresh interval (2secondes = 2000 ms)
const REFRESH_INTERVAL = 2000
let refreshTimer: number | null = null

// Fonction pour charger les messages sans flash
const loadMessages = async () => {
  try {
    await fetchMessages()

    // Si c'est le premier chargement ou s'il y a de nouveaux messages
    if (initialLoading.value || hasNewMessages()) {
      // Mettre à jour les messages affichés
      displayedMessages.value = messages.value ? [...messages.value] : []
      initialLoading.value = false
    }
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
  }
}

// Vérifier s'il y a de nouveaux messages
const hasNewMessages = () => {
  if (!messages.value) return false

  // Si le nombre de messages est différent
  if (displayedMessages.value.length !== messages.value.length) return true

  // Vérifier si l'ID du dernier message est différent
  if (displayedMessages.value.length > 0 && messages.value.length > 0) {
    return displayedMessages.value[0].id !== messages.value[0].id
  }

  return false
}

// Start auto refresh timer
const startAutoRefresh = () => {
  refreshTimer = window.setInterval(() => {
    loadMessages()
  }, REFRESH_INTERVAL)
}

// Stop auto refresh timer
const stopAutoRefresh = () => {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Expose functions for parent component
defineExpose({
  fetchMessages: loadMessages
})

// Fetch messages on component mount and start auto refresh
onMounted(() => {
  loadMessages()
  startAutoRefresh()
})

// Clean up timer on component unmount
onBeforeUnmount(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

