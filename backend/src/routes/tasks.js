import express from 'express';
import supabase from '../config/supabase.js';
import { asyncHandler, createValidationError, createNotFoundError } from '../middleware/errorHandler.js';
import { sanitizeInput } from '../middleware/validation.js';
import { optimizedQueries } from '../middleware/databaseOptimizer.js';

const router = express.Router();

// Validation rules for tasks
const validateTask = (req, res, next) => {
  const { title, priority, status, estimated_hours, actual_hours } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Task title is required' });
  }
  
  if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }
  
  if (status && !['todo', 'in_progress', 'done', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  if (estimated_hours !== undefined && (isNaN(estimated_hours) || estimated_hours < 0)) {
    return res.status(400).json({ error: 'Estimated hours must be a valid positive number' });
  }
  
  if (actual_hours !== undefined && (isNaN(actual_hours) || actual_hours < 0)) {
    return res.status(400).json({ error: 'Actual hours must be a valid positive number' });
  }
  
  next();
};

// GET /api/tasks - Get all tasks
router.get('/', asyncHandler(async (req, res) => {
  const { status, priority, assigned_to, deal_id, due_date, limit = 100, offset = 0 } = req.query;
  
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
  query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0,
    pagination: {
      offset: parseInt(offset),
      limit: parseInt(limit)
    }
  });
}));

// GET /api/tasks/:id - Get single task
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      deals(name, amount, stage),
      leads(first_name, last_name, email, company),
      contacts(name, email, phone),
      companies(name, industry)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw createNotFoundError('Task not found');
    }
    throw new Error(`Failed to fetch task: ${error.message}`);
  }

  res.json({
    success: true,
    data
  });
}));

// POST /api/tasks - Create new task
router.post('/', sanitizeInput, validateTask, asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    due_date, 
    priority = 'medium', 
    status = 'todo',
    deal_id,
    lead_id,
    contact_id,
    company_id,
    assigned_to,
    created_by,
    estimated_hours,
    actual_hours,
    tags,
    notes
  } = req.body;

  const taskData = {
    title: title.trim(),
    description: description?.trim() || null,
    due_date: due_date || null,
    priority,
    status,
    deal_id: deal_id || null,
    lead_id: lead_id || null,
    contact_id: contact_id || null,
    company_id: company_id || null,
    assigned_to: assigned_to || null,
    created_by: created_by || null,
    estimated_hours: estimated_hours || null,
    actual_hours: actual_hours || null,
    tags: tags || null,
    notes: notes?.trim() || null
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  res.status(201).json({
    success: true,
    data,
    message: 'Task created successfully'
  });
}));

// PUT /api/tasks/:id - Update task
router.put('/:id', sanitizeInput, validateTask, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    due_date, 
    priority, 
    status,
    deal_id,
    lead_id,
    contact_id,
    company_id,
    assigned_to,
    estimated_hours,
    actual_hours,
    tags,
    notes
  } = req.body;

  const updateData = {
    title: title?.trim(),
    description: description?.trim() || null,
    due_date: due_date || null,
    priority,
    status,
    deal_id: deal_id || null,
    lead_id: lead_id || null,
    contact_id: contact_id || null,
    company_id: company_id || null,
    assigned_to: assigned_to || null,
    estimated_hours: estimated_hours || null,
    actual_hours: actual_hours || null,
    tags: tags || null,
    notes: notes?.trim() || null
  };

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw createNotFoundError('Task not found');
    }
    throw new Error(`Failed to update task: ${error.message}`);
  }

  res.json({
    success: true,
    data,
    message: 'Task updated successfully'
  });
}));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }

  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
}));

// PATCH /api/tasks/:id/status - Update task status only
router.patch('/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['todo', 'in_progress', 'done', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw createNotFoundError('Task not found');
    }
    throw new Error(`Failed to update task status: ${error.message}`);
  }

  res.json({
    success: true,
    data,
    message: 'Task status updated successfully'
  });
}));

// GET /api/tasks/stats/summary - Get tasks summary stats
router.get('/stats/summary', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('status, priority, estimated_hours, actual_hours');

  if (error) {
    throw new Error(`Failed to fetch task stats: ${error.message}`);
  }

  const stats = {
    total_tasks: data.length,
    by_status: {},
    by_priority: {},
    total_estimated_hours: data.reduce((sum, task) => sum + (task.estimated_hours || 0), 0),
    total_actual_hours: data.reduce((sum, task) => sum + (task.actual_hours || 0), 0)
  };

  // Calculate status breakdown
  data.forEach(task => {
    if (!stats.by_status[task.status]) {
      stats.by_status[task.status] = 0;
    }
    stats.by_status[task.status]++;
    
    if (!stats.by_priority[task.priority]) {
      stats.by_priority[task.priority] = 0;
    }
    stats.by_priority[task.priority]++;
  });

  res.json({
    success: true,
    data: stats
  });
}));

// GET /api/tasks/overdue - Get overdue tasks
router.get('/overdue', asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      deals(name, amount, stage),
      leads(name, email, company),
      contacts(name, email, phone)
    `)
    .lt('due_date', today)
    .neq('status', 'done')
    .neq('status', 'cancelled')
    .order('due_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch overdue tasks: ${error.message}`);
  }

  res.json({
    success: true,
    data: data || [],
    count: data?.length || 0
  });
}));

export default router;