<template>
  <!-- Main container matching your design layout guidelines -->
  <v-container class="py-10 px-6" max-width="1200">
    
    <!-- Section 1: Dynamic Welcome Step Grid Overview -->
    <div class="mb-4 pl-2 text-left">
      <span class="text-subtitle-2 font-weight-bold text-medium-emphasis uppercase tracking-wider">Start Here!</span>
      <h1 class="text-h3 font-weight-black text-black mt-1 mb-8">submission guide</h1>
    </div>

    <v-row class="mb-12">
      <!-- Step 1 Card -->
      <v-col cols="12" md="4" class="d-flex">
        <v-card class="rounded-2xl border-0 flex-grow-1" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
          <!-- FIXED: Wrapped inside v-card-text with comfortable padding -->
          <v-card-text class="pa-6 d-flex flex-column align-start text-left h-100">
            <!-- Styled Icon Step Indicator Badge -->
            <v-avatar color="#0B4F6C" size="36" class="text-white mb-4">
              <v-icon icon="mdi-check" size="18"></v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-black text-black mb-2">Step 1</h2>
            <p class="text-body-2 text-medium-emphasis leading-relaxed">
              Complete your Donator Information form on the Submit Donator Information page located in the navigation to the left. This form only needs to be submitted once. If there are any issues after you submit, reach out to a team member.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Step 2 Card -->
      <v-col cols="12" md="4" class="d-flex">
        <v-card class="rounded-2xl border-0 flex-grow-1" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
          <!-- FIXED: Wrapped inside v-card-text with comfortable padding -->
          <v-card-text class="pa-6 d-flex flex-column align-start text-left h-100">
            <v-avatar color="#0B4F6C" size="36" class="text-white mb-4">
              <v-icon icon="mdi-check" size="18"></v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-black text-black mb-2">Step 2</h2>
            <p class="text-body-2 text-medium-emphasis leading-relaxed mb-4">
              Donate an item! Or multiple items! Click the "Donate an Item" page in the navigation pane to the left!
            </p>
            <p class="text-body-2 text-medium-emphasis font-weight-bold mt-auto">
              For each item you'll submit a new form on this page. There, you will be able to see and edit what you've submitted and view its status.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Step 3 Card -->
      <v-col cols="12" md="4" class="d-flex">
        <v-card class="rounded-2xl border-0 flex-grow-1" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
          <!-- FIXED: Wrapped inside v-card-text with comfortable padding -->
          <v-card-text class="pa-6 d-flex flex-column align-start text-left h-100">
            <v-avatar color="#0B4F6C" size="36" class="text-white mb-4">
              <v-icon icon="mdi-check" size="18"></v-icon>
            </v-avatar>
            <h2 class="text-h6 font-weight-black text-black mb-2">Step 3</h2>
            <p class="text-body-2 text-medium-emphasis leading-relaxed">
              Keep an eye on the portal main page for any announcements. Check the FAQ below for any answers you may need. Join the chat! If you still have questions, send a team member a message using the form (not made yet).
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Deep Accent Separator Line -->
    <v-divider class="mb-12 border-divider opacity-50"></v-divider>

    <!-- Section 2: Non-Dropdown FAQ Grid Block -->
    <div class="text-center mb-8">
      <h2 class="text-h4 font-weight-black text-black mb-2">FAQ and Guides</h2>
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
</style>
