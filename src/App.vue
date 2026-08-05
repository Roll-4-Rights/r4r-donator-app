<template>
  <div class="min-h-screen" style="background-color: #F4F6F8 !important;">
    <v-layout style="background-color: transparent !important;">
      
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
        <v-toolbar-title class="font-weight-bold position-relative z-index-top ml-4 brand-text-shadow">
          R4R
        </v-toolbar-title>
        
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
                Jane Smith
              </div>
              <div class="text-caption text-grey-darken-1 mb-2">
                janesmith@example.com
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
        style="background-color: #103948 !important;"
        theme="dark"
        permanent
        elevation="2"
        width="280"
      >
        <v-list style="background-color: transparent !important;" class="pa-2 custom-sidebar-list" active-color="secondary">
          <v-list-item to="/" exact prepend-icon="mdi-view-dashboard" title="Home"></v-list-item>
          
          <!-- MESSAGES TAB: Automatically resets unread count badge to zero on page visit routing -->
          <v-list-item to="/messages" prepend-icon="mdi-message" title="Messages">
            <template v-slot:append v-if="unreadMessages > 0">
              <v-badge
                color="error"
                :content="unreadMessages"
                inline
                class="custom-sidebar-badge"
              ></v-badge>
            </template>
          </v-list-item>
          
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
      <v-main>
        <v-container fluid class="pa-8">
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>

    <!-- Socket Connection Debug (Remove in production) -->
    <div class="debug-panel">
      <ConnectionState />
      <ConnectionManager />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import ConnectionState from './components/ConnectionState.vue'
import ConnectionManager from './components/ConnectionManager.vue'
import { socket, state } from '@/socket'

const route = useRoute()
const isMenuOpen = ref(false)

const getUserId = () => {
  let userId = localStorage.getItem('donator_user_id');
  if (!userId) {
    userId = 'user_03l1q6br2'; // Or get from auth system
    localStorage.setItem('donator_user_id', userId);
  }
  return userId;
}

const currentUser = ref({
  id: getUserId(),
  name: 'Jane Smith'
})

const unreadMessages = ref(0)
const hasNewWinnerUpdates = ref(false)

// FIX: Only increment unread if message is FOR THIS USER
socket.on('receive-message', (data) => {
  console.log('📨 Received message:', data)
  console.log('🔍 Message userID:', data.userID || data.userId)
  console.log('🔍 My userID:', currentUser.value.id)
  
  // Check if this message is for THIS user and from admin
  const isForMe = (data.userID === currentUser.value.id || data.userId === currentUser.value.id)
  const isFromAdmin = data.senderType === 'admin'
  const notOnMessagesPage = route.path !== '/messages'
  
  if (isForMe && isFromAdmin && notOnMessagesPage) {
    unreadMessages.value++
    console.log('🔔 Incremented unread messages to:', unreadMessages.value)
  } else {
    console.log('⚠️ Not incrementing unread because:', {
      isForMe,
      isFromAdmin,
      notOnMessagesPage
    })
  }
})

socket.on('item-status-updated', (data) => {
  console.log('📦 Item status updated:', data)
  
  if (data.userId === currentUser.value.id) {
    hasNewWinnerUpdates.value = true
  }
})

onMounted(() => {
  console.log('🚀 App mounted, joining chat...')
  console.log('👤 Current user:', currentUser.value)
  
  socket.emit('join-chat', {
    userId: currentUser.value.id,
    username: currentUser.value.name,
    userType: 'user'
  })
  
  console.log('✅ Join-chat emitted with ID:', currentUser.value.id)
})

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/messages') {
      console.log('📭 Clearing unread messages')
      unreadMessages.value = 0
    }
    if (newPath === '/donate-items') {
      hasNewWinnerUpdates.value = false
    }
  },
  { immediate: true }
)

const handleSignOut = () => {
  localStorage.removeItem('donator_user_id');
  console.log('Clearing local storage tokens and routing back to identity provider login...')
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

/* CUSTOM BADGE LAYOUT OVERRIDES */
:deep(.custom-sidebar-badge .v-badge__badge) {
  font-size: 0.75rem !important;
  height: 18px !important;
  min-width: 18px !important;
  padding: 0 4px !important;
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
</style>