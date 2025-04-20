// lib/mailer.ts
import nodemailer from 'nodemailer';
import logger from '../logger';

export const sendMail = async (subject: string, text: string) => {
  try {
    logger.info('📧 Sending email...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.DEFAULT_NAME_SENDER,
      to: process.env.SMTP_USERNAME,
      bcc: process.env.MAIL_BCC,
      subject,
      text,
    });

    logger.info('✅ Email sent successfully!');
  } catch (error) {
    logger.error('❌ Error sending email:', error);
  }
};
