<template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>
    <NavTabs v-if="isAuthenticated" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import NavTabs from './components/NavTabs.vue';
import { isAuthenticated } from '@/stores/userStore';
</script>