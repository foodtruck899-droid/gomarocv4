import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🧹 Starting cleanup of expired bookings...');

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Find bookings that are pending and older than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: expiredBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id, trip_id, total_price')
      .eq('booking_status', 'pending')
      .lt('created_at', twentyFourHoursAgo);

    if (fetchError) {
      console.error('❌ Error fetching expired bookings:', fetchError);
      throw fetchError;
    }

    if (!expiredBookings || expiredBookings.length === 0) {
      console.log('✅ No expired bookings found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No expired bookings found',
          deleted_count: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`🔍 Found ${expiredBookings.length} expired bookings to cleanup`);

    // Group bookings by trip_id to update available seats efficiently
    const tripUpdates = new Map<string, number>();
    
    for (const booking of expiredBookings) {
      const currentCount = tripUpdates.get(booking.trip_id) || 0;
      tripUpdates.set(booking.trip_id, currentCount + 1);
    }

    // Delete expired bookings
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('booking_status', 'pending')
      .lt('created_at', twentyFourHoursAgo);

    if (deleteError) {
      console.error('❌ Error deleting expired bookings:', deleteError);
      throw deleteError;
    }

    console.log(`🗑️ Deleted ${expiredBookings.length} expired bookings`);

    // Update available seats for affected trips
    for (const [tripId, seatsToAdd] of tripUpdates) {
      const { error: updateError } = await supabase
        .rpc('increment_available_seats', {
          trip_id: tripId,
          seats_to_add: seatsToAdd
        });

      if (updateError) {
        console.error(`❌ Error updating seats for trip ${tripId}:`, updateError);
        // Continue with other trips even if one fails
      } else {
        console.log(`🪑 Added ${seatsToAdd} seats back to trip ${tripId}`);
      }
    }

    const totalDeleted = expiredBookings.length;
    console.log(`✅ Cleanup completed: ${totalDeleted} bookings deleted`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully deleted ${totalDeleted} expired bookings`,
        deleted_count: totalDeleted,
        trips_updated: tripUpdates.size
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});