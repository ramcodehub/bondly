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

describe('RBAC Audit API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
          assigned_at: new Date().toISOString(),
          notes: null,
          ip_address: '127.0.0.1',
          user_agent: 'test-agent'
        }
      ];

      // Mock Supabase response
      const supabase = require('../src/config/supabase.js');
      supabase.from.mockReturnValue({
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

    it('should handle errors when fetching audit trail', async () => {
      // Mock Supabase error
      const supabase = require('../src/config/supabase.js');
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Database error')
        })
      });

      const res = await request(app)
        .get('/api/extended/roles/audit')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/extended/roles/audit/users/:userId', () => {
    it('should return audit trail for a specific user', async () => {
      const userId = 'test-user-id';
      const mockUserAuditTrail = [
        {
          id: 1,
          user_id: userId,
          role_id: 1,
          action: 'ASSIGNED',
          assigned_by: 'admin1',
          assigned_at: new Date().toISOString()
        }
      ];

      // Mock Supabase response
      const supabase = require('../src/config/supabase.js');
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          data: mockUserAuditTrail,
          error: null
        }),
        order: jest.fn().mockReturnThis()
      });

      const res = await request(app)
        .get(`/api/extended/roles/audit/users/${userId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockUserAuditTrail);
    });

    it('should validate user ID parameter', async () => {
      const invalidUserId = 'invalid-id';

      const res = await request(app)
        .get(`/api/extended/roles/audit/users/${invalidUserId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Role Assignment Audit Logging', () => {
    it('should log audit event when assigning role', async () => {
      const userId = 'test-user-id';
      const roleId = 1;

      // Mock Supabase response for role assignment
      const supabase = require('../src/config/supabase.js');
      
      // Mock the user_roles insert response
      supabase.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnValue({
              data: {
                id: 1,
                roles: { id: roleId, name: 'Test Role', description: 'Test role' }
              },
              error: null
            })
          };
        } else if (table === 'role_audit') {
          return {
            insert: jest.fn().mockReturnThis()
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          update: jest.fn().mockReturnThis(),
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis()
        };
      });

      const res = await request(app)
        .post(`/api/extended/roles/users/${userId}`)
        .set('Authorization', 'Bearer valid-token')
        .send({ role_id: roleId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should log audit event when unassigning role', async () => {
      const userId = 'test-user-id';
      const roleId = 1;

      // Mock Supabase response for role unassignment
      const supabase = require('../src/config/supabase.js');
      
      // Mock the user_roles delete response
      supabase.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis()
          };
        } else if (table === 'role_audit') {
          return {
            insert: jest.fn().mockReturnThis()
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          update: jest.fn().mockReturnThis(),
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis()
        };
      });

      const res = await request(app)
        .delete(`/api/extended/roles/users/${userId}/${roleId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});