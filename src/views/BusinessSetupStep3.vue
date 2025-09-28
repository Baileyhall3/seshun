<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/business-setup/step2"></ion-back-button>
        </ion-buttons>
        <ion-title>Business Setup</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <BusinessSetupProgress 
        :current-step="2" 
        :steps="['Business Info', 'Working Times', 'Social Links', 'Complete']"
      />
      
      <div class="setup-container">
        <div class="step-header">
          <h2>Social Links</h2>
          <p>Connect your social media accounts (optional)</p>
        </div>
        
        <form @submit.prevent="handleNext">
          <ion-item>
            <ion-label position="stacked">
              <div class="social-label">
                <ion-icon :icon="logoTwitter" class="social-icon"></ion-icon>
                Twitter URL
              </div>
            </ion-label>
            <ion-input
              v-model="formData.twitter_url"
              type="url"
              placeholder="https://twitter.com/yourbusiness"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">
              <div class="social-label">
                <ion-icon :icon="logoInstagram" class="social-icon"></ion-icon>
                Instagram URL
              </div>
            </ion-label>
            <ion-input
              v-model="formData.instagram_url"
              type="url"
              placeholder="https://instagram.com/yourbusiness"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">
              <div class="social-label">
                <ion-icon :icon="logoFacebook" class="social-icon"></ion-icon>
                Facebook URL
              </div>
            </ion-label>
            <ion-input
              v-model="formData.facebook_url"
              type="url"
              placeholder="https://facebook.com/yourbusiness"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">
              <div class="social-label">
                <ion-icon :icon="linkOutline" class="social-icon"></ion-icon>
                Website/Other URL
              </div>
            </ion-label>
            <ion-input
              v-model="formData.other_url"
              type="url"
              placeholder="https://yourbusiness.com"
            ></ion-input>
          </ion-item>
          
          <div class="skip-info">
            <ion-icon :icon="informationCircleOutline" class="info-icon"></ion-icon>
            <p>You can skip this step and add social links later from your business dashboard.</p>
          </div>
          
          <div class="button-container">
            <ion-button
              expand="block"
              fill="outline"
              @click="goBack"
              class="back-button"
            >
              Back: Working Times
            </ion-button>
            
            <ion-button
              expand="block"
              fill="clear"
              @click="skipStep"
              class="skip-button"
            >
              Skip This Step
            </ion-button>
            
            <ion-button
              expand="block"
              type="submit"
              :disabled="loading"
            >
              <ion-spinner v-if="loading" name="crescent"></ion-spinner>
              <span v-else>Complete Setup</span>
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
import { ref, reactive, onMounted } from 'vue';
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
  IonButton,
  IonSpinner,
  IonAlert,
  IonIcon
} from '@ionic/vue';
import { 
  logoTwitter, 
  logoInstagram, 
  logoFacebook, 
  linkOutline,
  informationCircleOutline 
} from 'ionicons/icons';
import BusinessSetupProgress from '@/components/BusinessSetupProgress.vue';
import type { SocialLinksFormData } from '@/types/BusinessFormData';

defineOptions({
  name: 'BusinessSetupStep3'
});

const router = useRouter();

const loading = ref(false);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

const formData = reactive<SocialLinksFormData>({
  twitter_url: '',
  instagram_url: '',
  facebook_url: '',
  other_url: ''
});

onMounted(() => {
  // Load existing data if available
  const savedData = sessionStorage.getItem('businessSetupStep3');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    Object.assign(formData, parsedData);
  }
});

const validateUrls = (): boolean => {
  const urlPattern = /^https?:\/\/.+/;
  
  if (formData.twitter_url && !urlPattern.test(formData.twitter_url)) {
    showAlertMessage('Error', 'Please enter a valid Twitter URL starting with http:// or https://');
    return false;
  }
  
  if (formData.instagram_url && !urlPattern.test(formData.instagram_url)) {
    showAlertMessage('Error', 'Please enter a valid Instagram URL starting with http:// or https://');
    return false;
  }
  
  if (formData.facebook_url && !urlPattern.test(formData.facebook_url)) {
    showAlertMessage('Error', 'Please enter a valid Facebook URL starting with http:// or https://');
    return false;
  }
  
  if (formData.other_url && !urlPattern.test(formData.other_url)) {
    showAlertMessage('Error', 'Please enter a valid URL starting with http:// or https://');
    return false;
  }
  
  return true;
};

const handleNext = async () => {
  if (!validateUrls()) {
    return;
  }

  // Store form data in sessionStorage for the final step
  sessionStorage.setItem('businessSetupStep3', JSON.stringify(formData));
  
  // Navigate to completion step
  router.push('/business-setup/complete');
};

const skipStep = () => {
  // Clear social links data and proceed
  sessionStorage.removeItem('businessSetupStep3');
  router.push('/business-setup/complete');
};

const goBack = () => {
  // Save current data before going back
  sessionStorage.setItem('businessSetupStep3', JSON.stringify(formData));
  router.push('/business-setup/step2');
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

.social-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.social-icon {
  font-size: 18px;
  color: #3880ff;
}

ion-item {
  margin-bottom: 16px;
}

.skip-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f0f8ff;
  border-radius: 8px;
  margin: 24px 0;
}

.info-icon {
  font-size: 20px;
  color: #3880ff;
  margin-top: 2px;
  flex-shrink: 0;
}

.skip-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.button-container {
  margin-top: 30px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.back-button,
.skip-button {
  height: 48px;
  font-weight: 500;
}

ion-button {
  height: 48px;
  font-weight: 500;
}
</style>
