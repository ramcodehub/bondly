import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

// GET /api/deals/[id] - Get single deal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;

    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        leads(name, email, phone, company),
        contacts(name, email, phone),
        accounts(name, industry),
        tasks(id, title, status, priority, due_date)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Deal not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching deal:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch deal' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in deal GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/deals/[id] - Update deal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;
    const dealData = await request.json();

    // Validate required fields
    if (dealData.name && dealData.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Deal name cannot be empty' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    // Only include fields that are provided
    if (dealData.name !== undefined) updateData.name = dealData.name.trim();
    if (dealData.amount !== undefined) updateData.amount = dealData.amount;
    if (dealData.stage !== undefined) updateData.stage = dealData.stage;
    if (dealData.probability !== undefined) updateData.probability = dealData.probability;
    if (dealData.close_date !== undefined) updateData.close_date = dealData.close_date || null;
    if (dealData.description !== undefined) updateData.description = dealData.description?.trim() || null;
    if (dealData.lead_id !== undefined) updateData.lead_id = dealData.lead_id || null;
    if (dealData.contact_id !== undefined) updateData.contact_id = dealData.contact_id || null;
    if (dealData.account_id !== undefined) updateData.account_id = dealData.account_id || null;
    if (dealData.owner_id !== undefined) updateData.owner_id = dealData.owner_id || null;
    if (dealData.deal_source !== undefined) updateData.deal_source = dealData.deal_source?.trim() || null;
    if (dealData.competitors !== undefined) updateData.competitors = dealData.competitors;
    if (dealData.next_step !== undefined) updateData.next_step = dealData.next_step?.trim() || null;

    const { data, error } = await supabase
      .from('deals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Deal not found' },
          { status: 404 }
        );
      }
      
      console.error('Error updating deal:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update deal' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Deal updated successfully'
    });

  } catch (error) {
    console.error('Error in deal PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/deals/[id] - Delete deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;

    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting deal:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete deal' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully'
    });

  } catch (error) {
    console.error('Error in deal DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}