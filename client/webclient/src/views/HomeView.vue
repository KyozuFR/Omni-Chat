<template>
  <main class="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
    <div class="space-y-6">
      <header class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">OmniChat</h1>
        <p class="text-gray-600">Plateforme de messagerie unifiée</p>
      </header>

      <!-- Section des messages avec effet d'ombre et meilleur positionnement -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <MessageSection ref="messageSection" />
      </div>

      <!-- Section du formulaire d'envoi avec espacement -->
      <div class="mt-6">
        <PostMessage @message-posted="refreshMessages" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import MessageSection from '@/components/MessageSection.vue'
import PostMessage from '@/components/PostMessage.vue'
import { ref } from 'vue'

// Référence au composant MessageSection pour pouvoir appeler sa méthode fetchMessages
const messageSection = ref<InstanceType<typeof MessageSection> | null>(null)

// Fonction pour rafraîchir les messages après l'envoi d'un nouveau message
const refreshMessages = () => {
  if (messageSection.value) {
    messageSection.value.fetchMessages()
  }
}
</script>
