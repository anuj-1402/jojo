import nodemailer from 'nodemailer';

// Replace these with your Gmail credentials (use environment variables in production)
const GMAIL_USER = process.env.GMAIL_USER; // e.g., 'yourdemoemail@gmail.com'
const GMAIL_PASS = process.env.GMAIL_PASS; // e.g., Gmail app password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

// Reusable sendEmail function
export default async function sendEmail({ to, subject, text }) {
  const info = await transporter.sendMail({
    from: GMAIL_USER,
    to,
    subject,
    text
  });

  console.log('Message sent: %s', info.messageId);
  return info;
}