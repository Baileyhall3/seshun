<template>
    <div class="working-days-form">
        <div v-for="(day, index) in localDays"
            :key="day.day_of_week"
            class="day-container"
        >
            <div class="day-header">
                <ion-checkbox v-model="day.enabled" @ionChange="toggleDay(index)"></ion-checkbox>
                <ion-label class="day-label">{{ day.day_name }}</ion-label>
            </div>

            <div v-if="day.enabled" class="time-inputs">
                <ion-item>
                    <ion-label position="stacked">Opening Time</ion-label>
                    <ion-input v-model="day.start_time" type="time" required></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="stacked">Closing Time</ion-label>
                    <ion-input v-model="day.end_time" type="time" required></ion-input>
                </ion-item>
            </div>

            <div v-else class="closed-indicator">
                <span>Closed</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IonItem, IonLabel, IonInput, IonCheckbox } from '@ionic/vue'
import type { WorkingDay } from '@/types/BusinessFormData'

interface Props {
    modelValue: WorkingDay[]
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// Default 7 days (fallback if parent doesn’t provide data)
const localDays = ref<WorkingDay[]>(props.modelValue ?? [])

// Keep parent in sync
watch(localDays, (val) => {
    emit('update:modelValue', val)
}, { deep: true })

watch(() => props.modelValue,
  (newVal) => {
    localDays.value = newVal ?? []
  },
  { deep: true, immediate: true }
)

// Ensure defaults when enabling a day
function toggleDay(index: number) {
    const day = localDays.value[index]
    if (day.enabled && (!day.start_time || !day.end_time)) {
        day.start_time = '09:00'
        day.end_time = '17:00'
    }
}
</script>

<style scoped>
.day-container {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.day-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.day-label {
  margin-left: 12px;
  font-weight: 500;
  font-size: 16px;
}

.time-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.time-inputs ion-item {
  margin-bottom: 0;
}

.closed-indicator {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 12px;
}

ion-button {
  height: 48px;
  font-weight: 500;
}

@media (max-width: 480px) {
  .time-inputs {
    grid-template-columns: 1fr;
  }
}
</style>