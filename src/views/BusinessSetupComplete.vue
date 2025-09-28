<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Business Setup</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <BusinessSetupProgress 
        :current-step="3" 
        :steps="['Business Info', 'Working Times', 'Social Links', 'Complete']"
      />
      
      <div class="setup-container">
        <div v-if="!isCreating && !isComplete" class="step-header">
          <h2>Complete Setup</h2>
          <p>Review your information and create your business</p>
        </div>
        
        <div v-if="isCreating" class="creating-container">
          <div class="creating-animation">
            <ion-spinner name="crescent" class="large-spinner"></ion-spinner>
          </div>
          <h2>Creating Your Business...</h2>
          <p>Please wait while we set up your business profile</p>
        </div>
        
        <div v-else-if="isComplete" class="success-container">
          <div class="success-animation">
            <ion-icon :icon="checkmarkCircle" class="success-icon"></ion-icon>
          </div>
          <h2>🎉 Business Created Successfully!</h2>
          <p>Your business is now ready to accept bookings</p>
          
          <ion-button
            expand="block"
            @click="goToDashboard"
            class="dashboard-button"
          >
            View Business Dashboard
          </ion-button>
        </div>
        
        <div v-else class="review-container">
          <div class="review-section">
            <h3>Business Information</h3>
            <div class="review-item">
              <strong>Name:</strong> {{ businessData?.name || 'Not loaded' }}
            </div>
            <div class="review-item">
              <strong>Category:</strong> {{ selectedCategory?.name }}
            </div>
            <div class="review-item" v-if="businessData?.description">
              <strong>Description:</strong> {{ businessData.description }}
            </div>
            <div class="review-item">
              <strong>Address:</strong> 
              {{ businessData?.address_line1 }}<span v-if="businessData?.address_line2">, {{ businessData.address_line2 }}</span><br>
              {{ businessData?.city }}<span v-if="businessData?.county">, {{ businessData.county }}</span><br>
              <span v-if="businessData?.postal_code">{{ businessData.postal_code }}, </span>{{ businessData?.country }}
            </div>
            <div class="review-item" v-if="businessData?.default_currency">
              <strong>Default Currency:</strong> {{ businessData.default_currency }}
            </div>
            <!-- TODO: Is active provider -->
            <div class="review-item" v-if="businessData?.bg_colour">
              <strong>Brand Color:</strong> 
              <span class="color-preview" :style="{ backgroundColor: businessData.bg_colour }"></span>
              {{ businessData.bg_colour }}
            </div>
          </div>
          
          <div class="review-section">
            <h3>Working Hours</h3>
            <div v-for="day in enabledWorkingDays" :key="day.day_of_week" class="review-item">
              <strong>{{ day.name }}:</strong> {{ day.start_time }} - {{ day.end_time }}
            </div>
          </div>
          
          <div v-if="hasSocialLinks" class="review-section">
            <h3>Social Links</h3>
            <div v-if="socialLinks?.twitter_url" class="review-item">
              <strong>Twitter:</strong> {{ socialLinks.twitter_url }}
            </div>
            <div v-if="socialLinks?.instagram_url" class="review-item">
              <strong>Instagram:</strong> {{ socialLinks.instagram_url }}
            </div>
            <div v-if="socialLinks?.facebook_url" class="review-item">
              <strong>Facebook:</strong> {{ socialLinks.facebook_url }}
            </div>
            <div v-if="socialLinks?.other_url" class="review-item">
              <strong>Website:</strong> {{ socialLinks.other_url }}
            </div>
          </div>
          
          <div class="button-container">
            <ion-button
              expand="block"
              fill="outline"
              @click="goBack"
            >
              Back to Edit
            </ion-button>
            
            <ion-button
              expand="block"
              @click="createBusiness"
              :disabled="loading"
            >
              <ion-spinner v-if="loading" name="crescent"></ion-spinner>
              <span v-else>Create My Business</span>
            </ion-button>
          </div>
        </div>
        
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
  IonAlert,
  IonIcon
} from '@ionic/vue';
import { checkmarkCircle } from 'ionicons/icons';
import BusinessSetupProgress from '@/components/BusinessSetupProgress.vue';
import { businessCategories } from '@/api/supabase';
import { user, isAuthenticated } from '@/stores/userStore';
import { runRpc } from '@/api/supabaseRpc';
import { BusinessFormData, SocialLinksFormData, WorkingDay } from '@/types/BusinessFormData';

defineOptions({
  name: 'BusinessSetupComplete'
});

const router = useRouter();

const loading = ref(false);
const isCreating = ref(false);
const isComplete = ref(false);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

const businessData = ref<BusinessFormData>(null);
const workingDays = ref<WorkingDay[]>([]);
const socialLinks = ref<SocialLinksFormData>(null);
const categories = ref<any[]>([]);
const currentUser = ref<any>(null);

const selectedCategory = computed(() => {
  return categories.value.find(cat => cat.id === businessData.value?.category_id);
});

const enabledWorkingDays = computed(() => {
  return workingDays.value.filter(day => day.enabled);
});

const hasSocialLinks = computed(() => {
  return socialLinks.value && (
    socialLinks.value.twitter_url || 
    socialLinks.value.instagram_url || 
    socialLinks.value.facebook_url || 
    socialLinks.value.other_url
  );
});

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  try {
    console.log('Starting loadData...');
    
    // Check if user is authenticated using the store
    if (!isAuthenticated.value || !user.value) {
      console.log('No user found, redirecting to login');
      showAlertMessage('Not Logged In', 'Please log in to continue.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
    
    currentUser.value = user.value;
    console.log('User authenticated:', user.value.email);

    // Load business categories
    console.log('Loading business categories...');
    const { data: categoriesData, error: categoriesError } = await businessCategories.getAll();
    if (categoriesError) {
      console.error('Categories error:', categoriesError);
    } else if (categoriesData) {
      categories.value = categoriesData;
      console.log('Loaded categories:', categoriesData.length);
    }

    // Load saved form data
    console.log('Loading session storage data...');
    const step1Data = sessionStorage.getItem('businessSetupStep1');
    const step2Data = sessionStorage.getItem('businessSetupStep2');
    const step3Data = sessionStorage.getItem('businessSetupStep3');

    console.log('Session storage check:');
    console.log('- Step 1 data length:', step1Data?.length || 0);
    console.log('- Step 2 data length:', step2Data?.length || 0);
    console.log('- Step 3 data length:', step3Data?.length || 0);

    if (!step1Data || !step2Data) {
      console.error('Missing session data - Step 1:', !!step1Data, 'Step 2:', !!step2Data);
      showAlertMessage('Missing Data', 'Business setup data not found. Please start the setup process again.');
      setTimeout(() => router.push('/business-setup/step1'), 2000);
      return;
    }

    try {
      businessData.value = JSON.parse(step1Data);
      workingDays.value = JSON.parse(step2Data);
      
      if (step3Data) {
        socialLinks.value = JSON.parse(step3Data);
      }

      console.log('Successfully parsed data:');
      console.log('- Business name:', businessData.value?.name);
      console.log('- Working days count:', workingDays.value?.length);
      console.log('- Has social links:', !!socialLinks.value);
      
    } catch (parseError) {
      console.error('Error parsing session data:', parseError);
      showAlertMessage('Data Error', 'Invalid session data format. Please start over.');
      setTimeout(() => router.push('/business-setup/step1'), 2000);
      return;
    }
    
    console.log('loadData completed successfully');
  } catch (error) {
    console.error('Error in loadData:', error);
    showAlertMessage('Error', 'Failed to load setup data. Please try again.');
  }
};

const createBusiness = async () => {
  if (!currentUser.value || !businessData.value) {
    showAlertMessage('Error', 'Missing required data');
    return;
  }

  loading.value = true;
  isCreating.value = true;

  try {
    // Create working times
    const workingTimesData = enabledWorkingDays.value.map(day => ({
      day_of_week: day.day_of_week,
      start_time: day.start_time,
      end_time: day.end_time
    }));

    const { data, error } = await runRpc("create_business", {
      p_name: businessData.value.name,
      p_category_id: businessData.value.category_id,
      p_description: businessData.value.description,
      p_bg_colour: businessData.value.bg_colour,
      p_default_currency: businessData.value.default_currency,
      p_address_line1: businessData.value.address_line1,
      p_address_line2: businessData.value.address_line2,
      p_city: businessData.value.city,
      p_county: businessData.value.county,
      p_postal_code: businessData.value.postal_code,
      p_country: businessData.value.country,
      p_twitter_url: socialLinks.value.twitter_url,
      p_instagram_url: socialLinks.value.instagram_url,
      p_facebook_url: socialLinks.value.facebook_url,
      p_other_url: socialLinks.value.other_url,
      p_is_active_provider: businessData.value.is_active_provider,
      p_working_times: workingTimesData,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create business');
    }

    // Clear session storage
    sessionStorage.removeItem('businessSetupStep1');
    sessionStorage.removeItem('businessSetupStep2');
    sessionStorage.removeItem('businessSetupStep3');

    // Show success
    setTimeout(() => {
      isCreating.value = false;
      isComplete.value = true;
    }, 2000);

  } catch (error: any) {
    console.error('Error creating business:', error);
    showAlertMessage('Error', error.message || 'Failed to create business');
    isCreating.value = false;
  } finally {
    loading.value = false;
  }
};

const goToDashboard = () => {
  router.push('/business-dashboard');
};

const goBack = () => {
  router.push('/business-setup/step3');
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

.creating-container,
.success-container {
  text-align: center;
  padding: 40px 20px;
}

.creating-animation,
.success-animation {
  margin-bottom: 24px;
}

.large-spinner {
  width: 64px;
  height: 64px;
  color: #3880ff;
}

.success-icon {
  font-size: 64px;
  color: #10dc60;
}

.creating-container h2,
.success-container h2 {
  color: #3880ff;
  margin-bottom: 12px;
}

.creating-container p,
.success-container p {
  color: #666;
  margin-bottom: 24px;
}

.dashboard-button {
  height: 48px;
  font-weight: 500;
  margin-top: 20px;
}

.review-container {
  margin-bottom: 20px;
}

.review-section {
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.review-section h3 {
  color: #3880ff;
  margin-bottom: 16px;
  font-size: 18px;
}

.review-item {
  margin-bottom: 12px;
  line-height: 1.5;
}

.review-item strong {
  color: #333;
  margin-right: 8px;
}

.button-container {
  margin-top: 30px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

ion-button {
  height: 48px;
  font-weight: 500;
}

.color-preview {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
