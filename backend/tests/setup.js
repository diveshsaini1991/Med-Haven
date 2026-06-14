import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { vi, beforeAll, afterAll, afterEach } from 'vitest';

// Set env vars before anything loads
process.env.JWT_SECRET_KEY = 'test-secret-key';
process.env.JWT_EXPIRES = '7d';
process.env.COOKIE_EXPIRE = '7';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.DASHBOAD_URL = 'http://localhost:5174';
process.env.DOC_DASHBOAD_URL = 'http://localhost:5175';
process.env.BREVO_API_KEY = 'test-brevo-key';
process.env.SENDER_EMAIL = 'test@test.com';
process.env.BACKEND_DOMAIN = 'localhost';

let mongoServer;

// Mock external services
vi.mock('@getbrevo/brevo', () => {
  const mockClient = {
    transactionalEmails: {
      sendTransacEmail: vi.fn().mockResolvedValue({ messageId: 'mock-id' }),
    },
  };
  return {
    BrevoClient: class {
      constructor() {
        return mockClient;
      }
    },
  };
});

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: vi.fn().mockReturnValue({
      set: vi.fn().mockResolvedValue('OK'),
      get: vi.fn().mockResolvedValue(null),
      del: vi.fn().mockResolvedValue(1),
    }),
  },
}));

vi.mock('@upstash/ratelimit', () => {
  class MockRatelimit {
    constructor() {
      this.limit = vi.fn().mockResolvedValue({ success: true });
    }
    static slidingWindow() {
      return 'sliding-window-config';
    }
  }
  return { Ratelimit: MockRatelimit };
});

vi.mock('cloudinary', () => ({
  default: {
    v2: {
      config: vi.fn(),
      uploader: {
        upload: vi.fn().mockResolvedValue({
          public_id: 'mock-public-id',
          secure_url: 'https://res.cloudinary.com/mock/image.jpg',
        }),
      },
    },
    uploader: {
      upload: vi.fn().mockResolvedValue({
        public_id: 'mock-public-id',
        secure_url: 'https://res.cloudinary.com/mock/image.jpg',
      }),
    },
  },
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
