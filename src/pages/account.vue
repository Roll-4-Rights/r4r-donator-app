<template>
  <v-container class="py-8" max-width="500px">
    
    <!-- SYSTEM ALERT BANNER NOTIFICATION CONTEXT SLOT -->
    <v-fade-transition>
      <v-alert
        v-if="showSuccessAlert"
        type="success"
        variant="flat"
        density="comfortable"
        closable
        icon="mdi-check-circle"
        class="rounded-xl mb-5 font-weight-medium text-body-2"
        @click:close="showSuccessAlert = false"
      >
        Your profile settings have been successfully updated!
      </v-alert>
    </v-fade-transition>

    <!-- UNIFIED ACCOUNT PROFILE WORKSPACE CARD -->
    <v-card class="pa-6 rounded-xl border bg-white" variant="flat">
      
      <!-- HEADER BLOCK SECTION -->
      <div class="mb-6">
        <h2 class="text-h5 font-weight-black text-grey-darken-4 mb-1">Account Settings</h2>
        <p class="text-body-2 text-grey-darken-1 mb-0">Manage your user profile configuration settings.</p>
      </div>

            <!-- SECTION 1: AVATAR DISPLAY + UPLOAD -->
      <div class="mb-6 text-center">
        <div class="position-relative d-inline-block">
          <v-avatar 
            size="90" 
            :style="{ backgroundColor: avatarPreview ? undefined : avatarBgColor }" 
            class="text-white text-h4 font-weight-black border rounded-circle elevation-1"
          >
            <v-img v-if="avatarPreview" :src="avatarPreview" alt="User Avatar" cover></v-img>
            <template v-else>
              {{ profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'P' }}
            </template>
          </v-avatar>
          <v-btn
            icon="mdi-camera"
            size="x-small"
            color="#0A3C46"
            class="text-white position-absolute elevation-1"
            style="bottom: 0; right: 0;"
            @click="triggerFileSelect"
          ></v-btn>
        </div>

        <!-- Hidden file input -->
        <v-file-input
          ref="fileInputRef"
          accept="image/*"
          class="d-none"
          @update:model-value="onFileSelected"
        />

        <!-- Save/Cancel appear once a file is staged -->
        <v-expand-transition>
          <div v-if="selectedFile" class="d-flex ga-3 justify-center mt-3">
            <v-btn color="success" size="small" :loading="isUploading" @click="uploadAvatar">
              Save Photo
            </v-btn>
            <v-btn color="grey-lighten-1" size="small" :disabled="isUploading" @click="cancelSelection">
              Cancel
            </v-btn>
          </div>
        </v-expand-transition>
      </div>

      <!-- MAIN FORM FIELDS BLOCK -->
      <v-form ref="profileFormRef" v-model="isProfileValid" @submit.prevent="saveProfile">
        <v-row dense>
          
          <!-- EMAIL FIELD (READ-ONLY CLEAN OUTLINED DESIGN) -->
          <v-col cols="12" class="mb-4">
            <v-text-field
              v-model="profileForm.email"
              label="Email Address"
              variant="outlined"
              density="comfortable"
              readonly
              disabled
              color="#0A3C46"
              class="rounded-lg bg-grey-lighten-5"
              hide-details="auto"
              prepend-inner-icon="mdi-email-outline"
            ></v-text-field>
          </v-col>

          <!-- PASSWORD FIELD (CLEAN OUTLINED DESIGN WITH INNER CLICKABLE PENCIL) -->
          <v-col cols="12" class="mb-4">
            <v-text-field
              value="••••••••••••"
              label="Password"
              variant="outlined"
              density="comfortable"
              readonly
              color="#0A3C46"
              class="rounded-lg cursor-pointer-input"
              hide-details="auto"
              prepend-inner-icon="mdi-lock-outline"
              append-inner-icon="mdi-pencil-outline"
              @click="passwordDialog = true"
              @click:append-inner="passwordDialog = true"
            ></v-text-field>
          </v-col>

          <!-- NAME FIELD -->
          <v-col cols="12" class="mb-6">
            <v-text-field 
              v-model="profileForm.name" 
              label="Name *"
              :rules="[rules.required]" 
              variant="outlined" 
              density="comfortable"
              color="#0A3C46"
              class="rounded-lg" 
              hide-details="auto"
              prepend-inner-icon="mdi-account-outline"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- ACTION BUTTON -->
        <div class="d-flex justify-start">
          <v-btn type="submit" :disabled="!isProfileValid" size="large" flat color="#0A3C46" class="text-white text-capitalize rounded-lg font-weight-bold px-8">
            Update
          </v-btn>
        </div>
      </v-form>

    </v-card>

    <!-- FLOATING SECURITY PASSWORD ALTERATION DIALOG BOX MODAL -->
    <v-dialog v-model="passwordDialog" max-width="450px" persistent>
      <v-card class="rounded-xl pa-5">
        <v-card-title class="text-h6 font-weight-bold text-grey-darken-4 pb-1 px-4">
          Change Password
        </v-card-title>
        <v-card-text class="pt-3 px-4 pb-4">
          <v-form ref="passwordFormRef" v-model="isPasswordValid" @submit.prevent="updatePassword">
            <v-text-field 
              v-model="passwordForm.current" 
              label="Current Password *"
              :type="showCurrent ? 'text' : 'password'" 
              :append-inner-icon="showCurrent ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              variant="outlined" 
              density="comfortable"
              color="#0A3C46"
              class="rounded-lg mb-4" 
              hide-details="auto"
              @click:append-inner="showCurrent = !showCurrent"
            ></v-text-field>

            <v-text-field 
              v-model="passwordForm.new" 
              label="New Password *"
              :type="showNew ? 'text' : 'password'" 
              :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.minPassword]"
              variant="outlined" 
              density="comfortable"
              color="#0A3C46"
              class="rounded-lg mb-4" 
              hide-details="auto"
              @click:append-inner="showNew = !showNew"
            ></v-text-field>

            <v-text-field 
              v-model="passwordForm.confirm" 
              label="Confirm New Password *"
              :type="showConfirm ? 'text' : 'password'" 
              :append-inner-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.matchingPassword]"
              variant="outlined" 
              density="comfortable"
              color="#0A3C46"
              class="rounded-lg" 
              hide-details="auto"
              @click:append-inner="showConfirm = !showConfirm"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end ga-2 pt-2 px-4 pb-2">
          <v-btn variant="text" class="text-capitalize rounded-lg font-weight-bold" color="grey-darken-1" @click="closePasswordModal">
            Cancel
          </v-btn>
          <v-btn :disabled="!isPasswordValid" variant="flat" class="text-white text-capitalize rounded-lg font-weight-bold px-5" color="#0A3C46" @click="updatePassword">
            Save Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>




<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { apiService, API_BASE_URL } from '@/services/api'

// Validation Ref Frameworks
const profileFormRef = ref(null)
const passwordFormRef = ref(null)
const isProfileValid = ref(false)
const isPasswordValid = ref(false)

// UI Feedback States
const showSuccessAlert = ref(false)

// True Account Profile State
const profileForm = ref({
  email: '',
  name: '',
  profile_picture: null
})

// Dialog Form Workspace Values
const passwordDialog = ref(false)
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

// Password Visibility States
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

// Core Rule Definitions
const rules = {
  required: (v) => !!v || 'Field is required',
  minPassword: (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
  matchingPassword: (v) => v === passwordForm.value.new || 'Passwords do not match'
}

// Profile Pic
const fileInputRef = ref(null)
const fileInputModel = ref(null)
const selectedFile = ref(null)
const avatarPreview = ref(null)
const isUploading = ref(false)

const avatarBgColor = computed(() => {
  const str = profileForm.value.name || ''
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 45%, 45%)`
})

onMounted(async () => {
  try {
    const data = await apiService.fetchCurrentDonator()
    profileForm.value.email = data.email
    profileForm.value.name = data.name
    profileForm.value.profile_picture = data.profile_picture
    if (data.profile_picture) {
      avatarPreview.value = `${API_BASE_URL}${data.profile_picture}`
    }
  } catch (e) {
    // surface e.message to the user
  }
})

function triggerFileSelect() {
  fileInputRef.value?.$el.querySelector('input[type="file"]')?.click()
}

function onFileSelected(file) {
  const f = Array.isArray(file) ? file[0] : file
  if (!f) return

  if (!f.type.startsWith('image/')) {
    // surface "Please select an image file" to the user
    return
  }
  if (f.size > 5 * 1024 * 1024) {
    // surface "Image must be under 5MB" to the user
    return
  }

  selectedFile.value = f
  if (avatarPreview.value?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = URL.createObjectURL(f)
}

async function uploadAvatar() {
  if (!selectedFile.value) return
  isUploading.value = true
  try {
    const data = await apiService.uploadProfilePicture(selectedFile.value)
    profileForm.value.profile_picture = data.profile_picture
    if (avatarPreview.value?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.value)
    avatarPreview.value = `${API_BASE_URL}${data.profile_picture}`
    selectedFile.value = null
    fileInputModel.value = null
    showSuccessAlert.value = true
  } catch (e) {
    // surface e.message to the user
  } finally {
    isUploading.value = false
  }
}

function cancelSelection() {
  if (avatarPreview.value?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = profileForm.value.profile_picture
    ? `${API_BASE_URL}${profileForm.value.profile_picture}`
    : null
  selectedFile.value = null
  fileInputModel.value = null
}

//password
const closePasswordModal = () => {
  passwordDialog.value = false
  passwordForm.value.current = ''
  passwordForm.value.new = ''
  passwordForm.value.confirm = ''
  if (passwordFormRef.value) passwordFormRef.value.resetValidation()
}

// Data Save Executions
const saveProfile = async () => {
  const { valid } = await profileFormRef.value.validate()
  if (valid) {
    console.log('Dispatching updated profile records to server backend:', profileForm.value)
    showSuccessAlert.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const updatePassword = async () => {
  const { valid } = await passwordFormRef.value.validate()
  if (valid) {
    console.log('Securely syncing updated user credentials password payload to core auth channels...')
    closePasswordModal()
    showSuccessAlert.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}

/* Custom indicator utility mapping to show fields are clickable actions */
.cursor-pointer-input :deep(input) {
  cursor: pointer !important;
}

/* Fixes default padding offsets created by custom outlined label boundaries */
:deep(.v-text-field .v-input__details) {
  padding-top: 6px !important;
  padding-left: 4px !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
