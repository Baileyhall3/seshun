<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Business Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Business Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="app-container">
        <div v-if="isAuthenticated" class="profile-wrapper">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ businessDs?.currentRecord?.name }}</ion-card-title>
              <ion-card-subtitle>{{ businessDs?.currentRecord?.category }}</ion-card-subtitle>
            </ion-card-header>
  
            <ion-card-content>
              <ion-list>
                <ion-item button detail @click="appUtils.goTo('/user-profile/profile-details')">
                  Edit Business
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>
        
                <ion-item button detail @click="appUtils.goTo('/business-settings/working-times')">
                  Update Working Hours
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>
        
                <ion-item button detail @click="appUtils.goTo('update-email')">
                  Update Social Links
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>
        
                <ion-item button detail @click="appUtils.goTo('change-password')">
                  Transfer Ownership
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>

                <!-- <ion-item button detail @click="appUtils.goTo('change-password')">
                  Business Card Setup
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item> -->
              </ion-list>
            </ion-card-content>
          </ion-card>
        </div>
  
        <div v-else class="not-logged-in">
          <strong>You are not logged in.</strong>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonList,
} from '@ionic/vue'
import { userStore } from '@/stores/userStore';
import { getDataObjectById } from 'supabase-dataobject-core';
import appUtils from '@/utils/AppUtils';

// check if user is the business owner
const { isAuthenticated } = userStore

const businessDs = getDataObjectById('my_business');

</script>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
}

.not-logged-in {
  text-align: center;
  margin-top: 40%;
}

ion-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

ion-card-title {
  font-size: 1.4rem;
}

ion-card-subtitle {
  color: var(--ion-color-medium);
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}
</style>
