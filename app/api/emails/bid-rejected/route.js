import { NextResponse } from 'next/server';
import { sendBidRejectedEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { contractorId, projectId } = await request.json();

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

    // Fetch project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    // Send email
    const result = await sendBidRejectedEmail(contractor, project);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in bid-rejected email API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
