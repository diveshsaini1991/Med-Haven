import redis from '../config/redis.js';
import { sendEmail } from '../utils/mailer.js';
import { getOtpEmailHtml } from './otpEmail.js';

const OTP_EXPIRY_SECONDS = 300;

const otpKey = (email) => `otp:${email}`;

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const storeOtp = async (email, otp) => {
  await redis.set(otpKey(email), otp, { ex: OTP_EXPIRY_SECONDS });
};

// Generates an OTP, stores it in redis with expiry and emails it to the user.
export const sendOtp = async ({ email, name = '', subject }) => {
  const otp = generateOtp();
  await storeOtp(email, otp);
  await sendEmail({
    to: email,
    subject,
    html: getOtpEmailHtml(otp, name),
  });
  return otp;
};

// Returns true when the supplied OTP matches the one stored for the email.
export const verifyOtp = async (email, otp) => {
  const savedOtp = await redis.get(otpKey(email));
  return Boolean(savedOtp) && String(savedOtp) === String(otp);
};

export const invalidateOtp = async (email) => {
  await redis.del(otpKey(email));
};
