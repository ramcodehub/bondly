import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export const dynamic = "force-dynamic";

// GET /api/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assigned_to = searchParams.get('assigned_to');
    const deal_id = searchParams.get('deal_id');
    const due_date = searchParams.get('due_date');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('tasks')
      .select(`
        *,
        deals(name, amount, stage),
        leads(first_name, last_name, email, company),
        contacts(name, email, phone),
        companies(name, industry)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (priority) {
      query = query.eq('priority', priority);
    }
    
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }
    
    if (deal_id) {
      query = query.eq('deal_id', deal_id);
    }
    
    if (due_date) {
      query = query.eq('due_date', due_date);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch tasks' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in tasks API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const taskData = await request.json();

    // Validate required fields
    if (!taskData.title || taskData.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    // Set defaults
    const task = {
      title: taskData.title.trim(),
      description: taskData.description?.trim() || null,
      due_date: taskData.due_date || null,
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      deal_id: taskData.deal_id || null,
      lead_id: taskData.lead_id || null,
      contact_id: taskData.contact_id || null,
      company_id: taskData.company_id || null,
      assigned_to: taskData.assigned_to || null,
      created_by: taskData.created_by || null,
      estimated_hours: taskData.estimated_hours || null,
      actual_hours: taskData.actual_hours || null,
      tags: taskData.tags || null,
      notes: taskData.notes?.trim() || null
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create task' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Task created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in tasks POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}