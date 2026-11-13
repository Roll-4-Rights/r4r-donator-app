<template>
  <div class="register-shell">
    <div class="register-visual">
      <div
        class="visual-media"
        :style="{ backgroundImage: `url(${splashImage})` }"
        aria-hidden="true"
      ></div>
      <div class="visual-scrim" aria-hidden="true"></div>

      <!-- <div class="visual-content">
        <img :src="logo" alt="" class="visual-logo" />
        <p class="visual-kicker">Roll4Rights</p>
        <p class="visual-title">Welcome back</p>
        <ul class="visual-points">
        </ul>
      </div> -->
    </div>

    <main class="register-panel">
      <div class="register-card">
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
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            required
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">
            {{ errorMessage }}
          </v-alert>

          <v-btn type="submit" color="primary" block :loading="submitting">
            Log In
          </v-btn>
        </v-form>

        <div class="mt-2 text-right">
          <router-link to="/forgot-password" class="text-body-2">
            Forgot password?
          </router-link>
        </div>

        <p class="mt-4 text-body-2">
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/authStore';
import splashImage from '@/assets/register-splash.jpg';
// import logo from '@/assets/logo.png';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
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

/* ---------------------------------------------------------
   Temporarily disabled — the login splash has no copy or logo.
   Uncomment this block when you re-enable .visual-content
   in the template.
   --------------------------------------------------------- */
/*
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
*/

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

  /* Temporarily disabled — see the note above. */
  /*
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
  */

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
