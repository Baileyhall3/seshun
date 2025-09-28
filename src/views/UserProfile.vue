<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>User Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">User Profile</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="app-container">
        <div v-if="isAuthenticated" class="profile-wrapper">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ userDs?.currentRecord?.display_name ?? (userDs?.currentRecord?.first_name + ' ' + userDs?.currentRecord?.last_name) }}</ion-card-title>
              <ion-card-subtitle>{{ userDs?.currentRecord?.email }}</ion-card-subtitle>
            </ion-card-header>
  
            <ion-card-content>
              <!-- <div>
                <ion-text>Actions</ion-text>
                <ion-button expand="block" color="primary" @click="editProfile" style="margin-bottom: 1vh;">
                  Edit Profile
                </ion-button>
                <ion-button expand="block" color="danger" @click="handleLogout">
                  Sign Out
                </ion-button>
              </div> -->
              <ion-list>
                <ion-item button detail @click="goTo('/user-profile/profile-details')">
                  My Profile
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>
        
                <ion-item button detail @click="goTo('/user-profile/edit-profile')">
                  Edit Profile
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>
        
                <ion-item button detail @click="goTo('update-email')">
                  Update Email
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>
        
                <ion-item button detail @click="goTo('change-password')">
                  Change Password
                  <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                </ion-item>
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
import { userStore, logout } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { getUser } from '@/dataObjects/dataObjects';
import { computed } from 'vue';
import { getDataObjectById } from 'supabase-dataobject-core';

const { isAuthenticated } = userStore

const router = useRouter();
const userDs = getDataObjectById('user');

window.userDs = userDs

const userName = computed(() => {
  return (
    userDs?.currentRecord?.display_name ??
    `${userDs?.currentRecord?.first_name} ${userDs?.currentRecord?.last_name ?? ''}`
  );
});

const handleLogout = async () => {
  const { success } = await logout()
  if (success) {
    // Optional: navigate to login page after sign out
    window.location.href = '/login'
  }
}

function goTo(route: string) {
  router.push(route);
}
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
