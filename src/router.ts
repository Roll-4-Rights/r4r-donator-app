import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from './pages/home.vue' 
import DonatorInformation from './pages/donator-information.vue'
import GuidesFaq from './pages/guides-faq.vue'
import CurrentCampaign from './pages/current-campaign.vue'
import DonateItems from './pages/donate-items.vue'
import Account from './pages/account.vue'
import Forum from './pages/forum.vue'
import ForumWelcome from './pages/forum/welcome.vue'
import ForumPinnedInformation from './pages/forum/pinned-information.vue'
import ForumGeneralChat from './pages/forum/general-chat.vue'
import ForumDonationTalk from './pages/forum/donation-talk.vue'
import ForumDiceChat from './pages/forum/dice-chat.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },    
  { path: '/donator-information', name: 'DonatorInformation', component: DonatorInformation },
  { path: '/guides-faq', name: 'GuidesFaq', component: GuidesFaq },
  { path: '/current-campaign', name: 'CurrentCampaign', component: CurrentCampaign },
  { path: '/donate-items', name: 'DonateItems', component: DonateItems },
  { path: '/account', name: 'Account', component: Account },
  { 
    path: '/forum', 
    name: 'Forum', 
    component: Forum,
    redirect: '/forum/welcome',
    children: [
      { path: 'welcome', name: 'ForumWelcome', component: ForumWelcome },
      { path: 'pinned-information', name: 'ForumPinnedInformation', component: ForumPinnedInformation },
      { path: 'general-chat', name: 'ForumGeneralChat', component: ForumGeneralChat },
      { path: 'donation-talk', name: 'ForumDonationTalk', component: ForumDonationTalk },
      { path: 'dice-chat', name: 'ForumDiceChat', component: ForumDiceChat }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
