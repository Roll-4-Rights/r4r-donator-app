<template>
  <v-container class="py-8" style="max-width: 480px;">
    <div v-if="checking" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else-if="!tokenValid">
      <h1 class="text-h5 mb-4">Reset Link Invalid</h1>
      <v-alert type="error" density="compact" class="mb-4">
        This password reset link is invalid or has expired. Please request a new one.
      </v-alert>
      <v-btn color="primary" to="/forgot-password">Request a new link</v-btn>
    </template>

    <template v-else>
      <h1 class="text-h5 mb-2">Choose a New Password</h1>
      <p class="text-body-2 text-grey-darken-1 mb-4">
        Your new password must be at least 8 characters.
      </p>

      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="password"
          label="New Password"
          autocomplete="new-password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          hint="At least 8 characters"
          required
          @click:append-inner="showPassword = !showPassword"
        />
        <v-text-field
          v-model="confirm"
          label="Confirm New Password"
          autocomplete="new-password"
          :type="showConfirm ? 'text' : 'password'"
          :append-inner-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
          required
          @click:append-inner="showConfirm = !showConfirm"
        />

        <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-btn type="submit" color="primary" block :loading="submitting">
          Reset Password
        </v-btn>
      </v-form>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService } from '@/services/api';

const route = useRoute();
const router = useRouter();

const checking = ref(true);
const tokenValid = ref(false);
const password = ref('');
const confirm = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);
const errorMessage = ref('');
const submitting = ref(false);

const token = route.query.token || '';

onMounted(async () => {
  if (!token) {
    tokenValid.value = false;
    checking.value = false;
    return;
  }
  try {
    const result = await apiService.validateResetToken(token);
    tokenValid.value = !!result.valid;
  } catch {
    tokenValid.value = false;
  } finally {
    checking.value = false;
  }
});

async function handleSubmit() {
  errorMessage.value = '';
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters';
    return;
  }
  if (password.value !== confirm.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }
  submitting.value = true;
  try {
    await apiService.resetPassword({ token, new_password: password.value });
    router.push('/login');
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    submitting.value = false;
  }
}
</script>
