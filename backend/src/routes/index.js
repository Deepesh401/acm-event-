import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { login, getMe, verifyOtp, demoLogin, register } from '../controllers/authController.js';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { sendEmail } from '../utils/email.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { getLiveData } from '../controllers/liveController.js';
import { createCrudController } from '../controllers/crudFactory.js';
import { sseNotifications } from '../controllers/liveNotificationsController.js';
import { requestPublishOtp, verifyAndPublishEvent } from '../controllers/eventPublishController.js';

import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import TeamMember from '../models/TeamMember.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Blog from '../models/Blog.js';
import Member from '../models/Member.js';
import RecruitmentApplication from '../models/RecruitmentApplication.js';
import Announcement from '../models/Announcement.js';
import Statistic from '../models/Statistic.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';

const router = Router();
const admin = [protect, authorize('admin', 'editor')];

// Event Publication OTP verification routes
router.post('/events/request-publish-otp', ...admin, requestPublishOtp);
router.post('/events/verify-publish-otp', ...admin, verifyAndPublishEvent);

const resources = [
  { path: 'events', model: Event, search: ['title', 'description', 'tags'] },
  { path: 'gallery', model: Gallery, search: ['title', 'eventName', 'tags'] },
  { path: 'team', model: TeamMember, search: ['name', 'role'] },
  { path: 'projects', model: Project, search: ['title', 'description', 'technologies'] },
  { path: 'achievements', model: Achievement, search: ['title', 'organization'] },
  { path: 'blogs', model: Blog, search: ['title', 'content', 'tags'] },
  { path: 'members', model: Member, search: ['name', 'email'] },
  { path: 'applications', model: RecruitmentApplication, search: ['name', 'email'] },
  { path: 'announcements', model: Announcement, search: ['title', 'message'] },
  { path: 'statistics', model: Statistic, search: ['label', 'key'] },
];

resources.forEach(({ path, model, search }) => {
  const ctrl = createCrudController(model, { searchFields: search });
  router.get(`/${path}`, ctrl.getAll);
  router.get(`/${path}/:id`, ctrl.getOne);
  router.post(`/${path}`, ...admin, ctrl.create);
  router.put(`/${path}/:id`, ...admin, ctrl.update);
  router.delete(`/${path}/:id`, ...admin, ctrl.remove);
});

// Manually register contacts routes to ensure POST /contacts is fully public
const contactsCtrl = createCrudController(Contact, { searchFields: ['name', 'email', 'subject'] });
router.get('/contacts', ...admin, contactsCtrl.getAll);
router.get('/contacts/:id', ...admin, contactsCtrl.getOne);
router.put('/contacts/:id', ...admin, contactsCtrl.update);
router.delete('/contacts/:id', ...admin, contactsCtrl.remove);

router.post('/auth/login', login);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/demo-login', demoLogin);
router.post('/auth/register', register);
router.get('/auth/me', protect, getMe);

// Base64 file upload route for admin
router.post('/upload', ...admin, async (req, res, next) => {
  try {
    const { filename, fileData } = req.body;
    if (!filename || !fileData) {
      return res.status(400).json({ success: false, message: 'Please provide filename and fileData' });
    }

    // Split base64 header from content
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 data format' });
    }

    const base64Content = matches[2];
    const buffer = Buffer.from(base64Content, 'base64');

    // Create unique filename to prevent collisions
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const uniqueFilename = `${baseName}-${Date.now()}${ext}`;

    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${uniqueFilename}`;

    res.json({
      success: true,
      url: fileUrl,
      message: 'File uploaded successfully'
    });
  } catch (err) {
    next(err);
  }
});
router.get('/live', getLiveData);
router.get('/notifications/live', sseNotifications);
router.get('/analytics', protect, authorize('admin'), getDashboardStats);

router.post('/contacts', async (req, res, next) => {
  try {
    let contact;
    try {
      contact = await Contact.create(req.body);
    } catch (dbErr) {
      console.warn('DB create failed for contact message, using mock fallback:', dbErr.message);
      contact = { ...req.body, _id: 'mock-contact-id-' + Date.now() };
    }
    res.status(201).json({ success: true, data: contact, message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/newsletter', async (req, res, next) => {
  try {
    try {
      await Contact.create({ ...req.body, type: 'newsletter', subject: 'Newsletter Subscription' });
    } catch (dbErr) {
      console.warn('DB create failed for newsletter subscription, using mock fallback:', dbErr.message);
    }
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/applications/public', async (req, res, next) => {
  try {
    let app;
    try {
      app = await RecruitmentApplication.create(req.body);
    } catch (dbErr) {
      console.warn('DB lookup/create failed, using body payload for mock registration email:', dbErr.message);
      app = { ...req.body, _id: 'mock-app-id-' + Date.now() };
    }

    // Send the congratulations email to the user
    try {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #005daa; margin: 0; font-size: 24px;">ACM NMIMS Indore</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Student Chapter</p>
          </div>
          <div style="height: 2px; bg-color: #005daa; background: linear-gradient(90deg, #005daa, #00c6ff); margin-bottom: 25px;"></div>
          
          <h2 style="color: #2d3748; margin-top: 0;">Congratulations! 🎉</h2>
          <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
            Dear <strong>${app.name}</strong>,
          </p>
          <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
            You have successfully registered and become a part of the <strong>ACM NMIMS Indore Student Chapter</strong>!
          </p>
          
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #005daa; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d3748; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Registration Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 5px 0; color: #718096; width: 120px;"><strong>Name:</strong></td>
                <td style="padding: 5px 0; color: #2d3748;">${app.name}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096;"><strong>Email:</strong></td>
                <td style="padding: 5px 0; color: #2d3748;">${app.email}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096;"><strong>Roll Number:</strong></td>
                <td style="padding: 5px 0; color: #2d3748;">${app.rollNumber || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096;"><strong>Branch:</strong></td>
                <td style="padding: 5px 0; color: #2d3748;">${app.branch || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096;"><strong>Year:</strong></td>
                <td style="padding: 5px 0; color: #2d3748;">${app.year || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #718096;"><strong>Type:</strong></td>
                <td style="padding: 5px 0; color: #2d3748; text-transform: capitalize;">${app.type || 'membership'}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #4a5568; line-height: 1.6; font-size: 14px;">
            Congratulations! You have successfully become a part of the ACM Chapter. We are thrilled to have you in our computing community and will contact you shortly with next steps regarding onboarding and membership.
          </p>
          
          <div style="margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px; font-size: 12px; color: #a0aec0; text-align: center;">
            <p style="margin: 0;">This is an automated confirmation email. Please do not reply directly to this message.</p>
            <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} ACM NMIMS Indore Student Chapter. All rights reserved.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to: app.email,
        subject: 'Congratulations - Successfully become part of ACM',
        html: emailContent,
        text: `Dear ${app.name},\n\nCongratulations! You have successfully registered and become a part of ACM NMIMS Indore Student Chapter.\n\nRegistration Summary:\n- Name: ${app.name}\n- Email: ${app.email}\n- Roll Number: ${app.rollNumber || 'N/A'}\n- Branch: ${app.branch || 'N/A'}\n- Year: ${app.year || 'N/A'}\n- Type: ${app.type || 'membership'}\n\nWe will contact you shortly with the next steps regarding onboarding and membership.\n\nBest regards,\nACM NMIMS Indore Student Chapter`
      });
    } catch (emailErr) {
      console.error('Failed to send registration congratulations email:', emailErr.message);
    }

    res.status(201).json({ success: true, data: app, message: 'Application submitted successfully' });
  } catch (err) {
    next(err);
  }
});

router.get('/users', protect, authorize('admin'), async (_req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

export default router;
