import SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async ({ to, subject, html }) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: 'MedHaven',
    email: process.env.SENDER_EMAIL,
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};
