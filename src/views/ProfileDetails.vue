<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Profile Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">User Profile</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="isAuthenticated" class="profile-wrapper">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ userName }}</ion-card-title>
            <ion-card-subtitle>{{ userEmail }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <ion-list lines="none">
              <ion-item>
                <ion-label>
                  <strong>First Name:</strong> {{ userDs?.currentRecord?.first_name || '-' }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <strong>Last Name:</strong> {{ userDs?.currentRecord?.last_name || '-' }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <strong>Display Name:</strong> {{ userDs?.currentRecord?.display_name || '-' }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <strong>Date of Birth:</strong> {{ DateUtils.toShortDate(userDs?.currentRecord?.dob) || '-' }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <strong>Gender:</strong> {{ userDs?.currentRecord?.gender || '-' }}
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <strong>Business Owner:</strong>
                  {{ userDs?.currentRecord?.is_business_owner ? 'Yes' : 'No' }}
                </ion-label>
              </ion-item>
            </ion-list>
            <div>
              <ion-text>Actions</ion-text>
              <ion-button expand="block" color="primary" @click="editProfile" style="margin-bottom: 1vh;">
                Edit Profile
              </ion-button>
              <ion-button expand="block" color="danger" @click="handleLogout">
                Sign Out
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <div v-else class="not-logged-in">
        <strong>You are not logged in.</strong>
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
  IonLabel,
  IonList,
  IonButton,
  IonText,
} from '@ionic/vue'
import { userStore, logout } from '@/stores/userStore';
import DateUtils from '@/utils/DateUtils';
import { useRouter } from 'vue-router';
import { getDataObjectById } from 'supabase-dataobject-core';

const { userEmail, userName, isAuthenticated } = userStore

const router = useRouter();
const userDs = getDataObjectById('user');

const handleLogout = async () => {
  const { success } = await logout()
  if (success) {
    // Optional: navigate to login page after sign out
    window.location.href = '/login'
  }
}

const editProfile = () => {
  router.push('/user-profile/edit-profile');
}
</script>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
