import { User } from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret-key';
process.env.JWT_SECRET_KEY = JWT_SECRET;
process.env.JWT_EXPIRES = '7d';
process.env.COOKIE_EXPIRE = '7';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.DASHBOAD_URL = 'http://localhost:5174';
process.env.DOC_DASHBOAD_URL = 'http://localhost:5175';
process.env.BREVO_API_KEY = 'test-brevo-key';
process.env.SENDER_EMAIL = 'test@test.com';
process.env.BACKEND_DOMAIN = 'localhost';

export const createTestUser = async (overrides = {}) => {
  const defaults = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    phone: '9876543210',
    dob: new Date('1995-01-01'),
    gender: 'Male',
    password: 'Password123',
    role: 'Patient',
  };
  return User.create({ ...defaults, ...overrides });
};

export const generateAuthCookie = (user) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  const cookieName =
    user.role === 'Admin'
      ? 'adminToken'
      : user.role === 'Doctor'
        ? 'doctorToken'
        : 'patientToken';
  return { token, cookieName, cookie: `${cookieName}=${token}` };
};
