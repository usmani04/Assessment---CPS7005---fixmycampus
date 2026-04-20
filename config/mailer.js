import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw error;
  }
};

export const sendStatusEmail = async (to, name, report) => {
  const subject = `Update: Your report "${report.title}" is now ${report.status}`;
  const html = `
    <h2>Report Status Update</h2>
    <p>Hi ${name},</p>
    <p>Your report "<strong>${report.title}</strong>" has been updated to: <strong>${report.status}</strong></p>
    <p>Please log in to FixMyCampus to view more details.</p>
  `;
  return sendEmail(to, subject, html);
};
