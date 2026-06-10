import Event from '../models/Event.js';
import Member from '../models/Member.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Blog from '../models/Blog.js';
import RecruitmentApplication from '../models/RecruitmentApplication.js';
import Contact from '../models/Contact.js';
import Gallery from '../models/Gallery.js';
import TeamMember from '../models/TeamMember.js';
import Announcement from '../models/Announcement.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (_req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          events: 0,
          members: 0,
          projects: 0,
          achievements: 0,
          blogs: 0,
          pendingApplications: 0,
          unreadContacts: 0,
          gallery: 0,
          team: 0,
          announcements: 0,
          liveEvents: 0,
        },
      });
    }
    const [
      events,
      members,
      projects,
      achievements,
      blogs,
      applications,
      contacts,
      gallery,
      team,
      announcements,
      liveEvents,
    ] = await Promise.all([
      Event.countDocuments(),
      Member.countDocuments({ isActive: true }),
      Project.countDocuments(),
      Achievement.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      RecruitmentApplication.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ isRead: false }),
      Gallery.countDocuments(),
      TeamMember.countDocuments({ isActive: true }),
      Announcement.countDocuments({ isActive: true }),
      Event.countDocuments({ status: 'live' }),
    ]);

    res.json({
      success: true,
      data: {
        events,
        members,
        projects,
        achievements,
        blogs,
        pendingApplications: applications,
        unreadContacts: contacts,
        gallery,
        team,
        announcements,
        liveEvents,
      },
    });
  } catch (err) {
    next(err);
  }
};
