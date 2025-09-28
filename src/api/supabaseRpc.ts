import { supabase } from "./supabase";

export async function runRpc<TName extends keyof RpcDefinitions>(
    name: TName,
    args: RpcDefinitions[TName]["args"]
): Promise<{
    data: RpcDefinitions[TName]["returns"] | null;
    error: Error | null;
}> {
    const { data, error } = await supabase.rpc(
        name as string,
        args as Record<string, unknown>
    );

    return {
        data: data as RpcDefinitions[TName]["returns"] | null,
        error: error ? new Error(`RPC ${String(name)} failed: ${error.message}`) : null,
    };
}

/**
 * Supabase RPCs for associated project
 */
export type RpcDefinitions = {
    create_business: {
        args: {
            p_name: string;
            p_category_id: string | null;
            p_description: string | null;
            p_bg_colour: string | null;
            p_default_currency: string | null;
            p_address_line1: string;
            p_address_line2: string | null;
            p_city: string;
            p_county: string | null;
            p_postal_code: string;
            p_country: string;
            p_twitter_url: string | null;
            p_instagram_url: string | null;
            p_facebook_url: string | null;
            p_other_url: string | null;
            p_is_active_provider: boolean;
            p_working_times: {
                day_of_week: number;
                start_time: string; // "HH:mm"
                end_time: string;   // "HH:mm"
            }[];
        };
        returns: string; // uuid of the business
    };

    // another_procedure: {
    //     args: { foo: string; bar: number };
    //     returns: { success: boolean };
    // };
};