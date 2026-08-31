<template>
  <div class="forum-container">
    <button class="mobile-toggle" @click="sidebarOpen = !sidebarOpen">
      <span class="mdi mdi-menu"></span>
    </button>

    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false"></div>

    <aside class="forum-sidebar" :class="{ open: sidebarOpen }">
      <h2>Chat Channels</h2>
      <nav class="subforum-nav">
        <router-link 
          v-for="channel in channels" 
          :key="channel.path"
          :to="`/forum/${channel.path}`"
          class="channel-link"
          active-class="active"
          @click="sidebarOpen = false"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { socket } from '@/socket'

const sidebarOpen = ref(false)

const channels = [
  { name: 'Welcome', path: 'welcome', icon: '' },
  { name: 'Introduce Yourself', path: 'pinned-information', icon: '' },
  { name: 'General Chat', path: 'general-chat', icon: '' },
  { name: 'Donation Talk', path: 'donation-talk', icon: '' },
  { name: 'Dice Chat', path: 'dice-chat', icon: '' },
]

onMounted(() => {
  socket.connect()
})

onUnmounted(() => {
  socket.disconnect()
})
</script>

<style scoped>
.forum-container {
  display: flex;
  height: 100%;
  position: relative;
}

.mobile-toggle {
  display: none;
}

.sidebar-backdrop {
  display: none;
}

.forum-sidebar {
  width: 250px;
  background: #2c2f33;
  padding: 20px;
  overflow-y: auto;
  flex-shrink: 0;
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
  min-width: 0;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 20;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #2c2f33;
    color: #fff;
    border: none;
    font-size: 20px;
  }

  .forum-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 15;
    transform: translateX(-100%);
    transition: transform 0.2s ease-out;
  }

  .forum-sidebar.open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }

  .forum-content {
    padding-top: 50px;
  }
}
</style>