<template>
  <div class="register-shell">
    <aside class="register-visual" aria-label="About Roll4Rights">
      <div
        class="visual-media"
        :style="{ backgroundImage: `url(${splashImage})` }"
        aria-hidden="true"
      ></div>
      <div class="visual-scrim" aria-hidden="true"></div>

      <div class="visual-content">
        <img :src="logo" alt="" class="visual-logo" />
        <p class="visual-kicker">Roll4Rights</p>
        <p class="visual-title">Turn your love of all things nerdy into real-world impact.</p>
        <ul class="visual-points">
          <li>Join charity auctions</li>
          <li>Track your contributions</li>
          <li>Connect with the community</li>
        </ul>
      </div>
    </aside>

    <main class="register-panel">
      <div class="register-card">

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
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              hint="At least 8 characters"
              required
              @click:append-inner="showPassword = !showPassword"
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { register } from '@/services/authStore';
import { apiService } from '@/services/api';
import splashImage from '@/assets/register-splash.jpg';
import logo from '@/assets/logo.png';

const router = useRouter();
const route = useRoute();

const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
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

.visual-content {
  position: relative;
  z-index: 1;
  padding: 48px 12% 56px 48px;
  color: #fff;
}

.visual-logo {
  width: 56px;
  height: 56px;
  padding: 6px;
  margin-bottom: 22px;
  border-radius: 14px;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
}

.visual-kicker {
  margin: 0 0 10px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.visual-title {
  margin: 0 0 22px;
  font-size: clamp(1.5rem, 2.2vw, 2.15rem);
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

.visual-points {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.visual-points li {
  position: relative;
  padding-left: 26px;
  font-size: 0.95rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.88);
}

.visual-points li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.42em;
  width: 14px;
  height: 8px;
  border-left: 2px solid #7fd4e8;
  border-bottom: 2px solid #7fd4e8;
  transform: rotate(-45deg);
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

.register-card a {
  color: #103948;
  font-weight: 600;
  text-decoration: none;
}

.register-card a:hover {
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

  .visual-content {
    padding: 28px 24px 44px;
  }

  .visual-logo {
    width: 44px;
    height: 44px;
    margin-bottom: 14px;
  }

  .visual-kicker {
    margin-bottom: 6px;
  }

  .visual-title {
    margin-bottom: 0;
    font-size: 1.35rem;
  }

  .visual-points {
    display: none;
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
