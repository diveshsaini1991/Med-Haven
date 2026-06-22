import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { User } from '../../models/userSchema.js';
import { createTestUser, generateAuthCookie } from '../helpers.js';

// Get the mocked redis
import redis from '../../config/redis.js';

describe('User Routes', () => {
  describe('POST /api/v1/user/patient/register', () => {
    it('should send OTP for valid registration data', async () => {
      redis.get.mockResolvedValue(null);
      redis.set.mockResolvedValue('OK');

      const res = await request(app)
        .post('/api/v1/user/patient/register')
        .send({
          firstName: 'New',
          lastName: 'Patient',
          email: 'newpatient@example.com',
          phone: '9876543210',
          dob: '1990-01-01',
          gender: 'Male',
          password: 'Password123',
          role: 'Patient',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('OTP');
      expect(res.body.email).toBe('newpatient@example.com');
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/user/patient/register')
        .send({ firstName: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail if user already exists', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const res = await request(app)
        .post('/api/v1/user/patient/register')
        .send({
          firstName: 'Existing',
          lastName: 'User',
          email: 'existing@example.com',
          phone: '9876543210',
          dob: '1990-01-01',
          gender: 'Male',
          password: 'Password123',
          role: 'Patient',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Already Registered');
    });
  });

  describe('POST /api/v1/user/patient/verify-otp', () => {
    it('should create user with valid OTP', async () => {
      redis.get.mockResolvedValue('123456');
      redis.del.mockResolvedValue(1);

      const res = await request(app)
        .post('/api/v1/user/patient/verify-otp')
        .send({
          firstName: 'Verified',
          lastName: 'User',
          email: 'verify@example.com',
          phone: '9876543210',
          dob: '1990-01-01',
          gender: 'Male',
          password: 'Password123',
          role: 'Patient',
          otp: '123456',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
    });

    it('should fail with wrong OTP', async () => {
      redis.get.mockResolvedValue('123456');

      const res = await request(app)
        .post('/api/v1/user/patient/verify-otp')
        .send({
          firstName: 'Verified',
          lastName: 'User',
          email: 'wrongotp@example.com',
          phone: '9876543210',
          dob: '1990-01-01',
          gender: 'Male',
          password: 'Password123',
          role: 'Patient',
          otp: '000000',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid');
    });

    it('should fail with expired OTP (null from redis)', async () => {
      redis.get.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/user/patient/verify-otp')
        .send({
          firstName: 'Expired',
          lastName: 'OTP',
          email: 'expired@example.com',
          phone: '9876543210',
          dob: '1990-01-01',
          gender: 'Male',
          password: 'Password123',
          role: 'Patient',
          otp: '123456',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/user/login', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'login@example.com',
        password: 'Password123',
        role: 'Patient',
      });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'login@example.com',
          password: 'Password123',
          role: 'Patient',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPass',
          role: 'Patient',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with wrong role', async () => {
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'login@example.com',
          password: 'Password123',
          role: 'Admin',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({ email: 'login@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/user/doctors', () => {
    it('should return list of doctors', async () => {
      await createTestUser({ role: 'Doctor', email: 'doc1@test.com' });
      await createTestUser({ role: 'Doctor', email: 'doc2@test.com' });

      const res = await request(app).get('/api/v1/user/doctors');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.doctors.length).toBe(2);
    });
  });

  describe('GET /api/v1/user/patient/me', () => {
    it('should return user details when authenticated', async () => {
      const patient = await createTestUser({ email: 'me@test.com', role: 'Patient' });
      const { cookie } = generateAuthCookie(patient);

      const res = await request(app)
        .get('/api/v1/user/patient/me')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('me@test.com');
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/v1/user/patient/me');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/user/patient/change-password', () => {
    it('should change password with correct old password', async () => {
      const patient = await createTestUser({ email: 'changepw@test.com', password: 'OldPass123', role: 'Patient' });
      const { cookie } = generateAuthCookie(patient);

      const res = await request(app)
        .post('/api/v1/user/patient/change-password')
        .set('Cookie', [cookie])
        .send({ oldPassword: 'OldPass123', newPassword: 'NewPass456' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail with wrong old password', async () => {
      const patient = await createTestUser({ email: 'changepw2@test.com', password: 'OldPass123', role: 'Patient' });
      const { cookie } = generateAuthCookie(patient);

      const res = await request(app)
        .post('/api/v1/user/patient/change-password')
        .set('Cookie', [cookie])
        .send({ oldPassword: 'WrongOld', newPassword: 'NewPass456' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/user/patient/forgot-password', () => {
    it('should send a reset OTP for a registered email', async () => {
      redis.set.mockResolvedValue('OK');
      await createTestUser({ email: 'forgot@test.com', role: 'Patient' });

      const res = await request(app)
        .post('/api/v1/user/patient/forgot-password')
        .send({ email: 'forgot@test.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.email).toBe('forgot@test.com');
    });

    it('should fail for an unregistered email', async () => {
      const res = await request(app)
        .post('/api/v1/user/patient/forgot-password')
        .send({ email: 'nobody@test.com' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should fail when email is missing', async () => {
      const res = await request(app)
        .post('/api/v1/user/patient/forgot-password')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/user/patient/reset-password', () => {
    it('should reset password with a valid OTP', async () => {
      redis.get.mockResolvedValue('123456');
      redis.del.mockResolvedValue(1);
      await createTestUser({
        email: 'reset@test.com',
        password: 'OldPass123',
        role: 'Patient',
      });

      const res = await request(app)
        .post('/api/v1/user/patient/reset-password')
        .send({
          email: 'reset@test.com',
          otp: '123456',
          newPassword: 'NewPass456',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const login = await request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'reset@test.com',
          password: 'NewPass456',
          role: 'Patient',
        });
      expect(login.status).toBe(200);
    });

    it('should fail with an invalid OTP', async () => {
      redis.get.mockResolvedValue('123456');
      await createTestUser({ email: 'reset2@test.com', role: 'Patient' });

      const res = await request(app)
        .post('/api/v1/user/patient/reset-password')
        .send({
          email: 'reset2@test.com',
          otp: '000000',
          newPassword: 'NewPass456',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('OTP');
    });

    it('should fail with a weak new password', async () => {
      redis.get.mockResolvedValue('123456');
      await createTestUser({ email: 'reset3@test.com', role: 'Patient' });

      const res = await request(app)
        .post('/api/v1/user/patient/reset-password')
        .send({
          email: 'reset3@test.com',
          otp: '123456',
          newPassword: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail for an unregistered email', async () => {
      redis.get.mockResolvedValue('123456');

      const res = await request(app)
        .post('/api/v1/user/patient/reset-password')
        .send({
          email: 'ghost@test.com',
          otp: '123456',
          newPassword: 'NewPass456',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/user/patient/logout', () => {
    it('should clear patient cookie', async () => {
      const patient = await createTestUser({ email: 'logout@test.com', role: 'Patient' });
      const { cookie } = generateAuthCookie(patient);

      const res = await request(app)
        .get('/api/v1/user/patient/logout')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const setCookie = res.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      expect(setCookie[0]).toContain('patientToken=;');
    });
  });
});
