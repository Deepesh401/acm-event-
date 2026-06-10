import Event from '../models/Event.js';
import { sendEmail } from '../utils/email.js';

// In-memory store for event publication OTPs
const publishOtps = new Map();

// Helper to slugify title
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const requestPublishOtp = async (req, res, next) => {
  try {
    const { title } = req.body;
    
    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    
    const adminEmail = req.user.email;
    publishOtps.set(adminEmail.toLowerCase(), { otp, expires, title });

    // Send the OTP via the testing email API
    let previewUrl = '';
    try {
      const emailInfo = await sendEmail({
        to: adminEmail,
        subject: 'ACM Portal - Verify Event Publication Request (OTP)',
        text: `Your event publication verification code is ${otp}. It is valid for 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #005daa;">Verify Event Publication</h2>
            <p>You requested to publish the event: <strong>"${title}"</strong> on the ACM Chapter website.</p>
            <p>Please enter the following 6-digit verification code to confirm this action:</p>
            <p style="font-size: 28px; font-weight: bold; color: #005daa; letter-spacing: 2px; margin: 15px 0;">${otp}</p>
            <p style="color: #666; font-size: 12px;">If you did not initiate this action, please ignore this email.</p>
          </div>
        `,
      });
      if (emailInfo?.previewUrl) {
        previewUrl = emailInfo.previewUrl;
      }
    } catch (emailErr) {
      console.error('Failed to send event verification email:', emailErr.message);
    }

    console.log(`[Event Publish OTP] Generated OTP ${otp} for admin ${adminEmail} to publish "${title}"`);

    res.json({
      success: true,
      otpRequired: true,
      email: adminEmail,
      previewUrl,
      otp, // Return OTP for easy local testing
      message: 'Verification OTP sent to your admin email address'
    });
  } catch (err) {
    next(err);
  }
};

export const verifyAndPublishEvent = async (req, res, next) => {
  try {
    const { event, otp } = req.body;
    const adminEmail = req.user.email;
    const lowerEmail = adminEmail.toLowerCase();

    const record = publishOtps.get(lowerEmail);
    if (!record || record.otp !== otp || record.expires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired publication OTP' });
    }

    // OTP verified successfully! Clear it
    publishOtps.delete(lowerEmail);

    // Format event values
    const eventForm = { ...event };
    if (!eventForm.slug && eventForm.title) {
      eventForm.slug = slugify(eventForm.title);
    }
    
    // Create the event
    const doc = await Event.create(eventForm);

    // Trigger live notifications and emails (matching crudFactory create hook)
    import('./liveNotificationsController.js')
      .then(({ handleEventPublished }) => handleEventPublished(doc))
      .catch((err) => console.error('Failed to trigger handleEventPublished hook:', err.message));

    res.status(201).json({
      success: true,
      data: doc,
      message: 'Event verified and published successfully!'
    });
  } catch (err) {
    next(err);
  }
};
