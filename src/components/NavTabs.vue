<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="seshuns" href="/my-calendar">
            <ion-icon :icon="calendarOutline" />
            <ion-label>Seshuns</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="search" href="/search">
            <ion-icon :icon="search" />
            <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="business" href="/business-dashboard" v-if="userDs?.currentRecord?.is_business_owner">
            <ion-icon :icon="briefcaseOutline" />
            <ion-label>My Business</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/user-profile">
          <ion-icon :icon="personOutline" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
  import { search, homeOutline, calendarOutline, personOutline, briefcaseOutline } from 'ionicons/icons';
  import { getDataObjectById } from 'supabase-dataobject-core';

  const userDs = getDataObjectById('user');
</script>