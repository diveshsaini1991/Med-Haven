import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import { createTestUser, generateAuthCookie } from '../../helpers.js';

describe('Auth Middleware (via routes)', () => {
  describe('Admin authentication', () => {
    it('should allow admin access with valid token', async () => {
      const admin = await createTestUser({ role: 'Admin', email: 'auth-admin@test.com' });
      const { cookie } = generateAuthCookie(admin);

      const res = await request(app)
        .get('/api/v1/user/admin/me')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/api/v1/user/admin/me');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject patient trying admin route', async () => {
      const patient = await createTestUser({ role: 'Patient', email: 'auth-patient-admin@test.com' });
      const token = generateAuthCookie(patient);
      // Use patient token in admin cookie slot
      const res = await request(app)
        .get('/api/v1/user/admin/me')
        .set('Cookie', [`adminToken=${token.token}`]);

      expect(res.status).toBe(403);
    });
  });

  describe('Patient authentication', () => {
    it('should allow patient access with valid token', async () => {
      const patient = await createTestUser({ role: 'Patient', email: 'auth-patient@test.com' });
      const { cookie } = generateAuthCookie(patient);

      const res = await request(app)
        .get('/api/v1/user/patient/me')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/api/v1/user/patient/me');
      expect(res.status).toBe(400);
    });
  });

  describe('Doctor authentication', () => {
    it('should allow doctor access with valid token', async () => {
      const doctor = await createTestUser({ role: 'Doctor', email: 'auth-doctor@test.com' });
      const { cookie } = generateAuthCookie(doctor);

      const res = await request(app)
        .get('/api/v1/user/doctor/me')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/api/v1/user/doctor/me');
      expect(res.status).toBe(400);
    });
  });

  describe('Patient or Doctor authentication', () => {
    it('should allow patient to access chat routes', async () => {
      const patient = await createTestUser({ role: 'Patient', email: 'auth-chat-patient@test.com' });
      const { cookie } = generateAuthCookie(patient);

      const res = await request(app)
        .get('/api/v1/chat/patientlist')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
    });

    it('should allow doctor to access chat routes', async () => {
      const doctor = await createTestUser({ role: 'Doctor', email: 'auth-chat-doctor@test.com' });
      const { cookie } = generateAuthCookie(doctor);

      const res = await request(app)
        .get('/api/v1/chat/patientlist')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
    });

    it('should reject without any token', async () => {
      const res = await request(app).get('/api/v1/chat/patientlist');
      expect(res.status).toBe(400);
    });
  });
});
