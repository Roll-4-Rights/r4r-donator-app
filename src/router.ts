import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from './pages/home.vue' 
import DonatorInformation from './pages/donator-information.vue'
import Messages from './pages/messages.vue'
import GuidesFaq from './pages/guides-faq.vue'
import CurrentCampaign from './pages/current-campaign.vue'
import DonateItems from './pages/donate-items.vue'
import Account from './pages/account.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },    
  { path: '/donator-information', name: 'DonatorInformation', component: DonatorInformation },
  { path: '/messages', name: 'Messages', component: Messages },   
  { path: '/guides-faq', name: 'GuidesFaq', component: GuidesFaq }, // Changed URL to match file
  { path: '/current-campaign', name: 'CurrentCampaign', component: CurrentCampaign }, // Changed URL to match file
  { path: '/donate-items', name: 'DonateItems', component: DonateItems }, // Changed URL to match file
  { path: '/account', name: 'Account', component: Account } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
