<template>
  <!-- Main container matching your design layout guidelines -->
  <v-container class="py-10 px-6" max-width="1200">
    
    <!-- Section 1: Dynamic Welcome Step Grid Overview -->
    <div class="page-header mb-8">
      <h1 class="page-title">Submission Guide</h1>
      <p class="page-sub">Start here! Complete the steps below to set up your contributor profile and submit your prizes for auction.</p>
    </div>

    <v-row class="mb-12">
      <!-- Step 1 Card -->
      <v-col cols="12" md="4" class="d-flex">
        <v-card class="rounded-2xl border-0 flex-grow-1" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
          <!-- FIXED: Wrapped inside v-card-text with comfortable padding -->
          <v-card-text class="pa-6 d-flex flex-column align-start text-left h-100">
            <!-- Styled Icon Step Indicator Badge -->
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <v-avatar color="#0B4F6C" size="36" class="text-white" style="margin-right: 12px;">
                <v-icon icon="mdi-check" size="18"></v-icon>
              </v-avatar>
              <h2 class="text-h6 font-weight-black text-black" style="margin: 0;">Step 1</h2>
            </div>
            <p class="text-body-2 text-medium-emphasis leading-relaxed">
              Head to the Submit Contributor Information page and complete the form. 
              This is the information that will be displayed with your prizes on the auction website, so that bidders can know a bit about you. It will also determine where your listings can be shipped, so please take care with filling it out correctly!
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Step 2 Card -->
      <v-col cols="12" md="4" class="d-flex">
        <v-card class="rounded-2xl border-0 flex-grow-1" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
          <!-- FIXED: Wrapped inside v-card-text with comfortable padding -->
          <v-card-text class="pa-6 d-flex flex-column align-start text-left h-100">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <v-avatar color="#0B4F6C" size="36" class="text-white" style="margin-right: 12px;">
                <v-icon icon="mdi-check" size="18"></v-icon>
              </v-avatar>
              <h2 class="text-h6 font-weight-black text-black" style="margin: 0;">Step 2</h2>
            </div>
            <p class="text-body-2 text-medium-emphasis leading-relaxed mb-4">
              Submit your prize(s) on the Contribute Prizes & View Winner Info page.
            </p>
            <p class="text-body-2 text-medium-emphasis font-weight-bold mt-auto">
              After you've filled out the form on the Submit A Donation tab, you'll be able to view your prizes' listing information under the My Donations tab.
            </p>
            <br>
            <p class="text-body-2 text-medium-emphasis font-weight-bold mt-auto">
              Once the auction you submitted a prize for has finished and your winning bidder's donation has been verified, you'll find their information under the Winner And Shipping Info tab. This is also where you'll add tracking information when you've shipped your prize.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Step 3 Card -->
      <v-col cols="12" md="4" class="d-flex">
        <v-card class="rounded-2xl border-0 flex-grow-1" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
          <!-- FIXED: Wrapped inside v-card-text with comfortable padding -->
          <v-card-text class="pa-6 d-flex flex-column align-start text-left h-100">
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <v-avatar color="#0B4F6C" size="36" class="text-white" style="margin-right: 12px;">
                <v-icon icon="mdi-check" size="18"></v-icon>
              </v-avatar>
              <h2 class="text-h6 font-weight-black text-black" style="margin: 0;">Step 3</h2>
            </div>
            <p class="text-body-2 text-medium-emphasis leading-relaxed">
              You're all done!
              </p>
              <br>
              <p>
              Keep an eye on the Home page for announcements or to see what's up next on the calendar. If you have any questions that aren't answered in the FAQ below, feel free to ask the admin team on the Messages page.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Deep Accent Separator Line -->
    <v-divider class="mb-12 border-divider opacity-50"></v-divider>

    <!-- Section 2: Non-Dropdown FAQ Grid Block -->
    <div class="page-header mb-8 text-center">
      <h1 class="page-title">FAQ</h1>
    </div>

    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="#0B4F6C" />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-body-1 text-medium-emphasis">Unable to load FAQs right now. Please try again later.</p>
    </div>

    <template v-else>
      <!-- Toggleable Navigation Tabs -->
      <div class="d-flex justify-center mb-8">
        <v-tabs v-model="activeTab" color="#0B4F6C" align-tabs="center" class="border-b-0">
          <v-tab
            v-for="topic in topics"
            :key="topic"
            :value="topic"
            class="text-none font-weight-bold px-6"
          >
            {{ topic }}
          </v-tab>
        </v-tabs>
      </div>

      <!-- Flattened Non-Dropdown Dynamic Loop Matrix -->
      <v-window v-model="activeTab">
        <v-window-item v-for="topic in topics" :key="topic" :value="topic">
          <v-row>
            <v-col
              cols="12"
              v-for="item in faqsByTopic(topic)"
              :key="item.Id"
              class="pb-4"
            >
              <v-card
                class="rounded-xl border-0"
                style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;"
                elevation="0"
              >
                <v-card-text class="pa-6 pa-md-8 text-left">
                  <h3 class="text-subtitle-1 font-weight-black text-black mb-2">
                    {{ item.Question }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis leading-relaxed">
                    {{ item.Answer }}
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </template>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'

interface FaqItem {
  Id: number
  Question: string
  Answer: string
  Topic: string
  Order: number
  Active: boolean
}

const allFaqs = ref<FaqItem[]>([])
const loading = ref(true)
const error = ref(false)
const activeTab = ref('')

const topics = computed(() => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const faq of allFaqs.value) {
    if (faq.Active && !seen.has(faq.Topic)) {
      seen.add(faq.Topic)
      result.push(faq.Topic)
    }
  }
  return result
})

function faqsByTopic(topic: string) {
  return allFaqs.value
    .filter((f) => f.Topic === topic && f.Active)
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
}

onMounted(async () => {
  try {
    const data = await apiService.fetchDonatorFaqs()
    allFaqs.value = data
    if (topics.value.length > 0) {
      activeTab.value = topics.value[0]
    }
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.border-divider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.page-eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.72);
  margin-bottom: 0.5rem;
}
.page-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: #000000;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}
.page-sub {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.72);
  max-width: 46ch;
  margin: 0;
}
</style>
