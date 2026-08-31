<template>
  <v-container class="py-8" style="max-width: 480px;">
    <div v-if="checkingInvite" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="hasInviteParam && !inviteValid">
      <h1 class="text-h5 mb-4">Invite Required</h1>
      <v-alert type="error" density="compact">
        {{ inviteError || 'This registration link is invalid or has expired. Please contact us for a new invite.' }}
      </v-alert>
    </div>

    <template v-else>
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
          :readonly="hasInviteParam"
          :hint="hasInviteParam ? 'This invite was issued for this email address' : ''"
          :persistent-hint="hasInviteParam"
          required
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          hint="At least 8 characters"
          required
        />
        <v-text-field
          v-if="!hasInviteParam"
          v-model="passcode"
          label="Registration Passcode"
          hint="Provided to you by Roll4Rights"
          persistent-hint
          required
        />

        <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4 mt-4">
          {{ errorMessage }}
        </v-alert>

        <v-btn type="submit" color="primary" block :loading="submitting" class="mt-2">
          Register
        </v-btn>
      </v-form>

      <p class="mt-4 text-body-2">
        Already have an account?
        <router-link to="/login">Log in here</router-link>
      </p>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { register } from '@/services/authStore';
import { apiService } from '@/services/api';

const router = useRouter();
const route = useRoute();

const name = ref('');
const email = ref('');
const password = ref('');
const passcode = ref('');
const errorMessage = ref('');
const submitting = ref(false);

const checkingInvite = ref(true);
const inviteValid = ref(false);
const inviteError = ref('');
const inviteCode = ref('');

const hasInviteParam = computed(() => !!route.query.invite);

async function handleSubmit() {
  errorMessage.value = '';
  submitting.value = true;
  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
      invite_code: hasInviteParam.value ? inviteCode.value : '',
      passcode: hasInviteParam.value ? '' : passcode.value
    });
    router.push('/');
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  const code = route.query.invite;
  if (!code) {
    checkingInvite.value = false;
    return;
  }

  inviteCode.value = code;
  try {
    const result = await apiService.verifyInvite(code);
    if (result.valid) {
      inviteValid.value = true;
      email.value = result.email;
    } else {
      inviteValid.value = false;
      inviteError.value = result.error;
    }
  } catch (err) {
    inviteValid.value = false;
  } finally {
    checkingInvite.value = false;
  }
});
</script>