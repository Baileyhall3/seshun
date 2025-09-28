<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <div class="login-container">
        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              required
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              required
            ></ion-input>
          </ion-item>
          
          <ion-button
            expand="block"
            type="submit"
            :disabled="loading"
            class="ion-margin-top"
          >
            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
            <span v-else>Login</span>
          </ion-button>
          
          <ion-button
            expand="block"
            fill="clear"
            @click="goToRegister"
            class="ion-margin-top"
          >
            Don't have an account? Register
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonAlert
} from '@ionic/vue';
import { login } from '@/stores/userStore';

defineOptions({
  name: 'LoginPage'
});

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

onMounted(async () => {
  // Check for email verification tokens in URL
  const { access_token, refresh_token, type } = route.query;
  
  if (access_token && refresh_token && type === 'signup') {
    loading.value = true;
    try {
      // Set the session with the tokens from the email verification
      const { supabase } = await import('@/api/supabase');
      const { data, error } = await supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string
      });
      
      if (error) {
        showAlertMessage('Verification Failed', 'Email verification failed. Please try logging in manually.');
      } else if (data.user) {
        showAlertMessage('Email Verified!', 'Your email has been verified successfully. You can now access all features.');
        // Update the user store
        const { initializeAuth } = await import('@/stores/userStore');
        await initializeAuth();
        
        // Clear the URL parameters
        router.replace('/login');
        
        // Redirect to home after a short delay
        setTimeout(() => {
          router.push('/home');
        }, 2000);
      }
    } catch (error) {
      console.error('Email verification error:', error);
      showAlertMessage('Verification Error', 'An error occurred during email verification.');
    } finally {
      loading.value = false;
    }
  }
});

interface LoginFormData {
  email: string;
  password: string;
}

const formData = reactive<LoginFormData>({
  email: '',
  password: ''
});

const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    showAlertMessage('Error', 'Please fill in all fields.');
    return;
  }

  loading.value = true;

  try {
    const result = await login(formData.email, formData.password);

    if (!result.success) {
      showAlertMessage('Login Failed', result.error || 'Login failed');
    } else {
      showAlertMessage('Success', 'Login successful!');
      // Clear form
      resetForm();
      // Redirect to home page or dashboard
      router.push('/home');
    }
  } catch (error) {
    showAlertMessage('Error', 'An unexpected error occurred. Please try again.');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.email = '';
  formData.password = '';
};

const goToRegister = () => {
  router.push('/register');
};

const showAlertMessage = (header: string, message: string) => {
  alertHeader.value = header;
  alertMessage.value = message;
  showAlert.value = true;
};
</script>

<style scoped>
.login-container {
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
</style>
