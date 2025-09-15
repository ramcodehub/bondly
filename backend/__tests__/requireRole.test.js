import { requireRole } from '../src/middleware/requireRole.js';

// Mock Supabase client
jest.mock('../src/config/supabase.js', () => {
  const mockSupabase = {
    from: jest.fn()
  };
  
  // Add default mock return values
  mockSupabase.from.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis()
  });
  
  return mockSupabase;
});

describe('requireRole Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 'user-123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() if user has required role', async () => {
    // Mock Supabase response with matching role
    const supabase = require('../src/config/supabase.js');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        data: [
          { roles: { name: 'Admin' } }
        ],
        error: null
      })
    });

    const middleware = requireRole('Admin');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have required role', async () => {
    // Mock Supabase response with different role
    const supabase = require('../src/config/supabase.js');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        data: [
          { roles: { name: 'User' } }
        ],
        error: null
      })
    });

    const middleware = requireRole('Admin');
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Insufficient permissions'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', async () => {
    req.user = undefined;

    const middleware = requireRole('Admin');
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication required'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    // Mock Supabase error
    const supabase = require('../src/config/supabase.js');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        data: null,
        error: new Error('Database error')
      })
    });

    const middleware = requireRole('Admin');
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Failed to verify permissions',
      error: 'Database error'
    });
    expect(next).not.toHaveBeenCalled();
  });
});