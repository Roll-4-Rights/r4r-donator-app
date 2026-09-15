<template>
  <div class="subforum-page">
    <div class="construction-tape">
      <span>🚧 CHAT UNDER CONSTRUCTION 🚧</span>
    </div>

    <div class="welcome-blurb">
      <h2>Welcome to the Roll4Rights chat!</h2>
      <p>
        This eventually will become our community hub! Please be patient as we continue to build it.
      </p>
    </div>

    <div class="rules-card">
      <h1>Chat Rules</h1>
      <ol class="rules-list">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.subforum-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.construction-tape {
  background: repeating-linear-gradient(
    45deg,
    #f7d000,
    #f7d000 20px,
    #1a1a1a 20px,
    #1a1a1a 40px
  );
  color: #1a1a1a;
  text-align: center;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1px;
  padding: 10px 0;
  margin-bottom: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  animation: tape-blink 1.4s ease-in-out infinite;
}

.construction-tape span {
  display: inline-block;
  background: #1a1a1a;
  color: #f7d000;
  padding: 4px 14px;
  border-radius: 3px;
}

@keyframes tape-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

.welcome-blurb {
  background: #103948;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 24px;
  color: #dce6e8;
}

.welcome-blurb h2 {
  color: #fff;
  margin-bottom: 8px;
  font-size: 20px;
}

.welcome-blurb p {
  font-size: 14px;
  line-height: 1.6;
  color: #b8c9cc;
}

.rules-card {
  background: #1e2b30;
  border-radius: 8px;
  padding: 24px 28px;
}

.rules-card h1 {
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

.rules-list {
  color: #dce6e8;
  font-size: 14px;
  line-height: 2;
  padding-left: 20px;
}
</style>
