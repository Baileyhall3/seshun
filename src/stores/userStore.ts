import { ref, computed, readonly } from 'vue';
import { supabase, auth, users } from '@/api/supabase';
import { initDataObjects } from '@/dataObjects/dataObjects';

// Reactive state
const user = ref<any>(null);
const userProfile = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Computed properties
export const isAuthenticated = computed(() => {
  return !!user.value && user.value.email_confirmed_at !== null;
});
export const isBusinessOwner = computed(() => userProfile.value?.is_business_owner || false);
export const userEmail = computed(() => user.value?.email || '');
export const userName = computed(() => {
  if (userProfile.value) {
    return `${userProfile.value.first_name} ${userProfile.value.last_name}`.trim();
  }
  return '';
});
export const isEmailVerified = computed(() => !!user.value?.email_confirmed_at);

// Actions
export const initializeAuth = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { user: currentUser, error: authError } = await auth.getCurrentUser();
    
    if (authError) {
      console.error('Auth initialization error:', authError);
      error.value = authError.message;
      user.value = null;
      userProfile.value = null;
      return false;
    }

    if (currentUser) {
      user.value = currentUser;
      await initDataObjects(supabaseUrl, supabasePublishableKey, currentUser.id)

      await loadUserProfile(currentUser.id);
      return true;
    } else {
      user.value = null;
      userProfile.value = null;
      return false;
    }
  } catch (err: any) {
    console.error('Auth initialization error:', err);
    error.value = err.message || 'Authentication failed';
    user.value = null;
    userProfile.value = null;
    return false;
  } finally {
    loading.value = false;
  }
};

export const loadUserProfile = async (userId: string) => {
  try {
    const { data: profile, error: profileError } = await users.getProfile(userId);
    
    if (profileError) {
      console.error('Error loading user profile:', profileError);
      // Don't set error here as user might not have a profile yet
      userProfile.value = null;
    } else {
      userProfile.value = profile;
    }
  } catch (err) {
    console.error('Error loading user profile:', err);
    userProfile.value = null;
  }
};

export const login = async (email: string, password: string) => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: loginError } = await auth.signIn(email, password);

    if (loginError) {
      error.value = loginError.message;
      return { success: false, error: loginError.message };
    }

    if (data.user) {
      user.value = data.user;
      await loadUserProfile(data.user.id);
      return { success: true };
    }

    return { success: false, error: 'Login failed' };
  } catch (err: any) {
    error.value = err.message || 'Login failed';
    return { success: false, error: err.message || 'Login failed' };
  } finally {
    loading.value = false;
  }
};

export const register = async (
  email: string,
  password: string,
  userData: {
    first_name: string;
    last_name: string;
    dob?: string;
    gender?: string;
    is_business_owner?: boolean;
    display_name?: string;
  }
) => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: registerError } = await auth.signUp(email, password, userData);

    if (registerError) {
      error.value = registerError.message;
      return { success: false, error: registerError.message };
    }

    if (data.user) {
      user.value = data.user;

      try {
        // const { supabase } = await import('@/api/supabase');

        // Insert into users table
        const { error: userInsertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            dob: userData.dob || null,
            gender: userData.gender || null,
            is_business_owner: userData.is_business_owner || false,
            display_name: userData.display_name,
            password_hash: 'managed_by_supabase_auth'
          });

        if (userInsertError) {
          console.warn('Failed to create user record:', userInsertError);
        }
      } catch (dbError) {
        console.warn('Database operations failed during registration:', dbError);
      }

      return { success: true };
    }

    return { success: false, error: 'Registration failed' };
  } catch (err: any) {
    error.value = err.message || 'Registration failed';
    return { success: false, error: err.message || 'Registration failed' };
  } finally {
    loading.value = false;
  }
};

export const logout = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { error: logoutError } = await auth.signOut();
    
    if (logoutError) {
      error.value = logoutError.message;
      return { success: false, error: logoutError.message };
    }

    // Clear user data
    user.value = null;
    userProfile.value = null;
    
    return { success: true };
  } catch (err: any) {
    error.value = err.message || 'Logout failed';
    return { success: false, error: err.message || 'Logout failed' };
  } finally {
    loading.value = false;
  }
};

// Update user profile
export async function updateProfile(userId: string, updates: Partial<{
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    is_business_owner: boolean;
    display_name: string;
  }>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (!error) { refreshUserProfile(); }
    return { data, error };
  }

export const refreshUserProfile = async () => {
  if (!user.value) return;
  await loadUserProfile(user.value.id);
};

export const clearError = () => {
  error.value = null;
};

// Export reactive state for direct access
export const userStore = {
  user: readonly(user),
  userProfile: readonly(userProfile),
  loading: readonly(loading),
  error: readonly(error),
  isAuthenticated,
  isBusinessOwner,
  isEmailVerified,
  userEmail,
  userName
};

// Export individual refs for convenience
export { user, userProfile, loading, error };
