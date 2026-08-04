import nodemailer from 'nodemailer';
import config from '../core/config/index.js';

/**
 * Create a Nodemailer transporter from env config.
 * Uses Gmail SMTP by default — works with an App Password.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email?.host || 'smtp.gmail.com',
    port: config.email?.port || 587,
    secure: false, // TLS
    auth: {
      user: config.email?.user,
      pass: config.email?.pass,
    },
  });
};

/**
 * Send a password reset email.
 * @param {string} toEmail
 * @param {string} resetToken
 * @param {string} userName
 */
export const sendPasswordResetEmail = async (toEmail, resetToken, userName = 'User') => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"QuickMP3" <${config.email?.user}>`,
    to: toEmail,
    subject: 'Reset your QuickMP3 password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #0e0e0f; color: #ffffff; padding: 40px; border-radius: 16px;">
        <h1 style="font-size: 28px; font-weight: 900; margin-bottom: 8px; background: linear-gradient(135deg, #8455ef, #34b5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">QuickMP3</h1>
        <p style="color: #71717a; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 32px;">Password Reset</p>

        <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">Hi ${userName},</h2>
        <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 32px;">
          We received a request to reset your password. Click the button below — this link expires in <strong style="color: #ffffff;">1 hour</strong>.
        </p>

        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #8455ef, #34b5fa); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; letter-spacing: 0.1em;">Reset Password</a>

        <p style="color: #52525b; font-size: 12px; margin-top: 32px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email.<br/>
          This link will expire in 1 hour.
        </p>

        <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
        <p style="color: #3f3f46; font-size: 11px; text-align: center;">QuickMP3 — Premium Audio Extraction</p>
      </div>
    `,
  });
};

export default {
  sendPasswordResetEmail,
};
