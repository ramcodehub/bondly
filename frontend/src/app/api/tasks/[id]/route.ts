import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

// GET /api/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        deals(name, amount, stage),
        leads(name, email, company),
        contacts(name, email, phone),
        companies(name, industry)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching task:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch task' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in task GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;
    const taskData = await request.json();

    // Validate required fields
    if (taskData.title && taskData.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title cannot be empty' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    // Only include fields that are provided
    if (taskData.title !== undefined) updateData.title = taskData.title.trim();
    if (taskData.description !== undefined) updateData.description = taskData.description?.trim() || null;
    if (taskData.due_date !== undefined) updateData.due_date = taskData.due_date || null;
    if (taskData.priority !== undefined) updateData.priority = taskData.priority;
    if (taskData.status !== undefined) updateData.status = taskData.status;
    if (taskData.deal_id !== undefined) updateData.deal_id = taskData.deal_id || null;
    if (taskData.lead_id !== undefined) updateData.lead_id = taskData.lead_id || null;
    if (taskData.contact_id !== undefined) updateData.contact_id = taskData.contact_id || null;
    if (taskData.account_id !== undefined) updateData.account_id = taskData.account_id || null;
    if (taskData.assigned_to !== undefined) updateData.assigned_to = taskData.assigned_to || null;
    if (taskData.estimated_hours !== undefined) updateData.estimated_hours = taskData.estimated_hours || null;
    if (taskData.actual_hours !== undefined) updateData.actual_hours = taskData.actual_hours || null;
    if (taskData.tags !== undefined) updateData.tags = taskData.tags || null;
    if (taskData.notes !== undefined) updateData.notes = taskData.notes?.trim() || null;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      console.error('Error updating task:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update task' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('Error in task PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete task' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Error in task DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Update task status only
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { id } = params;
    const { status } = await request.json();

    if (!status || !['todo', 'in_progress', 'done', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      console.error('Error updating task status:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update task status' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Task status updated successfully'
    });

  } catch (error) {
    console.error('Error in task PATCH API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}