import { NextResponse } from 'next/server';
import { sendBidAcceptedEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { contractorId, projectId, bidId } = await request.json();

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch contractor details
    const { data: contractor, error: contractorError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', contractorId)
      .single();

    if (contractorError) throw contractorError;

    // Fetch project details with builder info
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        builder:builder_id (
          full_name,
          company_name,
          phone
        )
      `)
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    // Fetch bid details
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('id', bidId)
      .single();

    if (bidError) throw bidError;

    // Prepare project data for email
    const projectData = {
      ...project,
      builder_name: project.builder?.company_name || project.builder?.full_name || 'Builder',
      builder_phone: project.builder?.phone
    };

    // Send email
    const result = await sendBidAcceptedEmail(contractor, projectData, bid);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in bid-accepted email API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
