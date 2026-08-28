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

      <!-- SECTION 1: CHROMATIC INITIAL AVATAR DISPLAY -->
      <div class="mb-6 text-center">
        <div class="position-relative d-inline-block">
          <v-avatar 
            size="90" 
            :style="{ backgroundColor: avatarBgColor }" 
            class="text-white text-h4 font-weight-black border rounded-circle elevation-1"
          >
            {{ profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'P' }}
          </v-avatar>
          <v-btn
            icon="mdi-camera"
            size="x-small"
            color="#0A3C46"
            class="text-white position-absolute elevation-1"
            style="bottom: 0; right: 0;"
            @click="handleAvatarClick"
          ></v-btn>
        </div>
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



      <!-- AVATAR UPLOAD -->
<v-container class="d-flex flex-column align-center">
    
    <!-- Clickable Avatar Preview Container -->
    <v-avatar size="150" class="elevation-3 cursor-pointer mb-4" @click="triggerFileSelect">
      <v-img :src="avatarPreview" alt="User Avatar">
        <!-- Optional hover overlay hint -->
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-avatar>

    <!-- Hidden Vuetify File Input -->
    <!-- We hide it completely using standard CSS or Vuetify utility classes -->
    <v-file-input
      ref="fileInputRef"
      accept="image/*"
      class="d-none"
      @update:model-value="onFileSelected"
    />

    <!-- Action Buttons: Only show when a new file has been staged -->
    <v-expand-transition>
      <div v-if="selectedFile" class="d-flex ga-3">
        <v-btn 
          color="success" 
          :loading="isUploading" 
          @click="uploadAvatar"
        >
          Save Changes
        </v-btn>
        
        <v-btn 
          color="grey-lighten-1" 
          :disabled="isUploading" 
          @click="cancelSelection"
        >
          Cancel
        </v-btn>
      </div>
    </v-expand-transition>

  </v-container>  

</template>




<script setup>
import { ref, computed } from 'vue'
import axios from 'axios';

// Validation Ref Frameworks
const profileFormRef = ref(null)
const passwordFormRef = ref(null)
const isProfileValid = ref(false)
const isPasswordValid = ref(false)

// UI Feedback States
const showSuccessAlert = ref(false)

// True Account Profile State
const profileForm = ref({
  email: 'praeterusdice@gmail.com',
  name: 'praeterusdice'
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

// CHROMATIC SHUFFLE GENERATOR: Assigns beautiful muted background tones based on username text hashes
const avatarBgColor = computed(() => {
  const nameString = profileForm.value.name || 'P'
  let textHash = 0
  for (let i = 0; i < nameString.length; i++) {
    textHash = nameString.charCodeAt(i) + ((textHash << 5) - textHash)
  }
  const colorPalette = ['#8BA196', '#6B8E23', '#708090', '#A0522D', '#4682B4', '#556B2F', '#8B4513']
  const colorSelectorIndex = Math.abs(textHash) % colorPalette.length
  return colorPalette[colorSelectorIndex]
})

//PROFILE PICTURE CODE// State variables
const fileInputRef = ref(null)
const selectedFile = ref(null)
const isUploading = ref(false)

// Image URL states
const originalAvatar = ref('https://unsplash.com') 
const avatarPreview = ref(originalAvatar.value)

// Trigger the file picker hidden inside the Vuetify input element
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

// Vuetify 3 passes the file directly or inside an array
const onFileSelected = (fileOrArray) => {
  // Extract single file if Vuetify delivers it as an array
  const file = Array.isArray(fileOrArray) ? fileOrArray[0] : fileOrArray
  if (!file) return

  // Revoke old blob memory if switching between multiple local selections
  if (avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }

  // Save file data for the eventual upload step
  selectedFile.value = file
  // Generate temporary preview URL
  avatarPreview.value = URL.createObjectURL(file)
}

// Send binary data to backend when "Save" is clicked
const uploadAvatar = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  const formData = new FormData()
  formData.append('avatar', selectedFile.value)

  try {
    const response = await axios.post('/api/account/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    // Clean up temporary blob memory
    if (avatarPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview.value)
    }

    // Set new image from backend as the permanent source
    originalAvatar.value = response.data.avatarUrl
    avatarPreview.value = response.data.avatarUrl
    selectedFile.value = null 
    
    alert('Avatar updated successfully!')
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Failed to save avatar image.')
    revertPreview()
  } finally {
    isUploading.value = false
  }
}

// Cancel selection and wipe temporary blob out of memory
const cancelSelection = () => {
  if (avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  selectedFile.value = null
  avatarPreview.value = originalAvatar.value
}

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
