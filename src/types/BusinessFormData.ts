export interface BusinessFormData {
    name: string;
    category_id: string;
    description: string;
    address_line1: string;
    address_line2: string;
    city: string;
    county: string;
    postal_code: string;
    country: string;
    default_currency: string;
    bg_colour: string;
    is_active_provider: boolean
}

export interface WorkingDay {
    day_name: string;
    day_of_week: number;
    enabled: boolean;
    start_time: string;
    end_time: string;
}

export interface SocialLinksFormData {
    twitter_url: string;
    instagram_url: string;
    facebook_url: string;
    other_url: string;
}