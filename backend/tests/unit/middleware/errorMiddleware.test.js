import { describe, it, expect, vi } from 'vitest';
import { errorMiddleware } from '../../../middlewares/errorMiddleware.js';
import ErrorHandler from '../../../middlewares/errorMiddleware.js';

describe('Error Middleware', () => {
  const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  it('should handle generic error with default 500 status', () => {
    const err = new Error('Something broke');
    const res = mockRes();
    errorMiddleware(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something broke',
    });
  });

  it('should handle ErrorHandler with custom status', () => {
    const err = new ErrorHandler('Not found', 404);
    const res = mockRes();
    errorMiddleware(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not found',
    });
  });

  it('should handle MongoDB duplicate key error (11000)', () => {
    const err = { code: 11000, keyValue: { email: 'dup@test.com' } };
    const res = mockRes();
    errorMiddleware(err, {}, res, () => {});
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Duplicate'),
      })
    );
  });

  it('should handle JWT invalid error', () => {
    const err = { name: 'jsonWebTokenError' };
    const res = mockRes();
    errorMiddleware(err, {}, res, () => {});
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('invalid'),
      })
    );
  });

  it('should handle JWT expired error', () => {
    const err = { name: 'TokenExpiredError' };
    const res = mockRes();
    errorMiddleware(err, {}, res, () => {});
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Expired'),
      })
    );
  });

  it('should handle CastError', () => {
    const err = { name: 'CastError', path: '_id' };
    const res = mockRes();
    errorMiddleware(err, {}, res, () => {});
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid _id',
      })
    );
  });

  it('should handle Mongoose validation errors', () => {
    const err = {
      errors: {
        email: { message: 'Email is required' },
        phone: { message: 'Phone is required' },
      },
      statusCode: 400,
    };
    const res = mockRes();
    errorMiddleware(err, {}, res, () => {});
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Email is required'),
      })
    );
  });
});
