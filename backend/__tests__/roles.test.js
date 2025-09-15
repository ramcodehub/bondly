import request from 'supertest';
import express from 'express';
import rolesRoutes from '../src/routes/extended/roles.js';

// Mock Supabase client
jest.mock('../src/config/supabase.js', () => {
  const mockSupabase = {
    from: jest.fn(),
    auth: {
      getUser: jest.fn()
    }
  };
  
  // Add default mock return values
  mockSupabase.from.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis()
  });
  
  return mockSupabase;
});

const app = express();
app.use(express.json());

// Mock the auth middleware to bypass authentication for tests
jest.mock('../src/middleware/auth.js', () => {
  return {
    requireAuth: (req, res, next) => {
      // Mock a user for testing
      req.user = { id: 'test-user-id' };
      next();
    }
  };
});

// Mock the requireRole middleware to bypass role checks for tests
jest.mock('../src/middleware/requireRole.js', () => {
  return {
    requireRole: () => (req, res, next) => {
      next();
    }
  };
});

app.use('/api/extended/roles', rolesRoutes);

describe('Roles API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/extended/roles', () => {
    it('should return list of roles', async () => {
      const mockRoles = [
        { id: 1, name: 'Admin', description: 'Full access' },
        { id: 2, name: 'User', description: 'Standard user' }
      ];

      // Mock Supabase response
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: mockRoles,
          error: null
        })
      });

      const res = await request(app)
        .get('/api/extended/roles')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockRoles);
    });

    it('should handle errors when fetching roles', async () => {
      // Mock Supabase error
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Database error')
        })
      });

      const res = await request(app)
        .get('/api/extended/roles')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/extended/roles/settings', () => {
    it('should return RBAC settings', async () => {
      const mockSettings = { id: 1, enforce_roles: true };

      // Mock Supabase response
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue({
            data: mockSettings,
            error: null
          })
        })
      });

      const res = await request(app)
        .get('/api/extended/roles/settings')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockSettings);
    });

    it('should return default settings if none exist', async () => {
      // Mock Supabase response with no settings
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue({
            data: null,
            error: null
          })
        })
      });

      const res = await request(app)
        .get('/api/extended/roles/settings')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({ enforce_roles: false });
    });
  });

  describe('PUT /api/extended/roles/settings', () => {
    it('should update RBAC settings', async () => {
      const updatedSettings = { id: 1, enforce_roles: false };

      // Mock Supabase response
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue({
          data: [{ id: 1 }],
          error: null
        })
      }).mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({
          data: updatedSettings,
          error: null
        })
      });

      const res = await request(app)
        .put('/api/extended/roles/settings')
        .set('Authorization', 'Bearer valid-token')
        .send({ enforce_roles: false });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(updatedSettings);
    });

    it('should create RBAC settings if none exist', async () => {
      const newSettings = { id: 1, enforce_roles: true };

      // Mock Supabase response
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue({
          data: [],
          error: null
        })
      }).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({
          data: newSettings,
          error: null
        })
      });

      const res = await request(app)
        .put('/api/extended/roles/settings')
        .set('Authorization', 'Bearer valid-token')
        .send({ enforce_roles: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(newSettings);
    });
  });

  describe('GET /api/extended/roles/audit', () => {
    it('should return role audit trail', async () => {
      const mockAuditTrail = [
        {
          id: 1,
          user_id: 'user1',
          role_id: 1,
          action: 'ASSIGNED',
          assigned_by: 'admin1',
          assigned_at: new Date().toISOString()
        }
      ];

      // Mock Supabase response
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: mockAuditTrail,
          error: null
        })
      });

      const res = await request(app)
        .get('/api/extended/roles/audit')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockAuditTrail);
    });
  });

  describe('POST /api/extended/roles', () => {
    it('should create a new role', async () => {
      const newRole = { name: 'Manager', description: 'Manager role' };
      const createdRole = { id: 3, ...newRole };

      // Mock Supabase response
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({
          data: createdRole,
          error: null
        })
      });

      const res = await request(app)
        .post('/api/extended/roles')
        .set('Authorization', 'Bearer valid-admin-token')
        .send(newRole);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(createdRole);
    });

    it('should return validation error for invalid input', async () => {
      const res = await request(app)
        .post('/api/extended/roles')
        .set('Authorization', 'Bearer valid-admin-token')
        .send({ name: '' }); // Empty name should fail validation

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/extended/roles/me', () => {
    it('should return roles for the current user', async () => {
      const userRoles = [
        { roles: { id: 1, name: 'Admin', description: 'Full access' } }
      ];

      // Mock Supabase response
      const supabase = await import('../src/config/supabase.js');
      supabase.default.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          data: userRoles,
          error: null
        })
      });

      const res = await request(app)
        .get('/api/extended/roles/me')
        .set('Authorization', 'Bearer valid-token');

      console.log('Response status:', res.status);
      console.log('Response body:', res.body);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });
});