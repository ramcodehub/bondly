import request from 'supertest';
import express from 'express';
import cors from 'cors';
import leadsRoutes from '../src/routes/leads.js';

// Mock Supabase
jest.mock('../src/config/supabase.js', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      order: jest.fn(() => Promise.resolve({
        data: [
          {
            id: 1,
            name: 'Test Lead',
            company: 'Test Company',
            email: 'test@example.com',
            phone: '123-456-7890',
            lead_owner: 'Test Owner',
            lead_source: 'Website'
          }
        ],
        error: null
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({
        data: [{
          id: 2,
          name: 'New Lead',
          company: 'New Company',
          email: 'new@example.com',
          phone: '987-654-3210',
          lead_owner: 'Test Owner',
          lead_source: 'Referral'
        }],
        error: null
      }))
    }))
  }))
}));

describe('Leads API', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/leads', leadsRoutes);
  });

  describe('GET /api/leads', () => {
    it('should return all leads', async () => {
      const response = await request(app).get('/api/leads');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Test Lead');
    });
  });

  describe('POST /api/leads', () => {
    it('should create a new lead', async () => {
      const newLead = {
        name: 'New Lead',
        company: 'New Company',
        email: 'new@example.com',
        phone: '987-654-3210',
        lead_owner: 'Test Owner',
        lead_source: 'Referral'
      };

      const response = await request(app)
        .post('/api/leads')
        .send(newLead);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'New Lead');
      expect(response.body).toHaveProperty('id', 2);
    });

    it('should return 400 if name is missing', async () => {
      const invalidLead = {
        company: 'Test Company',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/leads')
        .send(invalidLead);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Name is required');
    });
  });
});