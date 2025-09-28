<template>
    <ion-item>
        <ion-label position="stacked">Brand Color</ion-label>
        <div style="display: flex; align-items: center; width: 100%;">
            <ion-select
                :value="props.modelValue"
                interface="popover"
                placeholder="Select a color"
                style="flex: 1;"
                @ionChange="onChange"
            >
                <ion-select-option
                    v-for="color in brandColors"
                    :key="color.value"
                    :value="color.value"
                >
                    {{ color.label }}
                </ion-select-option>
            </ion-select>

            <!-- Preview -->
            <div
                v-if="props.modelValue"
                :style="{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: props.modelValue,
                    border: '1px solid #ccc',
                    marginLeft: '12px',
                    flexShrink: 0
                }"
            ></div>
        </div>
    </ion-item>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';

const props = defineProps<{
    modelValue: any
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const brandColors = [
    { label: "Blue", value: "#3880ff" },
    { label: "Green", value: "#3dc2ff" },
    { label: "Turquoise", value: "#0cd1e8" },
    { label: "Purple", value: "#7044ff" },
    { label: "Pink", value: "#f041ff" },
    { label: "Orange", value: "#ffce00" },
    { label: "Red", value: "#f04141" },
    { label: "Teal", value: "#10dc60" },
    { label: "Gray", value: "#92949c" }
]

function onChange(event: CustomEvent) {
    emit('update:modelValue', event.detail.value)
}
</script>