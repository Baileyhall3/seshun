import {
  initializeDataObjectManager,
  createDataObject
} from 'supabase-dataobject-core';

interface SupabaseConfig {
    url: string;
    key: string;
}

/**
 * Initializes all data objects to be used within the app. 
 * MUST stay in the current order, due to master-child bindings
 * @param url 
 * @param key 
 * @param currentUserId 
 */
export async function initDataObjects(url: string, key: string, currentUserId: string) {
    initializeDataObjectManager({
        supabaseConfig: { url, anonKey: key }
    });

    const userData = await createDataObject('user', {
        viewName: 'users_view',
        tableName: 'users',
        canInsert: false,
        canUpdate: true,
        canDelete: false,
        whereClauses: [
            { field: 'id', operator: 'equals', value: currentUserId }
        ],
        recordLimit: 1
    });

    if (userData?.currentRecord?.business_id) {
        // my_business tables
        await createDataObject('my_business', {
            viewName: 'businesses_view',
            tableName: 'businesses',
            canInsert: false,
            canUpdate: true,
            canDelete: false,
            masterDataObjectBinding: {
                masterDataObjectId: 'user',
                childBindingField: 'owner_id',
                masterBindingField: 'id'
            },
            recordLimit: 1
        });

        // Consider moving to business dashboard page...
        await createDataObject('my_business_social_links', {
            viewName: 'business_social_links',
            tableName: 'business_social_links',
            canInsert: false,
            canUpdate: true,
            canDelete: false,
            masterDataObjectBinding: {
                masterDataObjectId: 'my_business',
                childBindingField: 'business_id',
                masterBindingField: 'id'
            },
            recordLimit: 1
        });
    
        await createDataObject('my_business_working_times', {
            viewName: 'business_working_times_view',
            tableName: 'business_working_times',
            canInsert: true,
            canUpdate: true,
            canDelete: true,
            sort: { field: 'day_of_week', direction: 'asc' },
            masterDataObjectBinding: {
                masterDataObjectId: 'my_business',
                childBindingField: 'business_id',
                masterBindingField: 'id'
            },
            recordLimit: 7
        });
    
        await createDataObject('my_business_participants', {
            viewName: 'business_participants_view',
            tableName: 'business_participants',
            canInsert: true,
            canUpdate: true,
            canDelete: true,
            sort: { field: 'created_at', direction: 'asc' },
            masterDataObjectBinding: {
                masterDataObjectId: 'my_business',
                childBindingField: 'business_id',
                masterBindingField: 'id'
            }
        });
    }
}