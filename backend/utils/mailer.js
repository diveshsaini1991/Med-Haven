import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async ({ to, subject, html }) => {
  return brevo.transactionalEmails.sendTransacEmail({
    sender: { name: 'MedHaven', email: process.env.SENDER_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
};
