<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Business Setup</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <BusinessSetupProgress 
        :current-step="0" 
        :steps="['Business Info', 'Working Times', 'Social Links', 'Complete']"
      />
      
      <div class="setup-container">
        <div class="step-header">
          <h2>Business Information</h2>
          <p>Tell us about your business to get started</p>
        </div>
        
        <form @submit.prevent="handleNext">
          <ion-item>
            <ion-label position="stacked">Business Name *</ion-label>
            <ion-input
              v-model="formData.name"
              type="text"
              placeholder="Enter your business name"
              required
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Category *</ion-label>
            <ion-select 
              v-model="formData.category_id" 
              placeholder="Select business category"
              required
            >
              <ion-select-option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Description</ion-label>
            <ion-textarea
              v-model="formData.description"
              placeholder="Describe your business (optional)"
              :rows="3"
            ></ion-textarea>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Address Line 1 *</ion-label>
            <ion-input
              v-model="formData.address_line1"
              type="text"
              placeholder="Street address"
              required
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Address Line 2</ion-label>
            <ion-input
              v-model="formData.address_line2"
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">City *</ion-label>
            <ion-input
              v-model="formData.city"
              type="text"
              placeholder="City"
              required
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">County/State</ion-label>
            <ion-input
              v-model="formData.county"
              type="text"
              placeholder="County or State (optional)"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Postal Code</ion-label>
            <ion-input
              v-model="formData.postal_code"
              type="text"
              placeholder="Postal/ZIP code (optional)"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Country *</ion-label>
            <ion-select 
              v-model="formData.country" 
              placeholder="Select country"
              required
            >
              <ion-select-option value="United Kingdom">United Kingdom</ion-select-option>
              <ion-select-option value="United States">United States</ion-select-option>
              <ion-select-option value="Canada">Canada</ion-select-option>
              <ion-select-option value="Australia">Australia</ion-select-option>
              <ion-select-option value="Germany">Germany</ion-select-option>
              <ion-select-option value="France">France</ion-select-option>
              <ion-select-option value="Spain">Spain</ion-select-option>
              <ion-select-option value="Italy">Italy</ion-select-option>
              <ion-select-option value="Netherlands">Netherlands</ion-select-option>
              <ion-select-option value="Other">Other</ion-select-option>
            </ion-select>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Default Currency</ion-label>
            <ion-select 
              v-model="formData.default_currency" 
              placeholder="Select currency"
            >
              <ion-select-option value="GBP">GBP (£)</ion-select-option>
              <ion-select-option value="USD">USD ($)</ion-select-option>
              <ion-select-option value="EUR">EUR (€)</ion-select-option>
              <ion-select-option value="CAD">CAD (C$)</ion-select-option>
              <ion-select-option value="AUD">AUD (A$)</ion-select-option>
            </ion-select>
          </ion-item>
          
          <BusinessBgColorSelect v-model="formData.bg_colour" />

          <ion-item lines="none">
            <ion-label>
              <h2>Will you be an active service provider of the business?</h2>
              <p class="ion-text-wrap ion-text-muted">
                Check this on if you will be creating sessions yourself, leave unchecked if you will not.
                You can change this later.
              </p>
            </ion-label>

            <ion-checkbox
              slot="end"
              v-model="formData.is_active_provider"
            ></ion-checkbox>
          </ion-item>
          
          <div class="button-container">
            <ion-button
              expand="block"
              type="submit"
              :disabled="loading || !canSubmit"
            >
              <ion-spinner v-if="loading" name="crescent"></ion-spinner>
              <span v-else>Next: Working Times</span>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
  IonAlert
} from '@ionic/vue';
import BusinessSetupProgress from '@/components/BusinessSetupProgress.vue';
import { businessCategories } from '@/api/supabase';
import BusinessBgColorSelect from '@/components/input/BusinessBgColorSelect.vue';
import type { BusinessFormData } from '@/types/BusinessFormData';

defineOptions({
  name: 'BusinessSetupStep1'
});

const router = useRouter();

const loading = ref(false);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');
const categories = ref<Array<{ id: string; name: string }>>([]);

const formData = reactive<BusinessFormData>({
  name: '',
  category_id: '',
  description: '',
  address_line1: '',
  address_line2: '',
  city: '',
  county: '',
  postal_code: '',
  country: '',
  default_currency: 'GBP',
  bg_colour: '#3880ff',
  is_active_provider: false
});

const canSubmit = computed((): boolean => {
  return formData.name && 
    formData.category_id && 
    formData.address_line1 && 
    formData.city && 
    formData.country && 
    formData.default_currency && 
    formData.bg_colour ? true : false;
})

onMounted(async () => {
  await loadCategories();
});

const loadCategories = async () => {
  try {
    const { data, error } = await businessCategories.getAll();
    if (error) {
      console.error('Error loading categories:', error);
      showAlertMessage('Error', 'Failed to load business categories');
    } else if (data) {
      categories.value = data;
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    showAlertMessage('Error', 'Failed to load business categories');
  }
};

const handleNext = async () => {
  if (!formData.name || !formData.category_id || !formData.address_line1 || !formData.city || !formData.country) {
    showAlertMessage('Error', 'Please fill in all required fields.');
    return;
  }

  // Store form data in sessionStorage for the next step
  sessionStorage.setItem('businessSetupStep1', JSON.stringify(formData));
  
  // Navigate to step 2
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

ion-item {
  margin-bottom: 16px;
}

.button-container {
  margin-top: 30px;
  padding-bottom: 20px;
}

ion-button {
  height: 48px;
  font-weight: 500;
}
</style>
