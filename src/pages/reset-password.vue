<template>
  <div class="register-shell">
    <div class="register-visual">
      <div
        class="visual-media"
        :style="{ backgroundImage: `url(${splashImage})` }"
        aria-hidden="true"
      ></div>
      <div class="visual-scrim" aria-hidden="true"></div>
    </div>

    <main class="register-panel">
      <div class="register-card">
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService } from '@/services/api';
import splashImage from '@/assets/register-splash.jpg';

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

<style scoped>
/* =========================================================
   SHELL
   ========================================================= */
.register-shell {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background: #F4F6F8;
  overflow-x: hidden;
}

/* =========================================================
   LEFT — ANGLED SPLASH PANEL
   ========================================================= */
.register-visual {
  position: relative;
  z-index: 1;
  flex: 0 0 46%;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  background: #103948;
  clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
  filter: drop-shadow(10px 0 28px rgba(16, 57, 72, 0.22));
}

.visual-media {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 40%;
  transform: scale(1.05);
  animation: kenburns 26s ease-in-out infinite alternate;
  will-change: transform;
}

.visual-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(16, 57, 72, 0.15) 0%, rgba(16, 57, 72, 0.9) 100%),
    linear-gradient(90deg, rgba(16, 57, 72, 0.65) 0%, rgba(16, 57, 72, 0) 72%);
}

/* =========================================================
   RIGHT — FORM PANEL
   ========================================================= */
.register-panel {
  position: relative;
  z-index: 0;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.register-card {
  width: 100%;
  max-width: 460px;
  padding: 40px 36px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
  animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.register-card a:not(.v-btn) {
  color: #103948;
  font-weight: 600;
  text-decoration: none;
}

.register-card a:not(.v-btn):hover {
  text-decoration: underline;
}

/* =========================================================
   MOTION
   ========================================================= */
@keyframes kenburns {
  from {
    transform: scale(1.05) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.14) translate3d(-1.5%, -1%, 0);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width: 839px) {
  .register-shell {
    flex-direction: column;
  }

  .register-visual {
    flex: 0 0 auto;
    height: 240px;
    justify-content: center;
    clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
    filter: drop-shadow(0 10px 22px rgba(16, 57, 72, 0.2));
  }

  .register-panel {
    padding: 26px 16px 48px;
  }

  .register-card {
    padding: 28px 22px;
    background: transparent;
    box-shadow: none;
  }
}

@media (max-width: 400px) {
  .register-visual {
    height: 200px;
  }

  .register-card {
    padding: 24px 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .visual-media,
  .register-card {
    animation: none !important;
  }
}
</style>