// this file defines the app's main routes, without it, 404's abound; it also maps standard pages on the app and has a nested layout for the chat feature
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// --- View Component Imports ---
// main application views mapped directly to single-page URL endpoints
import Home from './pages/home.vue' 
import DonatorInformation from './pages/donator-information.vue'
import GuidesFaq from './pages/guides-faq.vue'
import CurrentCampaign from './pages/current-campaign.vue'
import DonateItems from './pages/donate-items.vue'
import Account from './pages/account.vue'
import Login from './pages/login.vue'
import Register from './pages/register.vue'
import Messages from './pages/messages.vue'
import Admin from './pages/admin.vue'

// --- Forum Feature Component Imports ---
// sub-components (forum/chat)
import Forum from './pages/forum.vue'
import ForumWelcome from './pages/forum/welcome.vue'
import ForumPinnedInformation from './pages/forum/pinned-information.vue'
import ForumGeneralChat from './pages/forum/general-chat.vue'
import ForumDonationTalk from './pages/forum/donation-talk.vue'
import ForumDiceChat from './pages/forum/dice-chat.vue'


// --- Authentication State Management ---
// checks if a user is logged in, importing from authStore
import { authState, waitForAuthReady } from './services/authStore'

// defines the list of URLS/pages in the app, determining if a page is public or requires being logged-in (authentication) (the only ones that should be set to public are login and register)
const routes: Array<RouteRecordRaw> = [
  { path: '/login', name: 'Login', component: Login, meta: { public: true } },
  { path: '/register', name: 'Register', component: Register, meta: { public: true } },
  { path: '/', name: 'Home', component: Home },    
  { path: '/donator-information', name: 'DonatorInformation', component: DonatorInformation },
  { path: '/guides-faq', name: 'GuidesFaq', component: GuidesFaq },
  { path: '/current-campaign', name: 'CurrentCampaign', component: CurrentCampaign },
  { path: '/donate-items', name: 'DonateItems', component: DonateItems },
  { path: '/account', name: 'Account', component: Account },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/messages', name: 'Messages', component: Messages },

    // Nested Forum Routes: Utilizes a parent layout view containing an internal router-view anchor for dynamic child component mounting
  { 
    path: '/forum', 
    name: 'Forum', 
    component: Forum,
    redirect: '/forum/welcome', // Intercepts the base /forum path and automatically forwards traffic to the default welcome tab
    children: [
      { path: 'welcome', name: 'ForumWelcome', component: ForumWelcome },
      { path: 'pinned-information', name: 'ForumPinnedInformation', component: ForumPinnedInformation },
      { path: 'general-chat', name: 'ForumGeneralChat', component: ForumGeneralChat },
      { path: 'donation-talk', name: 'ForumDonationTalk', component: ForumDonationTalk },
      { path: 'dice-chat', name: 'ForumDiceChat', component: ForumDiceChat },

    ]
  }
]

// Initialize the Vue Router instance with clean URL paths via HTML5 History API and the mapped routes array
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global Navigation Guard: Intercepts all client-side page transfers to evaluate security and routing access parameters
router.beforeEach(async (to) => {
  await waitForAuthReady()

  // Authorization Guard: Redirects unauthenticated traffic away from private views and forces them onto the login route
  if (!to.meta.public && !authState.isLoggedIn) {
    return { path: '/login' }
  }
  // Redundancy Guard: Prevents active users from accessing authentication forms by redirecting them to the landing route
  if (to.meta.public && authState.isLoggedIn) {
    return { path: '/' }
  }
})

export default router
