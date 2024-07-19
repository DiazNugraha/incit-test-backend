export const MailerConfig = () => ({
  apiKey: process.env.MAILER_API_KEY,
  senderEmail: process.env.SENDER_EMAIL,
  senderName: process.env.SENDER_NAME,
});
