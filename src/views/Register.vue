<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="register-container">
        <form @submit.prevent="handleRegister">
          <!-- First Name -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">First Name</ion-label>
              <ion-input
                v-model="formData.first_name"
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
                v-model="formData.last_name"
                type="text"
                placeholder="Enter your last name"
              ></ion-input>
            </ion-item>
            <p v-if="errors.last_name" class="error-text">{{ errors.last_name }}</p>
          </div>

          <!-- Display Name -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Display Name (Optional)</ion-label>
              <ion-input
                v-model="formData.display_name"
                type="text"
                placeholder="Enter your display name"
              ></ion-input>
            </ion-item>
          </div>

          <!-- Email -->
          <div class="form-field">
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

          <!-- Password -->
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

          <!-- Confirm Password -->
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
          </div>

          <!-- Optional DOB -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Date of Birth (Optional)</ion-label>
              <ion-input v-model="formData.dob" type="date"></ion-input>
            </ion-item>
          </div>

          <!-- Optional Gender -->
          <div class="form-field">
            <ion-item>
              <ion-label position="stacked">Gender (Optional)</ion-label>
              <ion-select v-model="formData.gender" placeholder="Select gender">
                <ion-select-option value="male">Male</ion-select-option>
                <ion-select-option value="female">Female</ion-select-option>
                <ion-select-option value="other">Other</ion-select-option>
                <ion-select-option value="prefer_not_to_say">Prefer not to say</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <!-- Business Owner -->
          <div class="form-field">
            <ion-item>
              <ion-checkbox v-model="formData.is_business_owner"></ion-checkbox>
              <ion-label class="ion-margin-start">I am a business owner</ion-label>
            </ion-item>
          </div>

          <ion-button expand="block" type="submit" :disabled="loading" class="ion-margin-top">
            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
            <span v-else>Register</span>
          </ion-button>

          <ion-button expand="block" fill="clear" @click="goToLogin" class="ion-margin-top">
            Already have an account? Login
          </ion-button>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonCheckbox, IonButton, IonSpinner, IonAlert
} from '@ionic/vue'
import { register } from '@/stores/userStore'

defineOptions({ name: 'RegisterPage' })

const router = useRouter()
const loading = ref(false)
const showAlert = ref(false)
const alertHeader = ref('')
const alertMessage = ref('')

interface FormData {
  first_name: string
  last_name: string
  display_name: string
  email: string
  password: string
  confirm_password: string
  dob: string
  gender: string
  is_business_owner: boolean
}

const formData = reactive<FormData>({
  first_name: '',
  last_name: '',
  display_name: '',
  email: '',
  password: '',
  confirm_password: '',
  dob: '',
  gender: '',
  is_business_owner: false
})

const errors = reactive<Record<string, string>>({})

function validateForm() {
  errors.first_name = formData.first_name ? '' : 'First name is required.'
  errors.last_name = formData.last_name ? '' : 'Last name is required.'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ? ''
    : 'Enter a valid email address.'
  errors.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)
    ? ''
    : 'Password must be at least 8 chars, include uppercase, lowercase, and a number.'
  errors.confirm_password = formData.confirm_password === formData.password
    ? ''
    : 'Passwords do not match.'

  return Object.values(errors).every(e => !e)
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true;

  try {
    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      dob: formData.dob || undefined,
      gender: formData.gender || undefined,
      is_business_owner: formData.is_business_owner,
      display_name: formData.display_name || undefined
    };

    const result = await register(formData.email, formData.password, userData);

    if (!result.success) {
      showAlertMessage('Registration Failed', result.error || 'Registration failed');
    } else {
      showAlertMessage('Registration Successful', 'Please check your email and click the verification link to complete your registration. You must verify your email before you can access business features.');
      // Clear form
      resetForm();
      router.push('/login');
    }
  } catch (error) {
    showAlertMessage('Error', 'An unexpected error occurred. Please try again.');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.first_name = '';
  formData.last_name = '';
  formData.display_name = '';
  formData.email = '';
  formData.password = '';
  formData.dob = '';
  formData.gender = '';
  formData.is_business_owner = false;
};

const goToLogin = () => {
  router.push('/login');
};

const showAlertMessage = (header: string, message: string) => {
  alertHeader.value = header;
  alertMessage.value = message;
  showAlert.value = true;
};
</script>

<style scoped>
.register-container {
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
