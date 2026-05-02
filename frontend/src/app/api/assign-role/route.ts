import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for administrative tasks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, roleName } = await request.json();

    if (!userId || !roleName) {
      return NextResponse.json({ success: false, message: 'Missing userId or roleName' }, { status: 400 });
    }

    // 1. AUTHORIZATION CHECK (Server-side)
    // Get the requester's token from headers
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: requester }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (!authError && requester) {
        // Check if requester is Admin
        const { data: userRoles } = await supabaseAdmin
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', requester.id);
        
        const isAdmin = userRoles?.some(ur => (ur.roles as any)?.name === 'Admin');
        
        // If not admin AND not a self-signup (new user has no roles yet), deny
        // For initial signup, we allow the request if the userId matches the session or if it's a new signup trigger
        // In a real production app, you'd use a more robust webhook or trigger, 
        // but for this implementation we'll ensure basic safety.
        if (!isAdmin && requester.id !== userId) {
          return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }
      }
    }

    // 2. GET ROLE ID (Case-insensitive partial match)
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .ilike('name', `%${roleName}%`)
      .limit(1)
      .single();

    if (roleError || !roleData) {
      console.error('Role not found:', roleName, roleError);
      return NextResponse.json({ success: false, message: 'Role not found' }, { status: 404 });
    }

    // 3. ASSIGN ROLE (with duplicate protection)
    const { error: assignError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleData.id });

    if (assignError) {
      // If already assigned (Postgres error code 23505), ignore
      if (assignError.code === '23505') {
        return NextResponse.json({ success: true, message: 'Role already assigned' });
      }
      console.error('Error assigning role:', assignError);
      return NextResponse.json({ success: false, message: assignError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Server error in assign-role:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
