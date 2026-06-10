import { ApiFeatures } from '../utils/apiFeatures.js';
import mongoose from 'mongoose';

// Default mock datasets for offline mode
const defaultEvents = [
  {
    _id: 'default-event-1',
    title: 'ACM Chapter Summit 2025',
    slug: 'acm-chapter-summit-2025',
    description: 'A flagship summit bringing together ACM student chapters across India.',
    shortDescription: 'Flagship national ACM summit at NMIMS Indore.',
    category: 'summit',
    date: new Date('2025-11-15'),
    location: 'NMIMS Indore Campus',
    coverImage: '/images/hero-summit.png',
    isFeatured: true,
    status: 'completed',
    registrationCount: 450,
  },
  {
    _id: 'default-event-2',
    title: 'Web-Sprint 2026 Launch',
    slug: 'web-sprint-2026-launch',
    description: 'Official launch of our two-year digital legacy initiative.',
    shortDescription: 'Launch event for Web-Sprint 2026.',
    category: 'meetup',
    date: new Date('2026-06-20'),
    location: 'NMIMS Indore',
    isUpcoming: true,
    isFeatured: true,
    status: 'upcoming',
    registrationLimit: 200,
    registrationCount: 87,
  },
  {
    _id: 'default-event-3',
    title: 'AI/ML Workshop Series',
    slug: 'ai-ml-workshop-series',
    description: 'Hands-on workshops covering modern machine learning pipelines.',
    category: 'workshop',
    date: new Date('2026-07-10'),
    location: 'NMIMS Indore',
    status: 'upcoming',
    registrationCount: 45,
    registrationLimit: 80,
  }
];

const defaultAnnouncements = [
  {
    _id: 'default-ann-1',
    title: 'Web-Sprint 2026 Registration Open',
    message: 'Register now for the official launch event on June 20, 2026.',
    type: 'info',
    isActive: true,
    priority: 10,
    createdAt: new Date(),
  }
];

// In-memory data store for offline mode
export const memoryDb = {
  store: new Map(),
  get(modelName) {
    if (!this.store.has(modelName)) {
      this.store.set(modelName, []);
    }
    return this.store.get(modelName);
  },
  add(modelName, item) {
    const list = this.get(modelName);
    list.unshift(item);
  }
};

// Seed default items
memoryDb.get('Event').push(...defaultEvents);
memoryDb.get('Announcement').push(...defaultAnnouncements);

export const createCrudController = (Model, options = {}) => {
  const { searchFields = [], slugField = 'title' } = options;

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  return {
    getAll: async (req, res, next) => {
      try {
        if (mongoose.connection.readyState !== 1) {
          let data = [...memoryDb.get(Model.modelName)];

          // Apply basic status filtering
          if (req.query.status) {
            data = data.filter(item => item.status === req.query.status);
          }
          if (req.query.isFeatured) {
            const isFeaturedVal = req.query.isFeatured === 'true';
            data = data.filter(item => item.isFeatured === isFeaturedVal);
          }

          // Sort by date (descending) for events
          if (Model.modelName === 'Event') {
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
          }

          // Apply limit
          if (req.query.limit) {
            const limit = parseInt(req.query.limit, 10);
            data = data.slice(0, limit);
          }

          return res.json({
            success: true,
            count: data.length,
            total: data.length,
            page: 1,
            pages: 1,
            data,
          });
        }

        const features = new ApiFeatures(Model.find(), req.query)
          .filter()
          .search(searchFields)
          .sort()
          .limitFields()
          .paginate();

        const total = await Model.countDocuments(features.query.getFilter?.() || {});
        const data = await features.query;
        res.json({
          success: true,
          count: data.length,
          total,
          page: features.page,
          pages: Math.ceil(total / features.limit),
          data,
        });
      } catch (err) {
        next(err);
      }
    },

    getOne: async (req, res, next) => {
      try {
        if (mongoose.connection.readyState !== 1) {
          return res.status(404).json({ success: false, message: 'Not found (Database offline)' });
        }

        const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
          ? { _id: req.params.id }
          : { slug: req.params.id };
        const doc = await Model.findOne(query);
        if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: doc });
      } catch (err) {
        next(err);
      }
    },

    create: async (req, res, next) => {
      try {
        if (mongoose.connection.readyState !== 1) {
          const doc = { ...req.body, _id: 'mock-id-' + Date.now() };
          if (!doc.slug && doc[slugField]) {
            doc.slug = slugify(doc[slugField]);
          }
          memoryDb.add(Model.modelName, doc);
          return res.status(201).json({ success: true, data: doc });
        }

        if (!req.body.slug && req.body[slugField]) {
          req.body.slug = slugify(req.body[slugField]);
        }
        const doc = await Model.create(req.body);
        
        // Trigger live notifications and emails if an Event is published
        if (Model.modelName === 'Event') {
          import('./liveNotificationsController.js')
            .then(({ handleEventPublished }) => handleEventPublished(doc))
            .catch((err) => console.error('Failed to trigger handleEventPublished hook:', err.message));
        }

        res.status(201).json({ success: true, data: doc });
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      try {
        if (mongoose.connection.readyState !== 1) {
          return res.json({ success: true, data: { ...req.body, _id: req.params.id } });
        }

        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: doc });
      } catch (err) {
        next(err);
      }
    },

    remove: async (req, res, next) => {
      try {
        if (mongoose.connection.readyState !== 1) {
          return res.json({ success: true, message: 'Deleted (Database offline)' });
        }

        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
      } catch (err) {
        next(err);
      }
    },
  };
};
