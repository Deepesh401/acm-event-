import Event from '../models/Event.js';
import Announcement from '../models/Announcement.js';
import mongoose from 'mongoose';
import { memoryDb } from './crudFactory.js';

export const getLiveData = async (_req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const allEvents = memoryDb.get('Event');
      const liveEvents = allEvents.filter(e => e.status === 'live');
      const upcomingEvents = allEvents.filter(e => e.status === 'upcoming');
      const announcements = memoryDb.get('Announcement');
      return res.json({
        success: true,
        data: { liveEvents, announcements, upcomingEvents },
      });
    }

    const [liveEvents, announcements, upcomingEvents] = await Promise.all([
      Event.find({ status: 'live' }).sort('-date').limit(5),
      Announcement.find({ isActive: true }).sort('-priority -createdAt').limit(10),
      Event.find({ status: 'upcoming', date: { $gte: new Date() } })
        .sort('date')
        .limit(5)
        .select('title slug date registrationCount registrationLimit status'),
    ]);

    res.json({
      success: true,
      data: { liveEvents, announcements, upcomingEvents },
    });
  } catch (err) {
    next(err);
  }
};
