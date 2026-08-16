<template>
  <div class="subforum-page">
    <header class="subforum-header">
      <h1>👋 Welcome</h1>
    </header>
    
    <div class="thread-list">
      <div class="empty-state">
        <p>No threads yet. Be the first to post!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const threads = ref([])
</script>

<style scoped>
.subforum-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.subforum-header {
  margin-bottom: 30px;
}

.subforum-header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 600;
}

.thread-list {
  background: #2c2f33;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
}

.empty-state p {
  color: #8e9297;
  font-size: 16px;
}
</style>