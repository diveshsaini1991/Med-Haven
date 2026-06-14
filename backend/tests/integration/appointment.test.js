import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import { createTestUser, generateAuthCookie } from '../helpers.js';
import { Appointment } from '../../models/appointmentSchema.js';

describe('Appointment Routes', () => {
  let patient, doctor, admin;
  let patientCookie, doctorCookie, adminCookie;

  beforeEach(async () => {
    patient = await createTestUser({ email: 'appt-patient@test.com', role: 'Patient' });
    doctor = await createTestUser({
      email: 'appt-doctor@test.com',
      role: 'Doctor',
      doctorDepartment: 'Cardiology',
    });
    admin = await createTestUser({ email: 'appt-admin@test.com', role: 'Admin' });

    patientCookie = generateAuthCookie(patient).cookie;
    doctorCookie = generateAuthCookie(doctor).cookie;
    adminCookie = generateAuthCookie(admin).cookie;
  });

  describe('POST /api/v1/appointment/post', () => {
    it('should book an appointment', async () => {
      const res = await request(app)
        .post('/api/v1/appointment/post')
        .set('Cookie', [patientCookie])
        .send({
          firstName: 'Patient',
          lastName: 'Test',
          email: 'appt-patient@test.com',
          phone: '9876543210',
          dob: '1990-01-01',
          gender: 'Male',
          appointment_date: '2025-12-01',
          department: 'Cardiology',
          doctor_firstName: doctor.firstName,
          doctor_lastName: doctor.lastName,
          hasVisited: false,
          address: '123 Street',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.appointment).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/v1/appointment/post')
        .send({ firstName: 'Test' });

      expect(res.status).toBe(400);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/appointment/post')
        .set('Cookie', [patientCookie])
        .send({ firstName: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/appointment/getall', () => {
    it('should return all appointments for admin', async () => {
      await Appointment.create({
        firstName: 'P1', lastName: 'L1', email: 'p1@test.com', phone: '9876543210',
        dob: new Date('1990-01-01'), gender: 'Male', appointment_date: '2025-12-01',
        department: 'Cardiology', doctor: { firstName: 'Dr', lastName: 'Test' },
        address: '123 St', doctorId: doctor._id, patientId: patient._id,
      });

      const res = await request(app)
        .get('/api/v1/appointment/getall')
        .set('Cookie', [adminCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.appointments.length).toBeGreaterThan(0);
    });

    it('should fail for non-admin', async () => {
      const res = await request(app)
        .get('/api/v1/appointment/getall')
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/appointment/get', () => {
    it('should return only doctor appointments', async () => {
      await Appointment.create({
        firstName: 'P1', lastName: 'L1', email: 'docappt@test.com', phone: '9876543210',
        dob: new Date('1990-01-01'), gender: 'Male', appointment_date: '2025-12-01',
        department: 'Cardiology', doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
        address: '123 St', doctorId: doctor._id, patientId: patient._id,
      });

      const res = await request(app)
        .get('/api/v1/appointment/get')
        .set('Cookie', [doctorCookie]);

      expect(res.status).toBe(200);
      expect(res.body.appointments.length).toBe(1);
    });
  });

  describe('GET /api/v1/appointment/myappointments', () => {
    it('should return only patient appointments', async () => {
      await Appointment.create({
        firstName: 'P1', lastName: 'L1', email: 'patappt@test.com', phone: '9876543210',
        dob: new Date('1990-01-01'), gender: 'Male', appointment_date: '2025-12-01',
        department: 'Cardiology', doctor: { firstName: doctor.firstName, lastName: doctor.lastName },
        address: '123 St', doctorId: doctor._id, patientId: patient._id,
      });

      const res = await request(app)
        .get('/api/v1/appointment/myappointments')
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(200);
      expect(res.body.appointments.length).toBe(1);
    });
  });

  describe('PUT /api/v1/appointment/update/:id', () => {
    it('should update appointment status as admin', async () => {
      const appt = await Appointment.create({
        firstName: 'P1', lastName: 'L1', email: 'update@test.com', phone: '9876543210',
        dob: new Date('1990-01-01'), gender: 'Male', appointment_date: '2025-12-01',
        department: 'Cardiology', doctor: { firstName: 'Dr', lastName: 'Test' },
        address: '123 St', doctorId: doctor._id, patientId: patient._id,
      });

      const res = await request(app)
        .put(`/api/v1/appointment/update/${appt._id}`)
        .set('Cookie', [adminCookie])
        .send({ status: 'Accepted' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/appointment/delete/:id', () => {
    it('should delete appointment as admin', async () => {
      const appt = await Appointment.create({
        firstName: 'Del', lastName: 'Test', email: 'del@test.com', phone: '9876543210',
        dob: new Date('1990-01-01'), gender: 'Male', appointment_date: '2025-12-01',
        department: 'Cardiology', doctor: { firstName: 'Dr', lastName: 'Test' },
        address: '123 St', doctorId: doctor._id, patientId: patient._id,
      });

      const res = await request(app)
        .delete(`/api/v1/appointment/delete/${appt._id}`)
        .set('Cookie', [adminCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail for patient trying to delete', async () => {
      const appt = await Appointment.create({
        firstName: 'Del', lastName: 'Fail', email: 'delfail@test.com', phone: '9876543210',
        dob: new Date('1990-01-01'), gender: 'Male', appointment_date: '2025-12-01',
        department: 'Cardiology', doctor: { firstName: 'Dr', lastName: 'Test' },
        address: '123 St', doctorId: doctor._id, patientId: patient._id,
      });

      const res = await request(app)
        .delete(`/api/v1/appointment/delete/${appt._id}`)
        .set('Cookie', [patientCookie]);

      expect(res.status).toBe(400);
    });
  });
});
