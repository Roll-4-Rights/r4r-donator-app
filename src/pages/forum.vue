<template>
  <div class="forum-container">
    <aside class="forum-sidebar">
      <h2>Forum Channels</h2>
      <nav class="subforum-nav">
        <router-link 
          v-for="channel in channels" 
          :key="channel.path"
          :to="`/forum/${channel.path}`"
          class="channel-link"
          active-class="active"
        >
          <span class="channel-icon">{{ channel.icon }}</span>
          <span class="channel-name">{{ channel.name }}</span>
        </router-link>
      </nav>
    </aside>
    
    <main class="forum-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
const channels = [
  { name: 'Welcome', path: 'welcome', icon: '' },
  { name: 'Introduce Yourself', path: 'pinned-information', icon: '' },
  { name: 'General Chat', path: 'general-chat', icon: '' },
  { name: 'Donation Talk', path: 'donation-talk', icon: '' },
  { name: 'Dice Chat', path: 'dice-chat', icon: '' },
]
</script>

<style scoped>
.forum-container {
  display: flex;
  height: 100%;
}

.forum-sidebar {
  width: 250px;
  background: #2c2f33;
  padding: 20px;
  overflow-y: auto;
}

.forum-sidebar h2 {
  color: #fff;
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.subforum-nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.channel-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: #8e9297;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.channel-link:hover {
  background: #3a3d42;
  color: #dcddde;
}

.channel-link.active {
  background: #5865f2;
  color: #fff;
}

.channel-icon {
  font-size: 18px;
}

.channel-name {
  font-size: 15px;
  font-weight: 500;
}

.forum-content {
  flex: 1;
  background: #36393f;
  overflow-y: auto;
}
</style>