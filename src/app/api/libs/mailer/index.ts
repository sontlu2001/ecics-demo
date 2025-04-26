// lib/mailer.ts
import nodemailer from 'nodemailer';
import logger from '../logger';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  bcc?: string;
}

export const sendMail = async ({ to, subject, html, bcc }: MailOptions) => {
  try {
    logger.info(
      `Sending email with details: to=${to}, subject=${subject}, bcc=${bcc}, SMTP host=${process.env.SMTP_HOST}, port=${process.env.SMTP_PORT}, user=${process.env.SMTP_USERNAME}, default sender=${process.env.DEFAULT_NAME_SENDER}`,
    );

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
      to: to,
      bcc: bcc || process.env.MAIL_BCC,
      subject,
      html: html,
    });

    logger.info('Sending email successfully!');
  } catch (error) {
    logger.error('Error sending email:', error);
  }
};
