<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/business-setup/step1"></ion-back-button>
        </ion-buttons>
        <ion-title>Business Setup</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <BusinessSetupProgress 
        :current-step="1" 
        :steps="['Business Info', 'Working Times', 'Social Links', 'Complete']"
      />
      
      <div class="setup-container">
        <div class="step-header">
          <h2>Working Times</h2>
          <p>Set your business operating hours</p>
        </div>
        
        <form @submit.prevent="handleNext">
          <div 
            v-for="(day, index) in workingDays" 
            :key="index"
            class="day-container"
          >
            <div class="day-header">
              <ion-checkbox 
                v-model="day.enabled"
                @ionChange="toggleDay(index)"
              ></ion-checkbox>
              <ion-label class="day-label">{{ day.name }}</ion-label>
            </div>
            
            <div v-if="day.enabled" class="time-inputs">
              <ion-item>
                <ion-label position="stacked">Opening Time</ion-label>
                <ion-input
                  v-model="day.start_time"
                  type="time"
                  required
                ></ion-input>
              </ion-item>
              
              <ion-item>
                <ion-label position="stacked">Closing Time</ion-label>
                <ion-input
                  v-model="day.end_time"
                  type="time"
                  required
                ></ion-input>
              </ion-item>
            </div>
            
            <div v-else class="closed-indicator">
              <span>Closed</span>
            </div>
          </div>
          
          <div class="button-container">
            <ion-button
              expand="block"
              fill="outline"
              @click="goBack"
              class="back-button"
            >
              Back: Business Info
            </ion-button>
            
            <ion-button
              expand="block"
              type="submit"
              :disabled="loading || !hasAtLeastOneDay"
            >
              <ion-spinner v-if="loading" name="crescent"></ion-spinner>
              <span v-else>Next: Social Links</span>
            </ion-button>
          </div>
        </form>
        
        <ion-alert
          :is-open="showAlert"
          :header="alertHeader"
          :message="alertMessage"
          :buttons="['OK']"
          @didDismiss="showAlert = false"
        ></ion-alert>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonButton,
  IonSpinner,
  IonAlert
} from '@ionic/vue';
import BusinessSetupProgress from '@/components/BusinessSetupProgress.vue';
import type { WorkingDay } from '@/types/BusinessFormData';

defineOptions({
  name: 'BusinessSetupStep2'
});

const router = useRouter();

const loading = ref(false);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

const workingDays = reactive<WorkingDay[]>([
  { name: 'Sunday', day_of_week: 0, enabled: false, start_time: '09:00', end_time: '17:00' },
  { name: 'Monday', day_of_week: 1, enabled: true, start_time: '09:00', end_time: '17:00' },
  { name: 'Tuesday', day_of_week: 2, enabled: true, start_time: '09:00', end_time: '17:00' },
  { name: 'Wednesday', day_of_week: 3, enabled: true, start_time: '09:00', end_time: '17:00' },
  { name: 'Thursday', day_of_week: 4, enabled: true, start_time: '09:00', end_time: '17:00' },
  { name: 'Friday', day_of_week: 5, enabled: true, start_time: '09:00', end_time: '17:00' },
  { name: 'Saturday', day_of_week: 6, enabled: false, start_time: '09:00', end_time: '17:00' }
]);

const hasAtLeastOneDay = computed(() => {
  return workingDays.some(day => day.enabled);
});

onMounted(() => {
  // Load existing data if available
  const savedData = sessionStorage.getItem('businessSetupStep2');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    parsedData.forEach((savedDay: WorkingDay, index: number) => {
      if (workingDays[index]) {
        Object.assign(workingDays[index], savedDay);
      }
    });
  }
});

const toggleDay = (index: number) => {
  // Reset times when enabling a day
  if (workingDays[index].enabled && (!workingDays[index].start_time || !workingDays[index].end_time)) {
    workingDays[index].start_time = '09:00';
    workingDays[index].end_time = '17:00';
  }
};

const validateTimes = (): boolean => {
  for (const day of workingDays) {
    if (day.enabled) {
      if (!day.start_time || !day.end_time) {
        showAlertMessage('Error', `Please set opening and closing times for ${day.name}`);
        return false;
      }
      
      if (day.start_time >= day.end_time) {
        showAlertMessage('Error', `Opening time must be before closing time for ${day.name}`);
        return false;
      }
    }
  }
  return true;
};

const handleNext = async () => {
  if (!hasAtLeastOneDay.value) {
    showAlertMessage('Error', 'Please select at least one working day.');
    return;
  }

  if (!validateTimes()) {
    return;
  }

  // Store form data in sessionStorage for the next step
  sessionStorage.setItem('businessSetupStep2', JSON.stringify(workingDays));
  
  // Navigate to step 3
  router.push('/business-setup/step3');
};

const goBack = () => {
  // Save current data before going back
  sessionStorage.setItem('businessSetupStep2', JSON.stringify(workingDays));
  router.push('/business-setup/step1');
};

const showAlertMessage = (header: string, message: string) => {
  alertHeader.value = header;
  alertMessage.value = message;
  showAlert.value = true;
};
</script>

<style scoped>
.setup-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.step-header {
  text-align: center;
  margin-bottom: 30px;
}

.step-header h2 {
  color: #3880ff;
  margin-bottom: 8px;
}

.step-header p {
  color: #666;
  margin: 0;
}

.day-container {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.day-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.day-label {
  margin-left: 12px;
  font-weight: 500;
  font-size: 16px;
}

.time-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.time-inputs ion-item {
  margin-bottom: 0;
}

.closed-indicator {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 12px;
}

.button-container {
  margin-top: 30px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.back-button {
  height: 48px;
  font-weight: 500;
}

ion-button {
  height: 48px;
  font-weight: 500;
}

@media (max-width: 480px) {
  .time-inputs {
    grid-template-columns: 1fr;
  }
}
</style>
