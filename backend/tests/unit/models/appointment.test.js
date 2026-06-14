import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { Appointment } from '../../../models/appointmentSchema.js';

describe('Appointment Model', () => {
  const validAppointment = {
    firstName: 'Patient',
    lastName: 'Test',
    email: 'patient@example.com',
    phone: '9876543210',
    dob: new Date('1990-01-01'),
    gender: 'Male',
    appointment_date: '2025-06-20',
    department: 'Cardiology',
    doctor: { firstName: 'Dr', lastName: 'Smith' },
    hasVisited: false,
    address: '123 Main St',
    doctorId: new mongoose.Types.ObjectId(),
    patientId: new mongoose.Types.ObjectId(),
  };

  it('should create a valid appointment', async () => {
    const appointment = await Appointment.create(validAppointment);
    expect(appointment._id).toBeDefined();
    expect(appointment.status).toBe('Pending');
  });

  it('should default status to Pending', async () => {
    const appointment = await Appointment.create(validAppointment);
    expect(appointment.status).toBe('Pending');
  });

  it('should accept valid status values', async () => {
    for (const status of ['Pending', 'Accepted', 'Rejected', 'Updated']) {
      const appt = await Appointment.create({ ...validAppointment, status, email: `test${status}@example.com` });
      expect(appt.status).toBe(status);
    }
  });

  it('should fail without required fields', async () => {
    await expect(Appointment.create({})).rejects.toThrow();
  });

  it('should fail with invalid email', async () => {
    await expect(
      Appointment.create({ ...validAppointment, email: 'bad-email' })
    ).rejects.toThrow();
  });

  it('should fail with invalid phone', async () => {
    await expect(
      Appointment.create({ ...validAppointment, phone: '123' })
    ).rejects.toThrow();
  });

  it('should default hasVisited to false', async () => {
    const appointment = await Appointment.create(validAppointment);
    expect(appointment.hasVisited).toBe(false);
  });
});
