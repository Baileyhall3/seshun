import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Auth functions
export const auth = {
  // Sign up new user
  async signUp(email: string, password: string, userData: { first_name: string; last_name: string; dob?: string; gender?: string; is_business_owner?: boolean; display_name?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    return { data, error };
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};

// Database functions for users table
export const users = {
  // Get user profile by ID
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<{
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
    return { data, error };
  }
};

// Database functions for user_profiles table
export const userProfiles = {
  // Create user profile
  async createProfile(userId: string, profileData: {
    display_name?: string;
    profile_picture_url?: string;
  }) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...profileData
      })
      .select()
      .single();
    return { data, error };
  },

  // Get user profile by user ID
  async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Delete user profile
  async deleteProfile(userId: string) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);
    return { error };
  }
};

// Database functions for business categories
export const businessCategories = {
  // Get all business categories
  async getAll() {
    const { data, error } = await supabase
      .from('business_categories')
      .select('*')
      .order('name');
    return { data, error };
  }
};

// Database functions for business roles
export const businessRoles = {
  // Get all business roles
  async getAll() {
    const { data, error } = await supabase
      .from('business_roles')
      .select('*');
    return { data, error };
  },

  // Get owner role
  async getOwnerRole() {
    const { data, error } = await supabase
      .from('business_roles')
      .select('*')
      .eq('role', 'Owner')
      .single();
    return { data, error };
  }
};

// Database functions for businesses table
export const businesses = {
  // Create business
  async create(businessData: {
    name: string;
    owner_id: string;
    category_id: string;
    description?: string;
    bg_colour?: string;
    default_currency?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    county?: string;
    postal_code?: string;
    country: string;
    latitude?: string;
    longitude?: string;
  }) {
    const { data, error } = await supabase
      .from('businesses')
      .insert(businessData)
      .select()
      .single();
    return { data, error };
  },

  // Get business by owner ID
  async getByOwnerId(ownerId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        business_categories (
          id,
          name
        )
      `)
      .eq('owner_id', ownerId)
      .single();
    return { data, error };
  },

  // Update business
  async update(businessId: string, updates: Partial<{
    name: string;
    category_id: string;
    description: string;
    bg_colour: string;
    default_currency: string;
    address_line1: string;
    address_line2: string;
    city: string;
    county: string;
    postal_code: string;
    country: string;
    latitude: string;
    longitude: string;
  }>) {
    const { data, error } = await supabase
      .from('businesses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', businessId)
      .select()
      .single();
    return { data, error };
  }
};

// Database functions for business working times
export const businessWorkingTimes = {
  // Create working times
  async create(workingTimes: Array<{
    business_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>) {
    const { data, error } = await supabase
      .from('business_working_times')
      .insert(workingTimes)
      .select();
    return { data, error };
  },

  // Get working times by business ID
  async getByBusinessId(businessId: string) {
    const { data, error } = await supabase
      .from('business_working_times')
      .select('*')
      .eq('business_id', businessId)
      .order('day_of_week');
    return { data, error };
  },

  // Update working times
  async update(businessId: string, workingTimes: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>) {
    // Delete existing working times
    await supabase
      .from('business_working_times')
      .delete()
      .eq('business_id', businessId);

    // Insert new working times
    const workingTimesWithBusinessId = workingTimes.map(wt => ({
      ...wt,
      business_id: businessId
    }));

    const { data, error } = await supabase
      .from('business_working_times')
      .insert(workingTimesWithBusinessId)
      .select();
    return { data, error };
  }
};

// Database functions for business social links
export const businessSocialLinks = {
  // Create social links
  async create(socialLinksData: {
    business_id: string;
    twitter_url?: string;
    instagram_url?: string;
    facebook_url?: string;
    other_url?: string;
  }) {
    const { data, error } = await supabase
      .from('business_social_links')
      .insert(socialLinksData)
      .select()
      .single();
    return { data, error };
  },

  // Get social links by business ID
  async getByBusinessId(businessId: string) {
    const { data, error } = await supabase
      .from('business_social_links')
      .select('*')
      .eq('business_id', businessId)
      .single();
    return { data, error };
  },

  // Update social links
  async update(businessId: string, updates: Partial<{
    twitter_url: string;
    instagram_url: string;
    facebook_url: string;
    other_url: string;
  }>) {
    const { data, error } = await supabase
      .from('business_social_links')
      .update(updates)
      .eq('business_id', businessId)
      .select()
      .single();
    return { data, error };
  }
};

// Database functions for business participants
export const businessParticipants = {
  // Create participant
  async create(participantData: {
    business_id: string;
    user_id: string;
    role_id: string;
  }) {
    const { data, error } = await supabase
      .from('business_participants')
      .insert(participantData)
      .select()
      .single();
    return { data, error };
  },

  // Get participants by business ID
  async getByBusinessId(businessId: string) {
    const { data, error } = await supabase
      .from('business_participants')
      .select(`
        *,
        users (
          id,
          first_name,
          last_name,
          email
        ),
        business_roles (
          id,
          role,
          description
        )
      `)
      .eq('business_id', businessId);
    return { data, error };
  }
};
