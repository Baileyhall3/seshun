<template>
    <div class="business-card-container">
        <ion-card class="business-card" :style="{ background: props.bgColor }">
            <div class="business-card-content">
                <div class="business-card-text">
                    <div class="flex items-center">
                        <ion-icon :icon="briefcaseOutline" class="business-icon"></ion-icon>
                        <h2 class="business-title">{{ props.name }}</h2>
                    </div>

                    <p class="business-subtitle">
                        {{ props.category }}
                    </p>

                    <ion-button
                        expand="block"
                        color="light"
                        class="business-button"
                        @click="goToBusiness"
                    >
                        Business Page
                        <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
                    </ion-button>
                </div>
            </div>
        </ion-card>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IonCard, IonButton, IonIcon } from '@ionic/vue'
import { briefcaseOutline } from 'ionicons/icons';

export interface IProps {
    id: string;
    name: string;
    category: string;
    bgColor: string;
    telephoneNo?: string;
    iconUrl?: string;
}
const props = defineProps<IProps>();

const router = useRouter();

function goToBusiness() {

    // router.push('/business-setup/step1')
};
</script>

<style scoped>
/* .business-card-container {
    margin: 2rem 1rem;
} */

.business-card {
    color: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.business-card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    gap: 1rem;
}

.business-card-text {
    flex: 1;
}

.business-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #fff;
}

.business-title {
    font-size: 1.8rem;
    margin: 0 0 0 0.5rem;
    font-weight: bold;
}

.business-subtitle {
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 1.5rem;
}

.business-button {
    --background: #fff;
    --color: #ff7e5f;
    font-weight: bold;
    border-radius: 1rem;
}

.business-card-image img {
    width: 140px;
    height: auto;
    object-fit: contain;
}
</style>
