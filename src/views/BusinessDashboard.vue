<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Business Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Business Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="app-container">
        <div v-if="loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Loading your business...</p>
        </div>
        
        <div v-else-if="userDs?.currentRecord?.is_business_owner && !userDs?.currentRecord?.business_id">
          <BusinessSetupCard />
        </div>

        <div v-else-if="businessDs?.currentRecord" class="dashboard-container">
          <div class="business-header" :style="{ backgroundColor: businessDs?.currentRecord?.bg_colour || '#3880ff' }">
            <div class="business-info">
              <h1>{{ businessDs?.currentRecord?.name }}</h1>
              <p class="business-category">{{ businessDs?.currentRecord?.category }}</p>
              <p class="business-owner">Owner: {{ businessDs?.currentRecord?.owner }}</p>
              <p class="business-address">
                {{ businessDs?.currentRecord?.address_line1 }}<span v-if="businessDs?.currentRecord?.address_line2">, {{ businessDs?.currentRecord?.address_line2 }}</span><br>
                {{ businessDs?.currentRecord?.city }}<span v-if="businessDs?.currentRecord?.county">, {{ businessDs?.currentRecord?.county }}</span>
                <span v-if="businessDs?.currentRecord?.postal_code">, {{ businessDs?.currentRecord?.postal_code }}</span>
              </p>
            </div>
          </div>
          
          <div class="dashboard-content">
            <div v-if="businessDs?.currentRecord?.description" class="description-section">
              <h3>About</h3>
              <p>{{ businessDs?.currentRecord?.description }}</p>
            </div>
            
            <div class="flex-col-lg-row gap-6">
              <div class="working-hours-section flex-1">
                <h3>Working Hours</h3>
                <template v-if="businessWorkingTimesDs">
                  <div v-if="businessWorkingTimesDs?.data.length > 0" class="working-hours">
                    <div v-for="time in businessWorkingTimesDs?.data" :key="time.day_of_week" class="working-day">
                      <span class="day-name">{{ time.day_name }}</span>
                      <span class="day-hours">{{ DateUtils.toShortTime(time.start_time) }} - {{ DateUtils.toShortTime(time.end_time) }}</span>
                    </div>
                  </div>
                  <p v-else class="no-hours">No working hours set</p>
                </template>
              </div>
              
              <div v-if="businessSocialLinksDs?.currentRecord" class="social-links-section flex-1">
                <h3>Social Links</h3>
                <!-- <div class="flex items-center">
                  <p class="ms-1 slightly-muted">
                    <ion-icon :icon="bulbOutline" slot="start" style="color: yellow;"></ion-icon>
                    Add links to all your socials so users can stay connected!
                  </p>
                </div> -->
                <div class="social-links">
                  <ion-button 
                    :disabled="!businessSocialLinksDs?.currentRecord?.twitter_url"
                    fill="outline" 
                    size="small"
                    @click="openLink(businessSocialLinksDs?.currentRecord?.twitter_url)"
                  >
                    <ion-icon :icon="logoTwitter" slot="start"></ion-icon>
                    Twitter
                  </ion-button>
                  
                  <ion-button 
                    :disabled="!businessSocialLinksDs?.currentRecord?.instagram_url"
                    fill="outline" 
                    size="small"
                    @click="openLink(businessSocialLinksDs?.currentRecord?.instagram_url)"
                  >
                    <ion-icon :icon="logoInstagram" slot="start"></ion-icon>
                    Instagram
                  </ion-button>
                  
                  <ion-button 
                    :disabled="!businessSocialLinksDs?.currentRecord?.facebook_url"
                    fill="outline" 
                    size="small"
                    @click="openLink(businessSocialLinksDs?.currentRecord?.facebook_url)"
                  >
                    <ion-icon :icon="logoFacebook" slot="start"></ion-icon>
                    Facebook
                  </ion-button>
                  
                  <ion-button 
                    :disabled="!businessSocialLinksDs?.currentRecord?.other_url" 
                    fill="outline" 
                    size="small"
                    @click="openLink(businessSocialLinksDs?.currentRecord?.other_url)"
                  >
                    <ion-icon :icon="linkOutline" slot="start"></ion-icon>
                    Website
                  </ion-button>
                </div>
              </div>
            </div>
            
            <div class="actions-section">
              <h3>Quick Actions</h3>
              <div class="action-buttons">
                <ion-button expand="block" fill="outline">
                  <ion-icon :icon="calendarOutline" slot="start"></ion-icon>
                  Manage Bookings
                </ion-button>
                
                <ion-button expand="block" fill="outline">
                  <ion-icon :icon="settingsOutline" slot="start"></ion-icon>
                  Business Settings
                </ion-button>
                
                <ion-button expand="block" fill="outline">
                  <ion-icon :icon="peopleOutline" slot="start"></ion-icon>
                  Manage Staff
                </ion-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ion-alert
        :is-open="showAlert"
        :header="alertHeader"
        :message="alertMessage"
        :buttons="['OK']"
        @didDismiss="showAlert = false"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
import {
  logoTwitter,
  logoInstagram,
  logoFacebook,
  linkOutline,
  calendarOutline,
  settingsOutline,
  peopleOutline,
  businessOutline,
  bulbOutline
} from 'ionicons/icons';
import BusinessSetupCard from '@/components/BusinessSetupCard.vue';
import { getDataObjectById } from 'supabase-dataobject-core';
import DateUtils from '@/utils/DateUtils';

defineOptions({
  name: 'BusinessDashboard'
});

const router = useRouter();

const userDs = getDataObjectById('user');
const businessDs = getDataObjectById('my_business');
const businessSocialLinksDs = getDataObjectById('my_business_social_links');
const businessWorkingTimesDs = getDataObjectById('my_business_working_times');

const loading = ref(true);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

onMounted(async () => {
  await loadBusinessData();
});

const loadBusinessData = async () => {
  console.log('bidness ', businessDs)
  try {      
    if (businessDs?.isReady) {
      if (businessDs.currentRecord) {
        // Load working times
      }
    }
  } catch (error: any) {
    console.error('Error loading business data:', error);
    // showAlertMessage('Error', 'Failed to load business data');
  } finally {
    loading.value = false;
  }
};

const openLink = (url: string) => {
  window.open(url, '_blank');
};

const showAlertMessage = (header: string, message: string) => {
  alertHeader.value = header;
  alertMessage.value = message;
  showAlert.value = true;
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-container ion-spinner {
  margin-bottom: 16px;
}

.dashboard-container {
  width: 100%;
}

.business-header {
  color: white;
  padding: 30px 20px;
  text-align: center;
}

.business-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: bold;
}

.business-category {
  margin: 0 0 8px 0;
  font-size: 16px;
  opacity: 0.9;
}

.business-owner {
  margin: 0 0 16px 0;
  font-size: 16px;
  opacity: 0.9;
}

.business-address {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
}

.dashboard-content {
  padding: 20px;
}

.description-section,
.working-hours-section,
.social-links-section,
.actions-section {
  margin-bottom: 32px;
}

.description-section h3,
.working-hours-section h3,
.social-links-section h3,
.actions-section h3 {
  color: #3880ff;
  margin-bottom: 16px;
  font-size: 18px;
}

.working-hours {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.working-day {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.working-day:last-child {
  border-bottom: none;
}

.day-name {
  font-weight: 500;
  color: #333;
}

.day-hours {
  color: #666;
}

.no-hours {
  color: #666;
  font-style: italic;
  margin: 0;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons ion-button {
  height: 48px;
  font-weight: 500;
}
</style>
