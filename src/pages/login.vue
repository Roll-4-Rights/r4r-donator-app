<template>
  <v-container class="py-8" style="max-width: 480px;">
    <h1 class="text-h5 mb-4">Log In</h1>

    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
      />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
      />

      <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-btn type="submit" color="primary" block :loading="submitting">
        Log In
      </v-btn>
    </v-form>

    <p class="mt-4 text-body-2">
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/authStore';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const submitting = ref(false);

async function handleSubmit() {
  errorMessage.value = '';
  submitting.value = true;
  try {
    await login({ email: email.value, password: password.value });
    router.push('/'); // redirect to home once logged in
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    submitting.value = false;
  }
}
</script>