<template>
  <div style="padding: 20px; color: white; background: red;">
    DEBUG — is_admin is: {{ authState.is_admin }} (type: {{ typeof authState.is_admin }})
  </div>
  <div v-if="authState.is_admin" class="h-100">
    <ChannelChat channel="admin-lounge" title="Admin Lounge" icon="mdi-shield-star-outline" />
  </div>
  <div v-else class="not-authorized">
    <p>You don't have access to this channel.</p>
  </div>
</template>

<script setup>
import ChannelChat from '@/components/ChannelChat.vue'
import { authState } from '@/services/authStore'
</script>

<style scoped>
.not-authorized {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7c80;
}
</style>