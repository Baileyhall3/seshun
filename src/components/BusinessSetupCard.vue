<template>
  <div class="setup-card-container">
    <ion-card class="setup-card">
      <div class="setup-card-content">
        <div class="setup-card-text">
          <div class="flex items-center">
            <ion-icon :icon="briefcaseOutline" class="setup-icon"></ion-icon>
            <h2 class="setup-title">Almost there!</h2>
          </div>
          <p class="setup-subtitle">
            Finish setting up your business to unlock all business owner features.
          </p>

          <ion-button
            expand="block"
            color="light"
            class="setup-button"
            @click="goToBusinessSetup"
          >
            Finish Setup
            <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  IonCard, IonButton, IonIcon
} from '@ionic/vue'
import { briefcaseOutline } from 'ionicons/icons'

const router = useRouter()

function goToBusinessSetup() {
  router.push('/business-setup/step1')
}
</script>

<style scoped>
.setup-card-container {
  margin: 2rem 1rem;
}

.setup-card {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.setup-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  gap: 1rem;
}

.setup-card-text {
  flex: 1;
}

.setup-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.setup-title {
  font-size: 1.8rem;
  margin: 0 0 0 0.5rem;
  font-weight: bold;
}

.setup-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.setup-button {
  --background: #fff;
  --color: #ff7e5f;
  font-weight: bold;
  border-radius: 1rem;
}

.setup-card-image img {
  width: 140px;
  height: auto;
  object-fit: contain;
}
</style>
