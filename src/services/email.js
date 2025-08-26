import nodemailer from 'nodemailer';

let cachedTransporter;

export function getMailTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

export async function sendResetPasswordEmail({ to, resetUrl }) {
  const from = process.env.SMTP_FROM;
  const transporter = getMailTransporter();
  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Reset your password',
    text: `Click the link to reset your password: ${resetUrl}`,
    html: `<p>Click the link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  return info;
}




