import { NextResponse } from 'next/server';
import { sendBidReceivedEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { builderId, projectId, bidId } = await request.json();

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch builder details
    const { data: builder, error: builderError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', builderId)
      .single();

    if (builderError) throw builderError;

    // Fetch project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    // Fetch bid details with contractor info
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select(`
        *,
        contractor:contractor_id (
          full_name,
          company_name
        )
      `)
      .eq('id', bidId)
      .single();

    if (bidError) throw bidError;

    // Prepare bid data for email
    const bidData = {
      ...bid,
      contractor_name: bid.contractor?.company_name || bid.contractor?.full_name || 'Contractor'
    };

    // Send email
    const result = await sendBidReceivedEmail(builder, project, bidData);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in bid-received email API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
