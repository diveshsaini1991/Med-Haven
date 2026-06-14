import { describe, it, expect } from 'vitest';
import { Message } from '../../../models/messageSchema.js';

describe('Message Model', () => {
  const validMessage = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '9876543210',
    message: 'This is a test message for the doctor.',
  };

  it('should create a valid message to Admin', async () => {
    const msg = await Message.create(validMessage);
    expect(msg._id).toBeDefined();
    expect(msg.to).toBe('Admin');
  });

  it('should create a message to Doctor', async () => {
    const msg = await Message.create({ ...validMessage, to: 'Doctor' });
    expect(msg.to).toBe('Doctor');
  });

  it('should fail without required fields', async () => {
    await expect(Message.create({})).rejects.toThrow();
  });

  it('should fail with message less than 10 chars', async () => {
    await expect(
      Message.create({ ...validMessage, message: 'short' })
    ).rejects.toThrow();
  });

  it('should fail with invalid email', async () => {
    await expect(
      Message.create({ ...validMessage, email: 'not-an-email' })
    ).rejects.toThrow();
  });
});
