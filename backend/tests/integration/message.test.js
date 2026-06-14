import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser, generateAuthCookie } from '../helpers.js';

describe('Message Routes', () => {
  describe('POST /api/v1/message/send', () => {
    it('should send a message to Admin', async () => {
      const res = await request(app)
        .post('/api/v1/message/send')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '9876543210',
          message: 'I need help with my appointment scheduling please.',
          to: 'Admin',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should send a message to a specific Doctor', async () => {
      const doctor = await createTestUser({
        email: 'msg-doc@test.com',
        role: 'Doctor',
        doctorDepartment: 'Cardiology',
      });

      const res = await request(app)
        .post('/api/v1/message/send')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          phone: '9876543210',
          message: 'I have questions about my cardiology appointment soon.',
          to: 'Doctor',
          doctor_firstName: doctor.firstName,
          doctor_lastName: doctor.lastName,
          department: 'Cardiology',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/message/send')
        .send({ firstName: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/message/getall', () => {
    it('should return all messages for admin', async () => {
      const admin = await createTestUser({ email: 'msg-admin@test.com', role: 'Admin' });
      const adminCookie = generateAuthCookie(admin).cookie;

      await request(app).post('/api/v1/message/send').send({
        firstName: 'John', lastName: 'Doe', email: 'j@test.com',
        phone: '9876543210', message: 'Test message content for admin inbox.', to: 'Admin',
      });

      const res = await request(app)
        .get('/api/v1/message/getall')
        .set('Cookie', [adminCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.messages.length).toBeGreaterThan(0);
    });

    it('should fail for non-admin', async () => {
      const patient = await createTestUser({ email: 'msg-nonadmin@test.com', role: 'Patient' });
      const patientCookie = generateAuthCookie(patient).cookie;

      const res = await request(app)
        .get('/api/v1/message/getall')
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/message/get', () => {
    it('should return messages for specific doctor', async () => {
      const doctor = await createTestUser({
        email: 'msg-mydoc@test.com',
        role: 'Doctor',
        doctorDepartment: 'Neurology',
      });
      const doctorCookie = generateAuthCookie(doctor).cookie;

      await request(app).post('/api/v1/message/send').send({
        firstName: 'Patient', lastName: 'One', email: 'p1@test.com',
        phone: '9876543210', message: 'Message for doctor about neurology issue.',
        to: 'Doctor', doctor_firstName: doctor.firstName,
        doctor_lastName: doctor.lastName, department: 'Neurology',
      });

      const res = await request(app)
        .get('/api/v1/message/get')
        .set('Cookie', [doctorCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.messages.length).toBe(1);
    });
  });
});
