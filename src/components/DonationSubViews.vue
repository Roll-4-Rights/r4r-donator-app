<template>
  <v-window v-model="localActiveTab">
    <!-- TAB 1: FORM -->
    <v-window-item value="submit">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="pa-6 rounded-xl bg-grey-lighten-5" variant="flat">
            <h3 class="text-h5 font-weight-bold mb-6 text-center text-grey-darken-4">Donate Item</h3>
            <v-form @submit.prevent="submitForm">
              <label class="form-label">Item Name *</label>
              <v-text-field v-model="form.name" variant="solo" flat class="mb-2 bg-white rounded-lg" hide-details></v-text-field>

              <label class="form-label mt-3">Item description *</label>
              <v-textarea v-model="form.description" variant="solo" flat rows="4" class="mb-2 bg-white rounded-lg" hide-details></v-textarea>

              <label class="form-label mt-3">Category *</label>
              <v-select v-model="form.category" :items="['Dice & Gaming', 'Electronics', 'Clothing']" variant="solo" flat class="mb-2 bg-white rounded-lg" hide-details></v-select>

              <label class="form-label mt-3">Recommended price * <v-icon size="small" icon="mdi-information-outline"></v-icon></label>
              <v-text-field v-model="form.recPrice" type="number" prefix="$" variant="solo" flat class="mb-2 bg-white rounded-lg" hide-details></v-text-field>

              <label class="form-label mt-3">Starting bid price * <v-icon size="small" icon="mdi-information-outline"></v-icon></label>
              <v-text-field v-model="form.startPrice" type="number" prefix="$" variant="solo" flat class="mb-4 bg-white rounded-lg" hide-details></v-text-field>

              <label class="form-label">Photos *</label>
              <v-card variant="dashed" class="pa-6 text-center bg-grey-lighten-4 rounded-lg cursor-pointer mb-6" @click="$refs.fileInput.click()">
                <v-icon size="large" icon="mdi-upload" class="mb-2"></v-icon>
                <div class="text-body-2 font-weight-medium">Upload</div>
                <div class="text-caption mt-1" style="font-style: italic;">please upload 1-6 photos</div>
                <input type="file" ref="fileInput" multiple accept="image/*" class="d-none">
              </v-card>

              <v-btn type="submit" block size="large" flat color="#0A3C46" class="text-white text-capitalize rounded-lg font-weight-bold">Submit Donation</v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-window-item>
         
    <!-- TAB 2: MY DONATIONS -->
    <v-window-item value="list">
      <v-card variant="flat" class="pa-6 rounded-xl border">
        <div class="d-flex justify-space-between align-center mb-6">
          <h3 class="text-h6 font-weight-bold" style="color: #0A3C46;">Your Donation Submissions</h3>
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search..." variant="solo" flat density="compact" style="max-width: 250px;" class="bg-grey-lighten-4 rounded-lg" hide-details></v-text-field>
        </div>
        <v-table>
          <thead>
            <tr>
              <th>Item Details</th>
              <th>Category</th>
              <th class="text-center">Status</th>
              <th class="text-right">Bidding Start</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredDonations" :key="item.id">
              <td><div class="font-weight-bold">{{ item.name }}</div></td>
              <td>{{ item.category }}</td>
              <td class="text-center">
                <v-chip :color="item.status === 'accepted' ? 'success' : 'warning'" size="small" class="font-weight-bold text-capitalize">
                  {{ item.status.replace('_', ' ') }}
                </v-chip>
              </td>
              <td class="text-right font-weight-medium">${{ item.startingPrice }}</td>
              <td class="text-right">
                <v-btn size="small" variant="text" color="#0A3C46" class="font-weight-bold" :disabled="item.status === 'accepted'">Edit</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-window-item>

    <!-- TAB 3: SHIPPING -->
    <v-window-item value="shipping">
      <v-card variant="flat" class="pa-4 bg-transparent">
        <div class="mb-4">
          <h3 class="text-h6 font-weight-bold mb-1">Here is where you will find the winner contact information for your items, please add tracking</h3>
          <p class="text-caption text-grey-darken-2 font-weight-light">The winner information will be displayed once we receive it. Please click "add tracking" to add a tracking number once you have shipped the item.</p>
        </div>
        <div class="d-flex ga-2 mb-6">
          <v-btn variant="outlined" class="text-capitalize rounded-lg bg-grey-lighten-4" append-icon="mdi-chevron-down">Auction status</v-btn>
          <v-btn variant="outlined" class="text-capitalize rounded-lg bg-grey-lighten-4" append-icon="mdi-chevron-down">Shipping Status</v-btn>
        </div>
        
        <v-table class="border rounded-xl bg-white overflow-hidden">
          <thead>
            <tr>
              <th><v-icon icon="mdi-image-outline" size="small"></v-icon> Photos</th>
              <th>Item...</th>
              <th>Winner Information</th>
              <th>Tracking</th>
              <th>Shipping Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="winner in itemWinners" :key="winner.id">
              <td class="py-3">
                <v-img :src="winner.photo" width="90" height="70" cover class="rounded bg-grey-lighten-2"></v-img>
              </td>
              <td class="font-weight-bold">{{ winner.itemName }}</td>
              <td style="white-space: pre-line;" class="text-body-2 py-3">{{ winner.contactDetails }}</td>
              <td class="text-body-2 font-mono text-grey-darken-3">
                {{ winner.trackingNumber || '— No Tracking Added —' }}
              </td>
              <td>
                <v-chip color="teal-darken-3" class="text-white text-caption px-4" variant="flat" style="background-color: #1E7E63 !important;">
                  {{ winner.statusText }}
                </v-chip>
              </td>
              <td class="text-right">
                <v-btn 
                  size="small" 
                  variant="outlined" 
                  color="#0A3C46" 
                  class="font-weight-bold text-capitalize rounded-lg"
                  @click="openTrackingModal(winner)"
                >
                  <v-icon start icon="mdi-plus" size="small"></v-icon>
                  Add Tracking
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-window-item>
  </v-window>

  <!-- MODAL POPUP -->
  <v-dialog v-model="trackingDialog" max-width="500px" persistent>
    <v-card class="rounded-xl pa-4">
      <v-card-title class="text-h6 font-weight-bold text-grey-darken-4 pb-0">
        Update Tracking Information
      </v-card-title>
      <v-card-text class="pt-2">
        <p class="text-body-2 text-grey-darken-1 mb-4">
          Add or update tracking details for <strong>{{ selectedWinner?.itemName }}</strong>.
        </p>
        <label class="form-label mb-1">Tracking Number</label>
        <v-text-field
          v-model="trackingInput"
          placeholder="Enter tracking number"
          variant="outlined"
          density="comfortable"
          flat
          hide-details
          class="bg-grey-lighten-5 rounded-lg"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="justify-end g-2 pt-2 px-6 pb-2">
        <v-btn variant="text" class="text-capitalize rounded-lg font-weight-bold" color="grey-darken-1" @click="closeTrackingModal">
          Cancel
        </v-btn>
        <v-btn variant="flat" class="text-white text-capitalize rounded-lg font-weight-bold px-4" color="#0A3C46" @click="saveTrackingInfo">
          Save Details
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({ activeTab: String })
const emit = defineEmits(['update:activeTab'])

const localActiveTab = ref(props.activeTab)
watch(() => props.activeTab, (newVal) => localActiveTab.value = newVal)
watch(localActiveTab, (newVal) => emit('update:activeTab', newVal))

const search = ref('')
const form = ref({ name: '', description: '', category: null, recPrice: null, startPrice: null })

const userDonations = ref([
  { id: 1, name: 'Vintage Leather Jacket', category: 'Clothing & Apparel', startingPrice: 50, status: 'accepted' },
  { id: 2, name: 'Mechanical Gaming Keyboard', category: 'Electronics', startingPrice: 30, status: 'needs_review' }
])

const itemWinners = ref([
  { 
    id: 401, 
    photo: 'https://placehold.co', 
    itemName: 'Stardust(1)', 
    contactDetails: 'John Doe\n123 Street Rd\nCity, ST 12345', 
    trackingNumber: '254245234523452345', 
    statusText: 'Tracking sent to Winner...' 
  }
])

// Modal Setup
const trackingDialog = ref(false)
const trackingInput = ref('')
const selectedWinner = ref(null)

const openTrackingModal = (winner) => {
  selectedWinner.value = winner
  trackingInput.value = winner.trackingNumber || ''
  trackingDialog.value = true
}

const closeTrackingModal = () => {
  trackingDialog.value = false
  selectedWinner.value = null
  trackingInput.value = ''
}

const saveTrackingInfo = () => {
  if (selectedWinner.value) {
    selectedWinner.value.trackingNumber = trackingInput.value
    console.log(`Saved tracking for ${selectedWinner.value.itemName}:`, trackingInput.value)
    closeTrackingModal()
  }
}

const filteredDonations = computed(() => {
  if (!search.value) return userDonations.value
  return userDonations.value.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()))
})

const submitForm = () => console.log('Saving form entry setup data:', form.value)
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
