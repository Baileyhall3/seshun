<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Edit Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="edit-profile-container" v-if="profileEdits">
        <form @submit.prevent="handleEditProfile">
          <!-- First Name -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">First Name</ion-label>
              <ion-input
                v-model="profileEdits.first_name"
                type="text"
                placeholder="Enter your first name"
              ></ion-input>
            </ion-item>
            <p v-if="errors.first_name" class="error-text">{{ errors.first_name }}</p>
          </div>

          <!-- Last Name -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Last Name</ion-label>
              <ion-input
                v-model="profileEdits.last_name"
                type="text"
                placeholder="Enter your last name"
              ></ion-input>
            </ion-item>
            <p v-if="errors.last_name" class="error-text">{{ errors.last_name }}</p>
          </div>

          <!-- Display Name -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Display Name</ion-label>
              <ion-input
                v-model="profileEdits.display_name"
                type="text"
                placeholder="Enter your display name"
              ></ion-input>
            </ion-item>
          </div>

          <!-- <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input
                v-model="formData.email"
                type="email"
                placeholder="Enter your email"
              ></ion-input>
            </ion-item>
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Password</ion-label>
              <ion-input
                v-model="formData.password"
                type="password"
                placeholder="Enter your password"
              ></ion-input>
            </ion-item>
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>

          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Repeat Password</ion-label>
              <ion-input
                v-model="formData.confirm_password"
                type="password"
                placeholder="Repeat password"
              ></ion-input>
            </ion-item>
            <p v-if="errors.confirm_password" class="error-text">{{ errors.confirm_password }}</p>
          </div> -->

          <!-- Optional DOB -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Date of Birth</ion-label>
              <ion-input v-model="profileEdits.dob" type="date"></ion-input>
            </ion-item>
          </div>

          <!-- Optional Gender -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Gender</ion-label>
              <ion-select v-model="profileEdits.gender" placeholder="Select gender">
                <ion-select-option value="male">Male</ion-select-option>
                <ion-select-option value="female">Female</ion-select-option>
                <ion-select-option value="other">Other</ion-select-option>
                <ion-select-option value="prefer_not_to_say">Prefer not to say</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <div>
              <ion-button 
                expand="block" 
                type="submit" 
                :disabled="loading || !hasChanges" 
                class="ion-margin-top"
              >
                <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                <span v-else>Save</span>
              </ion-button>
              <ion-button 
                expand="block" 
                type="button" 
                class="ion-margin-top" 
                color="medium" 
                :disabled="!hasChanges" 
                @click="cancelChanges"
              >
                <span>Cancel</span>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonSpinner
} from '@ionic/vue'
import { userStore, updateProfile, user } from '@/stores/userStore';
import { getDataObjectById } from 'supabase-dataobject-core';
import { onIonViewDidEnter } from '@ionic/vue';

interface User {
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    is_business_owner: boolean;
    display_name: string;
}

// const { userProfile } = userStore;

const loading = ref<boolean>(false);
const errors = reactive<Record<string, string>>({});
const profileEdits = ref<User>();
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');
const router = useRouter();
const userDs = getDataObjectById('user');

onIonViewDidEnter(() => {
    profileEdits.value = { ...userDs?.currentRecord };
});

const hasChanges = computed(() => {
  if (!profileEdits.value || !userDs?.currentRecord) return false
  return (
    profileEdits.value.first_name !== userDs?.currentRecord?.first_name ||
    profileEdits.value.last_name !== userDs?.currentRecord?.last_name ||
    profileEdits.value.display_name !== userDs?.currentRecord?.display_name ||
    profileEdits.value.dob !== userDs?.currentRecord?.dob ||
    profileEdits.value.gender !== userDs?.currentRecord?.gender
  )
});

const cancelChanges = () => {
  profileEdits.value = { ...userDs?.currentRecord };
};

function validateForm() {
  errors.first_name = userDs?.currentRecord?.first_name ? '' : 'First name is required.'
  errors.last_name = userDs?.currentRecord?.last_name ? '' : 'Last name is required.'

  return Object.values(errors).every(e => !e)
}

async function handleEditProfile() {
    if (!validateForm()) return
    try {
        loading.value = true;

        const hasUpdated = await userDs?.update(user.value.id, profileEdits.value);

        if (hasUpdated) {
            showAlertMessage('Update Successful', 'Profile was updated successfully');
            router.push('/user-profile');
        } else {
            showAlertMessage('Update Failed', 'Update failed');
        }
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
}

const showAlertMessage = (header: string, message: string) => {
    alertHeader.value = header;
    alertMessage.value = message;
    showAlert.value = true;
};

</script>

<style scoped>
.edit-profile-container {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

ion-item {
  margin-bottom: 10px;
}

ion-button {
  margin-top: 20px;
}

.form-field {
  margin-bottom: 1rem;
}

.error-text {
  color: var(--ion-color-danger);
  font-size: 0.85rem;
  margin: 4px 16px 0; /* aligns under the ion-item */
}
</style>