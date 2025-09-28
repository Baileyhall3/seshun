<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
    <div class="progress-steps">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="progress-step"
        :class="{
          'active': index === currentStep,
          'completed': index < currentStep,
          'upcoming': index > currentStep
        }"
      >
        <div class="step-circle">
          <ion-icon 
            v-if="index < currentStep" 
            :icon="checkmarkOutline"
            class="step-icon completed-icon"
          ></ion-icon>
          <span v-else class="step-number">{{ index + 1 }}</span>
        </div>
        <span class="step-label">{{ step }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { checkmarkOutline } from 'ionicons/icons';

interface Props {
  currentStep: number;
  steps: string[];
}

const props = defineProps<Props>();

const progressPercentage = computed(() => {
  return (props.currentStep / (props.steps.length - 1)) * 100;
});
</script>

<style scoped>
.progress-container {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3880ff, #5260ff);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
}

.progress-step.completed .step-circle {
  background-color: #10dc60;
  color: white;
}

.progress-step.active .step-circle {
  background-color: #3880ff;
  color: white;
}

.progress-step.upcoming .step-circle {
  background-color: #e0e0e0;
  color: #666;
}

.step-number {
  font-size: 14px;
  font-weight: bold;
}

.completed-icon {
  font-size: 18px;
}

.step-label {
  font-size: 12px;
  color: #666;
  max-width: 80px;
  line-height: 1.2;
}

.progress-step.active .step-label {
  color: #3880ff;
  font-weight: 500;
}

.progress-step.completed .step-label {
  color: #10dc60;
}

@media (max-width: 480px) {
  .step-label {
    font-size: 10px;
    max-width: 60px;
  }
  
  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .completed-icon {
    font-size: 16px;
  }
}
</style>
