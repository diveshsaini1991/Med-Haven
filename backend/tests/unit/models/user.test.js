import { describe, it, expect } from 'vitest';
import { User } from '../../../models/userSchema.js';

describe('User Model', () => {
  describe('Validation', () => {
    it('should create a valid user', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9876543210',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        password: 'Password123',
        role: 'Patient',
      });
      expect(user._id).toBeDefined();
      expect(user.firstName).toBe('John');
      expect(user.role).toBe('Patient');
    });

    it('should fail without required fields', async () => {
      await expect(User.create({})).rejects.toThrow();
    });

    it('should fail with invalid email', async () => {
      await expect(
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          phone: '9876543210',
          dob: new Date('1990-01-01'),
          gender: 'Male',
          password: 'Password123',
          role: 'Patient',
        })
      ).rejects.toThrow();
    });

    it('should fail with invalid phone (not 10 digits)', async () => {
      await expect(
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john2@example.com',
          phone: '123',
          dob: new Date('1990-01-01'),
          gender: 'Male',
          password: 'Password123',
          role: 'Patient',
        })
      ).rejects.toThrow();
    });

    it('should fail with invalid gender', async () => {
      await expect(
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john3@example.com',
          phone: '9876543210',
          dob: new Date('1990-01-01'),
          gender: 'Other',
          password: 'Password123',
          role: 'Patient',
        })
      ).rejects.toThrow();
    });

    it('should fail with invalid role', async () => {
      await expect(
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john4@example.com',
          phone: '9876543210',
          dob: new Date('1990-01-01'),
          gender: 'Male',
          password: 'Password123',
          role: 'InvalidRole',
        })
      ).rejects.toThrow();
    });

    it('should fail with password less than 6 characters', async () => {
      await expect(
        User.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john5@example.com',
          phone: '9876543210',
          dob: new Date('1990-01-01'),
          gender: 'Male',
          password: '12345',
          role: 'Patient',
        })
      ).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const user = await User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '9876543210',
        dob: new Date('1990-01-01'),
        gender: 'Female',
        password: 'Password123',
        role: 'Patient',
      });
      const savedUser = await User.findById(user._id).select('+password');
      expect(savedUser.password).not.toBe('Password123');
      expect(savedUser.password.startsWith('$2')).toBe(true);
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@example.com',
        phone: '9876543210',
        dob: new Date('1990-01-01'),
        gender: 'Female',
        password: 'Password123',
        role: 'Patient',
      });
      const savedUser = await User.findById(user._id).select('+password');
      const originalHash = savedUser.password;
      savedUser.firstName = 'Updated';
      await savedUser.save();
      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.password).toBe(originalHash);
    });
  });

  describe('Methods', () => {
    it('comparepassword should return true for correct password', async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'Compare',
        email: 'compare@example.com',
        phone: '9876543210',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        password: 'MyPassword123',
        role: 'Patient',
      });
      const savedUser = await User.findById(user._id).select('+password');
      const result = await savedUser.comparepassword('MyPassword123');
      expect(result).toBe(true);
    });

    it('comparepassword should return false for wrong password', async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'Wrong',
        email: 'wrong@example.com',
        phone: '9876543210',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        password: 'MyPassword123',
        role: 'Patient',
      });
      const savedUser = await User.findById(user._id).select('+password');
      const result = await savedUser.comparepassword('WrongPassword');
      expect(result).toBe(false);
    });

    it('generateJsonWebToken should return a valid JWT', async () => {
      const user = await User.create({
        firstName: 'Token',
        lastName: 'Test',
        email: 'token@example.com',
        phone: '9876543210',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        password: 'Password123',
        role: 'Patient',
      });
      const token = user.generateJsonWebToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });
});
