<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Message } from '@/types/message.types'
import { ServicesEnum } from '@/types/message.types'

const { message, isOwn = false } = defineProps<{ message: Message; isOwn?: boolean }>()
const formattedDate = computed(() => new Date(message.createdAt).toLocaleString())
const serviceSeverity = computed(() => {
  const map: Record<ServicesEnum, 'info' | 'success' | 'warning' | 'danger' | 'secondary'> = {
    [ServicesEnum.DISCORD]: 'info',
    [ServicesEnum.WHATSAPP]: 'success',
    [ServicesEnum.GARRYS_MOD]: 'warning',
    [ServicesEnum.MINECRAFT]: 'success',
    [ServicesEnum.TWITCH]: 'warning',
    [ServicesEnum.WEBSITE]: 'secondary',
    [ServicesEnum.ROBLOX]: 'danger',
    [ServicesEnum.TELEGRAM]: 'info',
  }
  return map[message.service] ?? 'secondary'
})
</script>

<template>
  <div :class="['flex my-2 px-4', isOwn ? 'justify-end' : 'justify-start']">
    <div :class="[
      'max-w-[80%] px-8 py-6 rounded-full shadow',
      isOwn
        ? 'bg-blue-500 text-white rounded-br-sm'
        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
    ]">
      <template v-if="!isOwn">
        <div class="font-bold text-sm mb-1">{{ message.author }}</div>
      </template>
      <div class="mb-2 break-words">{{ message.content }}</div>
      <div :class="['flex justify-between items-center text-xs gap-2', isOwn ? 'text-white text-opacity-75' : 'text-gray-600']">
        <span>{{ formattedDate }}</span>
        <PrimeTag :value="message.service" :severity="serviceSeverity" rounded size="small" />
      </div>
    </div>
  </div>
</template>

