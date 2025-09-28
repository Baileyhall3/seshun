<template>
  <ion-page>
    <!-- <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header> -->

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="app-container">
        <div class="w-full">
          <div v-if="userDs?.currentRecord?.is_business_owner && !userDs?.currentRecord?.business_id">
            <BusinessSetupCard />
          </div>
          <div 
            v-else-if="userDs?.currentRecord?.is_business_owner && businessDs?.currentRecord"
          >
            <div>
              <h3>Your Business</h3>
            </div>
            <BusinessCard 
              :id="businessDs?.currentRecord.id"
              :name="businessDs?.currentRecord.name"
              :bgColor="businessDs?.currentRecord.bg_colour"
              :category="businessDs?.currentRecord.category"
            />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import BusinessSetupCard from '@/components/BusinessSetupCard.vue';
import BusinessCard from '@/components/BusinessCard.vue';
import { getDataObjectById } from 'supabase-dataobject-core';

const userDs = getDataObjectById('user');
const businessDs = getDataObjectById('my_business');

</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
