<template>
  <v-container class="py-8" style="max-width: 480px;">
    <h1 class="text-h5 mb-4">Create an Account</h1>

    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="name"
        label="Full Name"
        required
      />
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
        hint="At least 8 characters"
        required
      />

      <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-btn type="submit" color="primary" block :loading="submitting">
        Register
      </v-btn>
    </v-form>

    <p class="mt-4 text-body-2">
      Already have an account?
      <router-link to="/login">Log in here</router-link>
    </p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/services/authStore';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const submitting = ref(false);

async function handleSubmit() {
  errorMessage.value = '';
  submitting.value = true;
  try {
    await register({ name: name.value, email: email.value, password: password.value });
    router.push('/'); // redirect to home once registered
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    submitting.value = false;
  }
}
</script>