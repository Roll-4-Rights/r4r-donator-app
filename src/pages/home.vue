<template>
  <!-- Main layout container with comfortable outer edge padding -->
  <v-container class="py-10 px-6" max-width="1400">
         
    <!-- Welcome Block Box -->
    <v-card 
      class="mb-10 rounded-2xl border-0 elevation-hover position-relative overflow-visible" 
      style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"
      elevation="0"
    >
      <v-card-text class="pa-6 pa-md-10 position-relative z-index-content">
        <div class="d-flex align-start flex-column text-left">
          <div class="d-flex align-center gap-2 mb-2 text-medium-emphasis font-weight-bold text-subtitle-2">
            <v-icon icon="mdi-calendar-blank" size="18" class="mr-1"></v-icon>
            <span>7/28/2026</span>
          </div>
          <h1 class="text-h4 text-sm-h3 text-md-h2 font-weight-black text-black mb-4 leading-none">
            Hail and well met, {{ userName }}!
          </h1>
          <p class="text-body-1 text-medium-emphasis leading-relaxed max-w-3xl">
            Thanks for supporting the auction! Here you will be able to submit and view your donations, as well as contact the team.
          </p>
        </div>
      </v-card-text>

      <!-- THE CORNER PEEKING DRAGON -->
      <img 
        src="@/assets/dragon.png" 
        alt="Peeking Dragon" 
        class="corner-dragon"
      />

      <img 
        src="@/assets/grass.png" 
        alt="Grass Cover" 
        class="foreground-cover"
      />
    </v-card>

    <!-- Main Content Layout Row Split -->
    <v-row class="justify-space-between mx-0">
             
      <!-- Announcements Component Column (Left Side) -->
      <v-col cols="12" md="7" class="pa-0 pe-md-6 mb-8 mb-md-0">
        <div class="d-flex align-center mb-5 pl-2">
          <h2 class="text-h5 font-weight-black text-black">Announcements</h2>
        </div>

        <v-expansion-panels variant="accordion" class="rounded-xl">
          <v-expansion-panel
            v-for="item in announcements"
            :key="item.id"
            class="mb-4 rounded-xl border-0 overflow-hidden elevation-hover"
            style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"
            elevation="0"
          >
            <v-expansion-panel-title class="py-6 px-8">
              <div style="display: block !important; width: 100% !important; text-align: left !important;">
                <div class="d-flex align-center ga-2 mb-1">
                  <span class="text-subtitle-2 font-weight-bold text-medium-emphasis" style="display: block !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;">
                    {{ item.date }}
                  </span>
                  <v-chip v-if="item.priority" size="x-small" variant="flat" :color="PRIORITY_COLOR_MAP[item.priority] || '#0B4F6C'" class="font-weight-bold text-white flex-shrink-0">
                    {{ item.priority }}
                  </v-chip>
                </div>
                <div class="text-h6 font-weight-black text-black" style="display: block !important; white-space: normal !important; overflow-wrap: break-word !important; word-break: break-word !important; min-width: 0; font-size: 1.4rem !important;">
                  {{ item.title }}
                </div>
              </div>
            </v-expansion-panel-title>
                        
            <v-expansion-panel-text class="pa-6">
              <div class="text-body-2 text-small-emphasis leading-relaxed" style="white-space: normal !important; overflow-wrap: break-word !important; word-break: break-word !important; min-width: 0;">
                {{ item.content }}
              </div>
            </v-expansion-panel-text>
        
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- Recent Messages Component Column (Right Side) -->
      <v-col cols="12" md="5" lg="4" class="pa-0 ps-md-10">
        <div class="d-flex align-center mb-8 pl-2">
          <h2 class="text-h5 font-weight-black text-black">Recent Messages</h2>
        </div>

        <!-- Master Floating Container -->
        <v-card 
          class="rounded-2xl border-0 elevation-hover"
          style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;"
          elevation="0"
        >
          <v-card-text class="pa-6 pa-md-8 d-flex flex-column">
            <!-- Full Inbox Button -->
            <v-btn 
              to="/messages"
              size="small"
              color="#0B4F6C"
              variant="flat"
              class="text-none font-weight-bold rounded-lg mb-8 w-100 py-2 d-flex align-center justify-center text-white"
            >
              <v-icon icon="mdi-arrow-top-right" size="16" class="mr-1"></v-icon>
              See All Messages
            </v-btn>

            <!-- Dynamic Message View Section -->
            <div v-if="latestMessage" class="d-flex flex-column">
              <div class="d-flex flex-column align-start mb-4">
                <span class="text-subtitle-2 font-weight-bold text-medium-emphasis mb-2">
                  {{ latestMessage.date }}
                </span>
                              
                <h3 class="text-body-1 font-weight-black text-black mb-2">
                  {{ latestMessage.subject }}
                </h3>
                              
                <p class="text-body-2 text-medium-emphasis leading-relaxed mb-6">
                  {{ latestMessage.preview }}
                </p>

                <v-chip
                  size="x-small"
                  :color="latestMessage.status === 'Answered' ? 'success' : 'warning'"
                  variant="flat"
                  class="font-weight-bold px-3 py-2 text-white"
                >
                  {{ latestMessage.status }}
                </v-chip>
              </div>
            </div>

            <!-- Empty fallback layout view box -->
            <div v-else class="text-center py-6 text-medium-emphasis">
              <p class="text-body-2">Your inbox is completely clear!</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

<!-- START CALENDAR HTML -->
<v-row class="mt-8">
  <v-col cols="12" md="10" class="mx-auto">
    <v-card class="rounded-2xl border-0 overflow-hidden pb-6" style="box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.05) !important; background-color: #FFFFFF;">
      
      <div class="px-8 pt-8 pb-4 bg-white">
        <h2 class="text-h4 font-weight-black text-grey-darken-4 tracking-tight" style="font-family: 'Inter', sans-serif; font-size: 2rem !important;">
          Important Dates
        </h2>
        <p class="text-body-2 text-medium-emphasis mt-1 mb-0">
          deadlines and other events
        </p>
      </div>

      <div class="d-flex align-center justify-space-between mx-8 my-2 px-4 py-2 border rounded-xl bg-grey-lighten-5" style="border-color: #EEEEEE !important;">
        <v-btn icon="mdi-chevron-left" variant="text" density="comfortable" @click="calendarRef.prev()" class="text-grey-darken-2"></v-btn>
        <span class="text-subtitle-1 font-weight-bold text-grey-darken-3" style="font-family: 'Inter', sans-serif; letter-spacing: -0.01em;">
          {{ currentMonthTitle }}
        </span>
        <v-btn icon="mdi-chevron-right" variant="text" density="comfortable" @click="calendarRef.next()" class="text-grey-darken-2"></v-btn>
      </div>

      <v-card-text class="px-6 pt-4 pb-8 bg-white">
        <v-calendar 
          ref="calendarRef"
          v-model="calendarValue"
          :events="publicCalendar"
          view-mode="month"
          class="custom-calendar-theme"
        >
          <template #event="{ event }">
            <div class="w-100 px-1 py-05">
              <div
                class="custom-event-pill px-3 py-1 text-white font-weight-bold d-flex align-center justify-space-between"
                :style="{ background: event.color }"
                @click.stop="handleEventClick({ event })"
              >
                <span class="text-truncate text-caption tracking-wide pr-1">{{ event.title }}</span>
                <v-icon icon="mdi-circle" size="6" class="text-white opacity-60 flex-shrink-0"></v-icon>
              </div>
            </div>
          </template>
        </v-calendar>
      </v-card-text>

    </v-card>
  </v-col>

  <!-- FIXED POPUP DIALOG WINDOW -->
  <v-dialog v-model="detailsDialog" max-width="450px">
    <v-card v-if="selectedEvent" class="rounded-xl pa-4 shadow-xl">
      <!-- 1. Header Title -->
      <v-card-title class="text-h5 font-weight-bold border-b pb-3">
        {{ selectedEvent.title }}
      </v-card-title>
      
      <v-card-text class="pt-5 text-body-1">
        <!-- 2. Clean Time Display (Explicitly tracking individual Start and End Days) -->
        <div class="d-flex align-start text-subtitle-2 font-weight-bold text-medium-emphasis mb-5">
          <v-icon icon="mdi-clock-outline" size="18" class="mr-2 mt-05 text-grey-darken-1"></v-icon>
          <div class="d-flex flex-column" style="gap: 6px;">
            <!-- Start Point -->
            <div>
              <span class="text-grey-darken-1 font-weight-medium">Starts:</span> 
              {{ new Date(selectedEvent.start).toLocaleDateString([], { dateStyle: 'medium' }) }} 
              • {{ new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
            <!-- End Point (Shows the distinct closing day cleanly) -->
            <div>
              <span class="text-grey-darken-1 font-weight-medium">Ends:</span> 
              {{ new Date(selectedEvent.end).toLocaleDateString([], { dateStyle: 'medium' }) }} 
              • {{ new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>
        </div>

        <!-- 2b. Event Type Chip -->
        <v-chip v-if="selectedEvent.eventType" size="small" variant="flat" :color="selectedEvent.color" class="font-weight-bold text-white mb-4">
          {{ selectedEvent.eventType }}
        </v-chip>

        <!-- 3. Details Label & Description Text Box -->
        <div class="text-subtitle-2 text-grey-darken-2 mb-1 font-weight-bold">Details</div>
        <p class="text-high-emphasis font-weight-medium bg-grey-lighten-4 pa-4 rounded-xl border border-faint" style="line-height: 1.5;">
          {{ selectedEvent.description }}
        </p>
      </v-card-text>
      
      <v-card-actions class="justify-end">
        <v-btn color="primary" variant="text" class="font-weight-bold" @click="detailsDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-row>
<!--END CALENDAR HTML-->

  </v-container>
</template>

<script setup lang="ts">
// filepath: c:\Users\gamer\Documents\Roll4Rights\r4r-donator-app\src\pages\home.vue
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'
import { authState } from '@/services/authStore'

// Messages Preview
interface MessageItem {
  Id: number
  Question: string
  Answer: string
  Status: string
  'Created At': string
}

const latestMessage = ref<{ date: string; subject: string; preview: string; status: string } | null>(null)

function truncate(text: string, max = 140) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

const fetchLatestMessage = async () => {
  try {
    const rows: MessageItem[] = await apiService.fetchMessages()
    if (rows && rows.length > 0) {
      const mostRecent = rows[0]
      latestMessage.value = {
        date: mostRecent['Created At']
          ? new Date(mostRecent['Created At']).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
          : '',
        subject: mostRecent.Question,
        preview: mostRecent.Answer ? truncate(mostRecent.Answer) : 'Awaiting a response from the team.',
        status: mostRecent.Status
      }
    }
  } catch (error) {
    console.error('Failed to fetch latest message:', error)
  }
}

// Define the real shape of a calendar event, instead of letting TS guess "never"
interface CalendarEvent {
  title: string
  start: Date
  end: Date
  description: string
  color: string
  eventType: string
}

// Maps NocoDB's "Color" single-select label to an actual hex value.
// Add/remove entries here to match whatever options exist in NocoDB --
// this is the ONE place that needs updating if the palette changes.
const COLOR_MAP: Record<string, string> = {
  Blue: '#0B4F6C',
  Red: '#C0392B',
  Green: '#1E8449',
  Gold: '#B7950B',
  Purple: '#6C3483'
}
const DEFAULT_EVENT_COLOR = '#0B4F6C'



// Maps NocoDB's "Priority" single-select label to an actual hex value.
// Copy these directly from NocoDB: edit the Priority field, click each
// option's color swatch, and grab the hex it shows. This is the ONE
// place that needs updating if you change a priority's color later.
const PRIORITY_COLOR_MAP: Record<string, string> = {
  High: '#FF4A3F',
  Medium: '#B7950B',
  Normal: '#D0F1FD'
}


const userName = computed(() => authState.name || 'Donator')



// Announcements — populated from NocoDB on mount
const announcements = ref<Array<{ id: number; title: string; date: string; content: string }>>([])

const fetchAnnouncements = async () => {
  try {
    const rows = await apiService.fetchAnnouncements()
    announcements.value = (rows || []).map((row: any) => ({
      id: row.Id,
      title: row['Title'],
      date: row['Created At']
        ? new Date(row['Created At']).toLocaleString([], {
            dateStyle: 'short',
            timeStyle: 'short'
          })
        : '',
      content: row['Body'],
      priority: row['Priority'] || null
    }))
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
  }
}



// Calendar API
const publicCalendar = ref<CalendarEvent[]>([])
const calendarValue = ref<Date>(new Date())
const calendarRef = ref<any>(null)

const detailsDialog = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const currentMonthTitle = computed(() => {
  const date = calendarValue.value
  if (!date) return ''
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const fetchCalendarData = async () => {
  try {
    const rawEvents = await apiService.fetchCalendar()
    publicCalendar.value = (rawEvents || []).map((row: any) => ({
      title: row['Title'],
      start: new Date(row['Event Date Start']),
      end: new Date(row['Event Date End']),
      description: row['Description'] || 'No additional details provided.',
      color: COLOR_MAP[row['Color']] || DEFAULT_EVENT_COLOR,
      eventType: row['Event Type'] || ''
    }))
  } catch (error) {
    console.error('Failed to sync calendar:', error)
  }
}

const handleEventClick = (payload: { event: CalendarEvent }) => {
  selectedEvent.value = payload.event
  detailsDialog.value = true
}

onMounted(() => {
  fetchAnnouncements()
  fetchCalendarData()
  fetchLatestMessage()
})
</script>

<style scoped>
.max-w-3xl {
  max-width: 48rem;
}

.elevation-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.06) !important;
}

.leading-none {
  line-height: 1.15 !important;
}

.z-index-content {
  z-index: 2;
}

.elevation-hover {
  transform-style: preserve-3d;
}

@media (min-width: 1200px) {
  .corner-dragon {
    position: absolute;
    top: 20px;
    right: 25px;
    width: 180px;
    height: auto;
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    backface-visibility: hidden;
    transform: translate(0, 20px) scale(0.85);
    transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease-out;
  }

  .foreground-cover {
    position: absolute;
    top: 45px;
    right: 30px;
    width: 180px;
    height: auto;
    z-index: 5;
    pointer-events: none;
  }

  .v-card:hover .corner-dragon {
    opacity: 1;
    transform: translate(45px, -65px) scale(1) rotate(-12deg);
  }
}

@media (max-width: 1199px) {
  .corner-dragon,
  .foreground-cover {
    display: none !important;
  }
}

.custom-calendar-theme {
  min-height: 650px !important;
  font-family: 'Inter', sans-serif !important;
}

:deep(.custom-calendar-theme .v-calendar-month__week),
:deep(.custom-calendar-theme .v-calendar-month__weeks__week) {
  min-height: 110px !important;
  height: 110px !important;
}

:deep(.custom-calendar-theme .v-calendar-month__header),
:deep(.custom-calendar-theme .v-calendar-weekly__head) {
  border-bottom: 2px solid #EAEAEA !important;
  background-color: #FAFAFA !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

.custom-event-pill {
  border-radius: 6px !important;
  height: 28px !important;
  box-shadow: 0px 2px 6px rgba(11, 79, 108, 0.12) !important;
  cursor: pointer !important;
  transition: all 0.2s ease-in-out !important;
  width: 100% !important;
  display: flex !important;
  align-center: true;
}

.custom-event-pill span {
  font-size: 0.8rem !important;
  line-height: 1.2 !important;
  font-weight: 600 !important;
  display: inline-block;
}
</style>

