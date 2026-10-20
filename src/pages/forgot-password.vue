<template>
  <v-container class="py-8" style="max-width: 480px;">
    <h1 class="text-h5 mb-2">Forgot Password</h1>
    <p class="text-body-2 text-grey-darken-1 mb-4">
      Enter the email address tied to your account and we'll send you a link to reset your password.
    </p>

    <v-alert v-if="sent" type="success" density="compact" class="mb-4">
      If that email is registered, a reset link has been sent. Check your inbox (and spam folder).
    </v-alert>

    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
      />

      <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-btn type="submit" color="primary" block :loading="submitting">
        Send Reset Link
      </v-btn>
    </v-form>

    <p class="mt-4 text-body-2">
      Remembered it?
      <router-link to="/login">Back to login</router-link>
    </p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { apiService } from '@/services/api';

const email = ref('');
const errorMessage = ref('');
const submitting = ref(false);
const sent = ref(false);

async function handleSubmit() {
  errorMessage.value = '';
  submitting.value = true;
  try {
    await apiService.forgotPassword(email.value);
    sent.value = true;
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    submitting.value = false;
  }
}
</script>
