import nodemailer from 'nodemailer';

let transporter;

// Create transporter helper supporting Gmail, custom SMTP, or Ethereal test accounts
const getTransporter = async () => {
  if (transporter) return transporter;

  // 1. Use Gmail service if EMAIL_USER and EMAIL_PASS are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log('Nodemailer Gmail Transporter initialized successfully.');
      return transporter;
    } catch (err) {
      console.error('Failed to initialize Gmail transporter:', err.message);
    }
  }

  // 2. Use custom SMTP environment variables if provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('Nodemailer SMTP Transporter initialized with custom credentials.');
      return transporter;
    } catch (err) {
      console.error('Failed to initialize custom SMTP transporter:', err.message);
    }
  }

  // 3. Fallback: Generate a test SMTP service account from ethereal.email
  try {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    console.log('Testing SMTP Transporter initialized successfully. Ethereal account:', testAccount.user);
    return transporter;
  } catch (err) {
    console.error('Failed to create test SMTP transporter, falling back to mock:', err.message);
    // 4. Fallback mock transporter if internet/ethereal fails
    return {
      sendMail: async (options) => {
        console.log('--- MOCK EMAIL SENT ---');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.text || options.html}`);
        console.log('-----------------------');
        return { messageId: 'mock-id', previewUrl: 'http://localhost:5000/mock-email-preview' };
      }
    };
  }
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const mailTransporter = await getTransporter();

  const info = await mailTransporter.sendMail({
    from: process.env.SMTP_FROM || process.env.EMAIL_USER || '"ACM NMIMS Indore" <acmnmims26@gmail.com>',
    to,
    subject,
    text,
    html,
  });

  console.log(`Email sent: ${info.messageId}`);
  
  // If we are using Ethereal email, print the preview URL
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`Preview URL: ${previewUrl}`);
    info.previewUrl = previewUrl;
  }

  return info;
};

