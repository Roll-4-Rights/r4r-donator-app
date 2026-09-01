<template>
  <v-container class="donate-page pa-6 mx-auto" style="max-width: 1200px;">

    <!-- PAGE HEADER -->
    <div class="page-head mb-8">
      <span class="eyebrow">Auction Donation Desk</span>
      <h1 class="page-title">Donate an Item</h1>
      <p class="page-sub">Submit items, manage your donations, and view winner info.</p>
    </div>

    <!-- SUBMISSION GUIDELINES INFO DRAWER -->
    <v-expansion-panels class="guidelines mb-8" variant="accordion">
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="guidelines-title">Submission guidelines</v-expansion-panel-title>
        <v-expansion-panel-text class="guidelines-text">
          some instructions here blah blah blah.
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- LIVE DYNAMIC STATUS LEDGER STRIP -->
    <div class="ledger-strip mb-10">
      <div class="ledger-item">
        <div class="ledger-value">{{ stats.submitted }}</div>
        <div class="ledger-label">Items submitted</div>
      </div>
      <div class="ledger-divider"></div>
      <div class="ledger-item">
        <div class="ledger-value accent-brass">{{ stats.accepted }}</div>
        <div class="ledger-label">Items accepted</div>
      </div>
      <div class="ledger-divider"></div>
      <div class="ledger-item">
        <div class="ledger-value accent-amber">{{ stats.needsReview }}</div>
        <div class="ledger-label">Needs review</div>
      </div>
    </div>

    <!-- MASTER WORKSPACE TABS NAVIGATION CONTROL BAR -->
    <v-tabs v-model="activeTab" color="#0A3C46" align-tabs="start" class="ledger-tabs mb-8">
      <v-tab value="submit">Submit a Donation</v-tab>
      <v-tab value="list">My Donations</v-tab>
      <v-tab value="shipping">Winner and Shipping Info</v-tab>
    </v-tabs>

    <!-- APPLICATION INTERFACE CONTAINER VIEWS WINDOWS -->
    <v-window v-model="activeTab">

      <!-- TAB 1: NEW ENTRY DONATION SUBMISSION FORM SECTION -->
      <v-window-item value="submit">
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-card class="form-card pa-8" variant="flat">
              <h2 class="form-title mb-6">Item details</h2>

              <v-fade-transition>
                <v-alert v-if="showNotificationToast" type="success" variant="tonal" closable class="mb-6" @click:close="showNotificationToast = false">
                  Your donation was submitted successfully.
                </v-alert>
              </v-fade-transition>

              <v-form @submit.prevent="submitForm">
                <label class="field-label">Item name *</label>
                <v-text-field v-model="form.name" variant="outlined" density="comfortable" class="mb-5" hide-details></v-text-field>

                <label class="field-label">Donator name *</label>
                <v-text-field v-model="form.donatorName" variant="outlined" density="comfortable" class="mb-5" hide-details></v-text-field>

                <label class="field-label">Item description *</label>
                <v-textarea v-model="form.description" variant="outlined" density="comfortable" rows="4" class="mb-5" hide-details></v-textarea>

                <label class="field-label">Category *</label>
                <v-select v-model="form.category" :items="categoryOptions" variant="outlined" density="comfortable" class="mb-5" hide-details></v-select>

                <div class="price-row mb-6">
                  <div class="price-field">
                    <label class="field-label">Recommended price *</label>
                    <v-text-field v-model="form.recPrice" prefix="$" variant="outlined" density="comfortable" class="mono-input" hide-details></v-text-field>
                  </div>
                  <div class="price-field">
                    <label class="field-label">Starting bid price *</label>
                    <v-text-field v-model="form.startPrice" prefix="$" variant="outlined" density="comfortable" class="mono-input" hide-details></v-text-field>
                  </div>
                </div>

                <!-- PHOTO UPLOAD — this form's own state, NOT the edit modal's -->
                <label class="field-label">Photos</label>
                <div class="edit-photo-grid mb-3">
                  <div v-for="(photo, index) in selectedPhotos" :key="'new-submit-' + index" class="edit-photo-thumb">
                    <img :src="photoPreviewUrl(photo)" alt="Selected photo">
                    <v-btn icon="mdi-close" size="x-small" density="comfortable" class="edit-photo-remove" @click="removeSelectedPhoto(index)"></v-btn>
                  </div>
                </div>
                <div class="dropzone dropzone-compact mb-2" @click="fileInput.click()" v-if="selectedPhotos.length < 6">
                  <v-icon size="20" icon="mdi-tray-arrow-up" class="mb-1"></v-icon>
                  <div class="dropzone-text">Add photos</div>
                  <input type="file" ref="fileInput" multiple accept="image/*" class="d-none" @change="handlePhotoSelection">
                </div>
                <div class="dropzone-hint mb-4">{{ selectedPhotos.length }}/6 photos</div>

                <v-btn type="submit" block size="large" flat color="#0A3C46" class="submit-btn" :loading="isSubmitting">
                  Submit donation
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- TAB 2: MY DONATIONS SPREADSHEET TABLE GRID LIST -->
      <v-window-item value="list">
        <v-card variant="flat" class="ledger-card pa-8">
          <div class="d-flex justify-space-between align-center flex-wrap ga-4 mb-6">
            <h2 class="ledger-heading">Your donation submissions</h2>
            <div class="d-flex align-center ga-3" style="width: 100%; max-width: 360px;">
              <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Search donations" variant="outlined" density="compact" hide-details></v-text-field>
              <v-btn icon="mdi-refresh" variant="outlined" color="#0A3C46" density="comfortable" @click="loadDashboardData" :loading="isLoadingTables"></v-btn>
            </div>
          </div>

          <table class="ledger-table">
            <thead>
              <tr>
                <th class="col-lot">Lot</th>
                <th>Item</th>
                <th>Category</th>
                <th class="text-center">Status</th>
                <th class="text-right">Starting bid</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingTables">
                <td colspan="6" class="text-center py-8">
                  <v-progress-circular indeterminate size="20" width="2" color="#0A3C46" class="mr-2"></v-progress-circular>
                  Loading donations…
                </td>
              </tr>
              <tr v-else-if="filteredDonations.length === 0">
                <td colspan="6" class="text-center py-8 empty-text">No donations submitted yet.</td>
              </tr>
              <tr v-else v-for="(item, index) in filteredDonations" :key="item.Id">
                <td class="col-lot mono">№{{ pad3(index + 1) }}</td>
                <td>
                  <div class="item-name">{{ item['Item Name'] }}</div>
                  <div class="item-donator">by {{ item['Donator'] || 'Anonymous' }}</div>
                </td>
                <td>{{ item['Category'] || 'Unassigned' }}</td>
                <td class="text-center">
                  <v-chip :class="item['Item Status'] === 'Accepted' ? 'chip-accepted' : 'chip-pending'" size="small" variant="flat">
                    {{ item['Item Status'] || 'Submitted' }}
                  </v-chip>
                </td>
                <td class="text-right mono">${{ item['Starting Bid Price'] || 0 }}</td>
                <td class="text-right">
                  <v-btn size="small" variant="text" color="#0A3C46" class="edit-btn" :disabled="item['Item Status'] === 'Accepted'" @click="openEditModal(item)">Edit</v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-window-item>

      <!-- TAB 3: RESTORED WINNER SHIPPING WORKSPACE AREA GRID LAYOUT -->
      <v-window-item value="shipping">
        <v-card variant="flat" class="ledger-card pa-8">
          <div class="mb-6">
            <h2 class="ledger-heading mb-1">Winner and shipping info</h2>
            <p class="ledger-sub">Add a tracking number once you have shipped an item.</p>
          </div>

          <table class="ledger-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Winner information</th>
                <th>Tracking</th>
                <th>Shipping status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingTables">
                <td colspan="5" class="text-center py-8">Loading shipping data…</td>
              </tr>
              <tr v-else-if="acceptedDonations.length === 0">
                <td colspan="5" class="text-center py-8 empty-text">No winners ready for shipping.</td>
              </tr>
              <tr v-else v-for="winner in acceptedDonations" :key="winner.Id">
                <td class="item-name">{{ winner['Item Name'] }}</td>
                <td class="winner-info">{{ winner['Winner Information'] || 'Awaiting winner details' }}</td>
                <td class="mono tracking-cell">{{ winner['Tracking Number'] || 'No tracking yet' }}</td>
                <td>
                  <v-chip :class="winner['Tracking Number'] ? 'chip-accepted' : 'chip-pending'" size="small" variant="flat">
                    {{ winner['Tracking Number'] ? 'Shipped' : 'Awaiting tracking' }}
                  </v-chip>
                </td>
                <td class="text-right">
                  <v-btn size="small" variant="outlined" color="#0A3C46" class="edit-btn" @click="openTrackingModal(winner)">
                    <v-icon start :icon="winner['Tracking Number'] ? 'mdi-pencil-outline' : 'mdi-plus'" size="small"></v-icon>
                    {{ winner['Tracking Number'] ? 'Edit shipping' : 'Add tracking' }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- INTERACTIVE FLOATING POPUP OVERLAY MODAL FOR TRACKING MANAGEMENT -->
    <v-dialog v-model="trackingDialog" max-width="480px" persistent>
      <v-card class="dialog-card pa-2">
        <v-card-title class="dialog-title">Update tracking information</v-card-title>
        <v-card-text class="pt-2">
          <p class="dialog-copy mb-4">Add or update tracking details for <strong>{{ selectedWinner ? selectedWinner['Item Name'] : '' }}</strong>.</p>
          <label class="field-label">Tracking number</label>
          <v-text-field v-model="trackingInput" placeholder="Enter tracking number" variant="outlined" density="comfortable" hide-details></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end ga-2 pt-2 px-4 pb-4">
          <v-btn variant="text" color="grey-darken-1" @click="closeTrackingModal">Cancel</v-btn>
          <v-btn variant="flat" color="#0A3C46" class="submit-btn" :loading="isSavingTracking" @click="saveTrackingInfo">Save details</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ITEM EDIT DIALOG -->
    <v-dialog v-model="editDialog" max-width="560px" persistent>
      <v-card class="dialog-card pa-2">
        <v-card-title class="dialog-title">Edit donation</v-card-title>
        <v-card-text class="pt-2">
          <label class="field-label">Item name *</label>
          <v-text-field v-model="editForm.name" variant="outlined" density="comfortable" class="mb-5" hide-details></v-text-field>

          <label class="field-label">Donator name *</label>
          <v-text-field v-model="editForm.donatorName" variant="outlined" density="comfortable" class="mb-5" hide-details></v-text-field>

          <label class="field-label">Item description *</label>
          <v-textarea v-model="editForm.description" variant="outlined" density="comfortable" rows="3" class="mb-5" hide-details></v-textarea>

          <label class="field-label">Category *</label>
          <v-select v-model="editForm.category" :items="categoryOptions" variant="outlined" density="comfortable" class="mb-5" hide-details></v-select>

          <div class="price-row">
            <div class="price-field">
              <label class="field-label">Recommended price *</label>
              <v-text-field v-model="editForm.recPrice" prefix="$" variant="outlined" density="comfortable" class="mono-input" hide-details></v-text-field>
            </div>
            <div class="price-field">
              <label class="field-label">Starting bid price *</label>
              <v-text-field v-model="editForm.startPrice" prefix="$" variant="outlined" density="comfortable" class="mono-input" hide-details></v-text-field>
            </div>
          </div>

          <!-- PHOTO MANAGEMENT: existing + newly added photos -->
          <label class="field-label">Photos</label>
          <div class="edit-photo-grid mb-3">
            <div v-for="(photo, index) in existingPhotos" :key="'existing-' + index" class="edit-photo-thumb">
              <img :src="photo.url || photo.signedUrl" :alt="photo.title || 'Photo'">
              <v-btn icon="mdi-close" size="x-small" density="comfortable" class="edit-photo-remove" @click="removeExistingPhoto(index)"></v-btn>
            </div>
            <div v-for="(photo, index) in newEditPhotos" :key="'new-' + index" class="edit-photo-thumb">
              <img :src="photoPreviewUrl(photo)" alt="New photo">
              <v-btn icon="mdi-close" size="x-small" density="comfortable" class="edit-photo-remove" @click="removeNewPhoto(index)"></v-btn>
            </div>
          </div>
          <div class="dropzone dropzone-compact mb-2" @click="$refs.editFileInput.click()" v-if="totalEditPhotoCount < 6">
            <v-icon size="20" icon="mdi-tray-arrow-up" class="mb-1"></v-icon>
            <div class="dropzone-text">Add photos</div>
            <input type="file" ref="editFileInput" multiple accept="image/*" class="d-none" @change="handleEditPhotoSelection">
          </div>
          <div class="dropzone-hint mb-4">{{ totalEditPhotoCount }}/6 photos</div>
        </v-card-text>
        <v-card-actions class="justify-end ga-2 pt-2 px-4 pb-4">
          <v-btn variant="text" color="grey-darken-1" @click="closeEditModal">Cancel</v-btn>
          <v-btn variant="flat" color="#0A3C46" class="submit-btn" :loading="isSavingEdit" @click="saveEditInfo">Save changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.donate-page {
  --ink: #0A3C46;
  --ink-deep: #062830;
  --ink-soft: rgba(10, 60, 70, 0.62);
  --paper: #F5F7F6;
  --paper-warm: #EFF4F2;
  --brass: #A9824C;
  --amber: #BD8A3D;
  --line: rgba(10, 60, 70, 0.14);
}

/* Header */
.eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 0.5rem;
}
.page-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--ink-deep);
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}
.page-sub {
  font-size: 0.95rem;
  color: var(--ink-soft);
  max-width: 46ch;
  margin: 0;
}

/* Guidelines */
.guidelines :deep(.v-expansion-panel) {
  background: transparent;
  border-bottom: 1px solid var(--line);
}
.guidelines-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--ink-deep);
  padding: 0 !important;
  min-height: 44px;
}
.guidelines-text {
  padding: 0 0 1rem !important;
  font-size: 0.875rem;
  color: var(--ink-soft);
}

/* Ledger stat strip */
.ledger-strip {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
  overflow: hidden;
}
.ledger-item {
  flex: 1;
  padding: 1.5rem 1rem;
  text-align: center;
}
.ledger-divider {
  width: 1px;
  background: var(--line);
}
.ledger-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--ink-deep);
  line-height: 1;
}
.ledger-value.accent-brass { color: var(--brass); }
.ledger-value.accent-amber { color: var(--amber); }
.ledger-label {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

/* Tabs */
.ledger-tabs { border-bottom: 1px solid var(--line); }
.ledger-tabs :deep(.v-tab) {
  text-transform: uppercase;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  min-width: unset;
  height: 52px;
  padding: 0 1.25rem;
  margin-right: 0.5rem;
}
.ledger-tabs :deep(.v-tab--selected) { color: var(--ink-deep); }

/* Form card */
.form-card {
  background: var(--paper-warm);
  border-radius: 18px;
  border: 1px solid var(--line);
  padding: 2rem !important;
}
.form-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--ink-deep);
}
.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 0.4rem;
}
.price-row {
  display: flex;
  gap: 1rem;
}
.price-field { flex: 1; }
.mono-input :deep(input) {
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
}
.dropzone {
  border: 1.5px dashed var(--ink);
  border-radius: 14px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  color: var(--ink);
  background: rgba(10, 60, 70, 0.03);
  transition: background 0.15s ease;
}
.dropzone:hover { background: rgba(10, 60, 70, 0.06); }
.dropzone-text { font-size: 0.9rem; font-weight: 600; margin-top: 0.25rem; }
.dropzone-hint { font-size: 0.75rem; color: var(--ink-soft); margin-top: 0.25rem; font-style: italic; }
.submit-btn {
  color: #fff !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-radius: 10px;
}

/* Ledger card / table */
.ledger-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 2rem !important;
}
.ledger-heading { font-size: 1.1rem; font-weight: 800; color: var(--ink-deep); }
.ledger-sub { font-size: 0.85rem; color: var(--ink-soft); margin: 0; }

.ledger-table { width: 100%; border-collapse: collapse; }
.ledger-table thead th {
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
  border-bottom: 1px solid var(--line);
  padding: 0.75rem;
}
.ledger-table tbody td {
  padding: 0.9rem 0.75rem;
  border-bottom: 1px solid var(--line);
  font-size: 0.9rem;
  color: var(--ink-deep);
}
.ledger-table tbody tr:last-child td { border-bottom: none; }
.ledger-table tbody tr:hover { background: rgba(10, 60, 70, 0.025); }
.col-lot { width: 70px; color: var(--ink-soft); }
.mono { font-family: 'Roboto Mono', monospace; font-weight: 700; }
.item-name { font-weight: 700; color: var(--ink-deep); }
.item-donator { font-size: 0.75rem; color: var(--ink-soft); margin-top: 2px; }
.empty-text { color: var(--ink-soft); font-size: 0.9rem; }
.winner-info { white-space: pre-line; font-size: 0.85rem; }
.tracking-cell { letter-spacing: 0.03em; }
.edit-btn { text-transform: none; font-weight: 700; }

.chip-accepted { background: var(--brass) !important; color: #fff !important; font-weight: 700; letter-spacing: 0.02em; text-transform: capitalize; }
.chip-pending { background: rgba(189, 138, 61, 0.12) !important; color: var(--amber) !important; font-weight: 700; border: 1px solid rgba(189, 138, 61, 0.35); text-transform: capitalize; }

/* Dialog */
.dialog-card { border-radius: 18px; }
.dialog-title { font-size: 1.05rem; font-weight: 800; color: var(--ink-deep); }
.dialog-copy { font-size: 0.9rem; color: var(--ink-soft); }

@media (max-width: 600px) {
  .ledger-strip { flex-direction: column; }
  .ledger-divider { width: 100%; height: 1px; }
  .price-row { flex-direction: column; }
  .page-title { font-size: 1.75rem; }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api' // Unified REST data logic routing manager

// Tab & Navigation Controllers
const activeTab = ref('submit')
const search = ref('')
const isSubmitting = ref(false)
const isLoadingTables = ref(false)
const showNotificationToast = ref(false)

// Tracking Modal Controller States
const trackingDialog = ref(false)
const trackingInput = ref('')
const selectedWinner = ref(null)
const isSavingTracking = ref(false)

// Photo Memory Buffers
const fileInput = ref(null)
const selectedPhotos = ref([])

// Form State
const form = ref({
  name: '',
  donatorName: '',
  description: '',
  category: null,
  recPrice: null,
  startPrice: null
})

// Local records array downloaded from NocoDB
const userDonations = ref([])

// Formats a row index into a 3-digit lot number, e.g. 1 -> "001"
// const pad3 = (n) => String(n).padStart(3, '0')

// Shared category list for both the submit form and the edit dialog
const categoryOptions = ['Artwork & Photography', 'Books & Games', 'Custom Commissions', 'Dice', 'Home Goods', 'Tabletop Accessories', 'Wearables', 'Crafting Supplies', 'Live Event Tickets']

// Edit Modal Controller States
const editDialog = ref(false)
const selectedEditItem = ref(null)
const isSavingEdit = ref(false)
const editForm = ref({
  name: '',
  donatorName: '',
  description: '',
  category: null,
  recPrice: null,
  startPrice: null
})

// Edit Modal Photo States
const editFileInput = ref(null)
const existingPhotos = ref([])   // attachments already saved in NocoDB, kept unless removed
const newEditPhotos = ref([])    // brand-new File objects picked in this edit session

const totalEditPhotoCount = computed(() => existingPhotos.value.length + newEditPhotos.value.length)

const photoPreviewUrl = (file) => URL.createObjectURL(file)

const removeExistingPhoto = (index) => {
  existingPhotos.value.splice(index, 1)
}

const removeNewPhoto = (index) => {
  newEditPhotos.value.splice(index, 1)
}

const handleEditPhotoSelection = (event) => {
  const files = Array.from(event.target.files || [])
  const remainingSlots = 6 - totalEditPhotoCount.value
  newEditPhotos.value.push(...files.slice(0, Math.max(remainingSlots, 0)))
  event.target.value = '' // allow re-selecting the same file if removed and re-added
}

/**
 * Loads or refreshes data row items right out of your local NocoDB spreadsheet database
 */
const loadDashboardData = async () => {
  isLoadingTables.value = true
  try {
    const rawNocoRows = await apiService.fetchDonations()
    userDonations.value = rawNocoRows?.list || (Array.isArray(rawNocoRows) ? rawNocoRows : [])
  } catch (err) {
    console.error('Failed to sync frontend views with NocoDB records:', err)
  } finally {
    isLoadingTables.value = false
  }
}

/**
 * Handles raw media image buffer loading operations from user's hard drive
 */
const handlePhotoSelection = (event) => {
  const files = Array.from(event.target.files || [])
  const remainingSlots = 6 - selectedPhotos.value.length
  selectedPhotos.value.push(...files.slice(0, Math.max(remainingSlots, 0)))
  event.target.value = ''
}

const removeSelectedPhoto = (index) => {
  selectedPhotos.value.splice(index, 1)
}

/**
 * Bundles visual inputs into modern JSON data objects matching your exact NocoDB schema
 */
const submitForm = async () => {
  isSubmitting.value = true
  try {
    // 1. Fire file payload extraction out to api.js service handler
    const uploadedPhotos = await apiService.uploadPhotos(selectedPhotos.value)

    // 2. Package text data using your exact Spaceless Sentence Case columns
    await apiService.createDonation({
      "Item Name": form.value.name,
      "Donator": form.value.donatorName,
      "Item Description": form.value.description,
      "Category": form.value.category,
      "Recommended Price": Number(form.value.recPrice) || 0,
      "Starting Bid Price": Number(form.value.startPrice) || 0,
      "Photos": uploadedPhotos,
      "Submitted At": new Date().toISOString()
    })

    // 3. Clear local states on success
    showNotificationToast.value = true
    form.value = { name: '', donatorName: '', description: '', category: null, recPrice: null, startPrice: null }
    selectedPhotos.value = []

    await loadDashboardData()
  } catch (error) {
    console.error('Submission Bug Trace:', error)
    alert('Submission failed.')
  } finally {
    isSubmitting.value = false
  }
}

// Edit Modal Actions
const openEditModal = (item) => {
  selectedEditItem.value = item
  editForm.value = {
    name: item['Item Name'] || '',
    donatorName: item['Donator'] || '',
    description: item['Item Description'] || '',
    category: item['Category'] || null,
    recPrice: item['Recommended Price'] ?? null,
    startPrice: item['Starting Bid Price'] ?? null
  }
  existingPhotos.value = Array.isArray(item['Photos']) ? [...item['Photos']] : []
  newEditPhotos.value = []
  editDialog.value = true
}

const closeEditModal = () => {
  editDialog.value = false
  selectedEditItem.value = null
  existingPhotos.value = []
  newEditPhotos.value = []
}

const saveEditInfo = async () => {
  if (!selectedEditItem.value) return
  isSavingEdit.value = true
  try {
    // Upload any newly added photos, then merge with whatever existing photos weren't removed
    const uploadedNewPhotos = await apiService.uploadPhotos(newEditPhotos.value)
    const finalPhotos = [...existingPhotos.value, ...uploadedNewPhotos]

    await apiService.updateDonation(selectedEditItem.value.Id, {
      "Item Name": editForm.value.name,
      "Donator": editForm.value.donatorName,
      "Item Description": editForm.value.description,
      "Category": editForm.value.category,
      "Recommended Price": Number(editForm.value.recPrice) || 0,
      "Starting Bid Price": Number(editForm.value.startPrice) || 0,
      "Photos": finalPhotos
    })
    closeEditModal()
    await loadDashboardData()
  } catch (err) {
    console.error('Edit Save Bug Trace:', err)
    alert('Update failed.')
  } finally {
    isSavingEdit.value = false
  }
}

// Tracking Modal Actions
const openTrackingModal = (winner) => {
  selectedWinner.value = winner
  trackingInput.value = winner['Tracking Number'] || ''
  trackingDialog.value = true
}

const closeTrackingModal = () => {
  trackingDialog.value = false
  selectedWinner.value = null
  trackingInput.value = ''
}

const saveTrackingInfo = async () => {
  if (!selectedWinner.value) return
  isSavingTracking.value = true
  try {
    await apiService.updateDonation(selectedWinner.value.Id, {
      "Tracking Number": trackingInput.value
    })
    selectedWinner.value['Tracking Number'] = trackingInput.value
    closeTrackingModal()
    await loadDashboardData()
  } catch (err) {
    console.error('Tracking Save Bug Trace:', err)
    alert('Update failed.')
  } finally {
    isSavingTracking.value = false
  }
}

// Computed dashboard analytics — reads NocoDB's real "Auction Status" column
const stats = computed(() => ({
  submitted: userDonations.value.length,
  accepted: userDonations.value.filter(d => d['Item Status'] === 'Accepted').length,
  needsReview: userDonations.value.filter(d => d['Item Status'] === 'Submitted').length
}))

const acceptedDonations = computed(() => userDonations.value.filter(d => d['Item Status'] === 'Accepted'))

const filteredDonations = computed(() => {
  if (!search.value) return userDonations.value
  return userDonations.value.filter(item =>
    item['Item Name']?.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Automatically sync grid entries when the viewport mounts onto browser tabs
onMounted(() => { loadDashboardData() })
</script>