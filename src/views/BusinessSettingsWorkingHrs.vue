<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Business Working Times</ion-title>
            </ion-toolbar>
        </ion-header>
        
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Business Working Times</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="app-container">
                <div v-if="loading" class="loading-container">
                    <ion-spinner name="crescent"></ion-spinner>
                    <p>Loading your business...</p>
                </div>
                
                <div v-else-if="workingTimesEdits" class="setup-container">
                    <div class="step-header">
                        <h2>Working Times</h2>
                        <p>Set your business operating hours</p>
                    </div>
                    <form @submit.prevent="hanldeEditWorkingTimes">
                        <WorkingTimes v-model="workingTimesEdits" />
    
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
                </div>
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
import { ref, computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonSpinner
} from '@ionic/vue'
import { getDataObjectById } from 'supabase-dataobject-core';
import WorkingTimes from '@/components/input/BusinessWorkingTimes.vue';
import { onIonViewDidEnter } from '@ionic/vue';
import type { WorkingDay } from '@/types/BusinessFormData';
import appUtils from '@/utils/AppUtils';

const businessDs = getDataObjectById('my_business');
const businessWorkingTimesDs = getDataObjectById('my_business_working_times');

const loading = ref<boolean>(false);
const workingTimesEdits = ref<Array<WorkingDay>>();
const showAlert = ref(false);
const alertHeader = ref('');
const alertMessage = ref('');

onIonViewDidEnter(() => {
    if (businessWorkingTimesDs?.data) {
        workingTimesEdits.value = cloneWorkingTimes(businessWorkingTimesDs.data)
    }
});

const hasChanges = computed(() => {
    if (!workingTimesEdits.value) return false
    return workingTimesEdits.value.some(wt => {
        const currentWt = businessWorkingTimesDs?.data.find(x => x.id === wt.id)
        return currentWt ? !workingDayEquals(wt, currentWt) : true
    });
});

function cloneWorkingTimes(arr: WorkingDay[]): WorkingDay[] {
     return arr.map(d => ({ ...d })) // shallow copy each object
}

const cancelChanges = () => {
    if (businessWorkingTimesDs?.data) {
        workingTimesEdits.value = cloneWorkingTimes(businessWorkingTimesDs.data)
    }
}; 

async function hanldeEditWorkingTimes() {
    // add validation
    try {
        loading.value = true
        const promises: Promise<any>[] = []

        workingTimesEdits.value?.forEach(wt => {
            const currentWt = businessWorkingTimesDs?.data.find(x => x.id === wt.id)
            if (currentWt && !workingDayEquals(wt, currentWt)) {
                const updates = {
                    day_of_week: wt.day_of_week,
                    start_time: wt.start_time,
                    end_time: wt.end_time,
                    enabled: wt.enabled
                }
                promises.push(businessWorkingTimesDs?.update(wt.id, updates))
            }
        });

        if (promises.length === 0) {
            showAlertMessage('No Changes', 'No updates were needed');
            return;
        }

        await Promise.all(promises);

        showAlertMessage('Update Successful', 'Working times were updated successfully')
        appUtils.goTo('/business-settings')
    } catch (err) {
        console.error(err)
        showAlertMessage('Update Failed', err instanceof Error ? err.message : String(err))
    } finally {
        loading.value = false
    }
}


function workingDayEquals(a: WorkingDay, b: WorkingDay): boolean {
    return (
        a.day_of_week === b.day_of_week &&
        a.enabled === b.enabled &&
        a.start_time === b.start_time &&
        a.end_time === b.end_time
    )
}

const showAlertMessage = (header: string, message: string) => {
    alertHeader.value = header;
    alertMessage.value = message;
    showAlert.value = true;
};
</script>

<style scoped>
.setup-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.step-header {
    text-align: center;
    margin-bottom: 30px;
}
</style>