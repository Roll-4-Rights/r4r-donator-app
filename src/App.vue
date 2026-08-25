<template>
  <div class="min-h-screen" style="background-color: #F4F6F8 !important;">
    <RouterView v-if="isAuthPage" />

    <v-layout v-else style="background-color: transparent !important;">
      
      <!-- HEADER BAR WITH DYNAMIC SCALING IMAGE AND SHADOW TEXT CONTRAST OVERLAY -->
      <v-app-bar color="primary" elevation="1" class="position-relative overflow-hidden">
        
        <!-- FULL-WIDTH RESPONSIVE BLEND IMAGE CONTAINER -->
        <div 
          class="header-logo-blend-wrapper-full d-none d-sm-block"
          :class="{ 'dimmed-backdrop': isMenuOpen }"
        >
          <v-img 
            src="https://unsplash.com" 
            alt="Header Background Graphic"
            cover
            height="100%"
            width="100%"
          ></v-img>
          <div class="blend-overlay-mask-responsive"></div>
        </div>

        <!-- READABILITY TEXT WITH HIGH CONTRAST DROP-SHADOW EFFECT SHADOW LAYER -->
        <router-link to="/" class="brand-link">
          <v-toolbar-title class="font-weight-bold position-relative z-index-top ml-4 brand-text-shadow">
            R4R
          </v-toolbar-title>
          <span v-if="isForumRoute" class="return-label">← Return to Portal</span>
        </router-link>
        
        <!-- PERSISTENT RIGHT-ALIGN PROFILE MENU DROPDOWN -->
        <v-menu v-model="isMenuOpen" min-width="220px" rounded="xl" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="mr-2 position-relative z-index-top">
              <v-avatar size="36" class="cursor-pointer border bg-white-transparent">
                <v-img src="https://placehold.co" alt="User Avatar"></v-img>
              </v-avatar>
            </v-btn>
          </template>
          
          <v-card class="mt-2 pa-2">
            <v-card-text class="pt-4 pb-3 px-4 text-center">
              <v-avatar size="48" class="mb-2 border bg-grey-lighten-3">
                <v-img src="https://placehold.co"></v-img>
              </v-avatar>
              <div class="text-subtitle-2 font-weight-bold text-grey-darken-4">
                {{ authState.name || 'Donator' }}
              </div>
              <div class="text-caption text-grey-darken-1 mb-2">
                {{ authState.email }}
              </div>
              
              <v-divider class="my-2"></v-divider>
              
              <v-list density="compact" nav class="pa-0 text-left">
                <v-list-item to="/account" prepend-icon="mdi-account-cog" title="Account Settings" value="settings" color="primary" rounded="lg" class="mb-1"></v-list-item>
                <v-list-item prepend-icon="mdi-logout" title="Sign Out" value="logout" color="error" rounded="lg" class="text-error font-weight-bold" @click="handleSignOut"></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-app-bar>

      <!-- Sidebar Container Box Panel Layer Wrapper -->
      <v-navigation-drawer
        v-if="!isForumRoute"
        style="background-color: #103948 !important;"
        theme="dark"
        permanent
        elevation="2"
        width="280"
      >
        <v-list style="background-color: transparent !important;" class="pa-2 custom-sidebar-list" active-color="secondary">
          <v-list-item to="/" exact prepend-icon="mdi-view-dashboard" title="Home"></v-list-item>
          
          
          <v-list-item to="/forum" prepend-icon="mdi-forum" title="Chat"></v-list-item>
          
          <v-list-item to="/guides-faq" prepend-icon="mdi-help-circle-outline" title="Guides/FAQs"></v-list-item>
          <v-list-item to="/current-campaign" prepend-icon="mdi-sword-cross" title="Current Campaign"></v-list-item>
          
          <!-- DONATE ITEMS TAB: Automatically clears alert dots when navigating to shipping information updates -->
          <v-list-item to="/donate-items" prepend-icon="mdi-creation-outline" title="Donate Items and View Winner Info">
            <template v-slot:append v-if="hasNewWinnerUpdates">
              <v-badge
                color="warning"
                dot
                inline
                class="custom-sidebar-dot"
              ></v-badge>
            </template>
          </v-list-item>
          
          <v-list-item to="/donator-information" prepend-icon="mdi-earth" title="Submit Donator Information"></v-list-item>
          <v-list-item to="/account" prepend-icon="mdi-account-circle-outline" title="Account"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-4 border-t-dark">
            <v-btn block color="error" variant="flat" class="rounded-lg font-weight-bold" @click="handleSignOut">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- Core App Canvas View Layout Grid Section Wrapper Workspace Layer -->
      <v-main :class="{ 'app-main': isForumRoute }">
        <div v-if="isForumRoute" class="forum-shell">
          <RouterView />
        </div>
        <v-container v-else fluid class="pa-8">
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { socket } from '@/socket'
import { authState, logout } from '@/services/authStore'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)

const isForumRoute = computed(() => route.path.startsWith('/forum'))
const isAuthPage = computed(() => route.path === '/login' || route.path === '/register')

const hasNewWinnerUpdates = ref(false)

socket.on('item-status-updated', (data) => {
  console.log('📦 Item status updated:', data)

  if (data.donatorId === authState.donator_id) {
    hasNewWinnerUpdates.value = true
  }
})

onMounted(() => {
  if (authState.isLoggedIn) {
    socket.emit('join-chat', {
      userId: authState.email,
      username: authState.name || authState.email,
      userType: 'user'
    })
  }
})

const handleSignOut = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
.text-error {
  color: rgb(var(--v-theme-error)) !important;
}

/* SIDEBAR WRAPPING AND ACTIVE GLOW OVERRIDES */
:deep(.custom-sidebar-list .v-list-item-title) {
  white-space: normal !important;
  line-height: 1.35 !important;
  font-size: 0.925rem !important;
}

:deep(.custom-sidebar-list .v-list-item) {
  margin-bottom: 6px !important;
  align-items: center !important;
  border-radius: 8px !important;
}

:deep(.custom-sidebar-list .v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  font-weight: 600 !important;
}

/* LOGOUT BUTTON PLACEMENT SPLIT */
.border-t-dark {
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* DYNAMICALLY RESPONSIVE BACKDROP SCALING ENGINE */
.header-logo-blend-wrapper-full {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.dimmed-backdrop {
  opacity: 0.65;
}

.blend-overlay-mask-responsive {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 100%),
    linear-gradient(to right, rgba(16, 57, 72, 0.1) 0%, rgba(16, 57, 72, 0.5) 25%, rgba(16, 57, 72, 1) 75%);
}

.brand-text-shadow {
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
}

.z-index-top {
  z-index: 2;
}

/* FORUM FULL-HEIGHT SHELL: makes the chat panel truly fill available space,
   with scrolling isolated inside ChannelChat's .messages, not the whole page */
.app-main {
  height: 100vh;
}

.forum-shell {
  height: 100%;
  overflow: hidden;
}

/* Debug Panel Styling */
.debug-panel {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.brand-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 auto;
}

.return-label {
  font-size: 0.8rem;
  opacity: 0.85;
  position: relative;
  z-index: 2;
  white-space: nowrap;
}

/* Prevent Vuetify's default flex:1 1 auto on v-toolbar-title from pushing
   the return-label away — keep "R4R" and the label tight together on the left */
:deep(.brand-link .v-toolbar-title) {
  flex: 0 0 auto !important;
}
</style>