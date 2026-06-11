import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import TeamMember from '../models/TeamMember.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Blog from '../models/Blog.js';
import Gallery from '../models/Gallery.js';
import Statistic from '../models/Statistic.js';
import Announcement from '../models/Announcement.js';

export const seed = async (shouldDisconnect = true) => {
  await Promise.all([
    User.deleteMany(),
    Event.deleteMany(),
    TeamMember.deleteMany(),
    Project.deleteMany(),
    Achievement.deleteMany(),
    Blog.deleteMany(),
    Gallery.deleteMany(),
    Statistic.deleteMany(),
    Announcement.deleteMany(),
  ]);

  await User.create({
    name: 'ACM Admin',
    email: process.env.ADMIN_EMAIL || 'acmnmims26@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@2026',
    role: 'admin',
  });

  await Statistic.insertMany([
    { key: 'events', label: 'Events Conducted', value: 48, suffix: '+' },
    { key: 'members', label: 'Active Members', value: 320, suffix: '+' },
    { key: 'projects', label: 'Projects Built', value: 24, suffix: '+' },
    { key: 'achievements', label: 'Achievements', value: 36, suffix: '+' },
  ]);

  const team = await TeamMember.insertMany([
    {
      name: 'Karishma Parwani',
      role: 'Chair',
      category: 'chairperson',
      image: '/images/team-chair.png',
      linkedin: 'https://linkedin.com',
      order: 1,
    },
    {
      name: 'Kanak Jaiswal',
      role: 'Vice Chair',
      category: 'vice-chairperson',
      image: '/images/team-vice-chair.png',
      linkedin: 'https://linkedin.com',
      order: 2,
    },
    {
      name: 'Rishabh Ahuja',
      role: 'Secretary',
      category: 'core-committee',
      image: '/images/team-secretary.png',
      order: 3,
    },
    {
      name: 'Heyramb Damle',
      role: 'Treasurer',
      category: 'core-committee',
      image: '/images/team-treasurer.png',
      order: 4,
    },
    {
      name: 'Aditya Mangwani',
      role: 'Webmaster',
      category: 'technical',
      image: '/images/team-webmaster.png',
      github: 'https://github.com',
      order: 5,
    },
    {
      name: 'Reet Khilwani',
      role: 'Membership Chair',
      category: 'core-committee',
      image: '/images/team-membership.png',
      order: 6,
    },
  ]);

  await Event.insertMany([
    {
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
      attendanceCount: 420,
      speakers: [
        { name: 'Dr. ACM Expert', title: 'ACM India Council', bio: 'Leading voice in computing education.' },
      ],
    },
    {
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
      title: 'AI/ML Workshop Series',
      slug: 'ai-ml-workshop-series',
      description: 'Hands-on workshops covering modern machine learning pipelines.',
      category: 'workshop',
      date: new Date('2026-07-10'),
      status: 'upcoming',
      registrationCount: 45,
      registrationLimit: 80,
    },
  ]);

  await Project.insertMany([
    {
      title: 'Chapter Portal CMS',
      slug: 'chapter-portal-cms',
      description: 'Full-stack content management system for ACM chapter operations.',
      shortDescription: 'Dynamic CMS for chapter content.',
      category: 'web-development',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
      githubUrl: 'https://github.com',
      isFeatured: true,
      stats: { stars: 42, forks: 12, contributors: 8 },
    },
    {
      title: 'Smart Campus IoT',
      slug: 'smart-campus-iot',
      description: 'IoT-based energy monitoring across campus buildings.',
      category: 'iot',
      technologies: ['Arduino', 'MQTT', 'Python', 'Grafana'],
      isFeatured: true,
    },
    {
      title: 'Research Paper Recommender',
      slug: 'research-paper-recommender',
      description: 'ML-powered system recommending ACM digital library papers.',
      category: 'ai-ml',
      technologies: ['Python', 'TensorFlow', 'FastAPI'],
    },
  ]);

  await Achievement.insertMany([
    {
      title: 'Best Student Chapter Website',
      category: 'acm-recognition',
      date: new Date('2025-03-01'),
      organization: 'ACM India',
      position: 'National Finalist',
      isFeatured: true,
    },
    {
      title: 'Smart India Hackathon 2025',
      category: 'hackathon',
      date: new Date('2025-08-20'),
      organization: 'SIH',
      position: 'Winner - Software Edition',
      isFeatured: true,
    },
  ]);

  await Blog.insertMany([
    {
      title: 'Building Web-Sprint 2026: Our Digital Legacy',
      slug: 'building-web-sprint-2026',
      excerpt: 'How we designed a award-worthy ACM chapter website.',
      content: 'Full article content about the Web-Sprint 2026 initiative...',
      author: 'Aditya Mangwani',
      category: 'technical',
      isPublished: true,
      publishedAt: new Date(),
      readTime: 8,
    },
  ]);

  await Gallery.insertMany([
    // 2024 Events
    {
      title: 'ACM Summit 2024 Presentation',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2024/09/IMG_4569-scaled.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'Distinguished speakers and student leaders sharing insights at the December 2024 Summit.',
      isFeatured: true,
    },
    {
      title: 'Summit Panel Discussion 2024',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2024/09/IMG_4628-scaled.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'Expert panel answering questions from students and delegates.',
      isFeatured: true,
    },
    {
      title: 'Auditorium Audience',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2024/09/a54d762d-94ac-43b3-8a48-c0397215634b.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'Full house at the main campus auditorium for the flagship summit.',
    },
    {
      title: 'Chapter Delegates Networking',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2024/09/IMG_4563-scaled.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'Delegates from chapters across India connecting and collaborating.',
    },
    {
      title: 'Summit Group Photo',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2024/09/IMG_4566-scaled.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'Group photo of organizing committee and delegates.',
      isFeatured: true,
    },
    {
      title: 'Chapter Summit Inauguration 2024',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2025/10/Summit-2024.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'Lighting of the lamp ceremony at Chapter Summit 2024.',
      isFeatured: true,
    },
    {
      title: 'ACM India leadership',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2025/10/SUMMIT-2024.jpeg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'ACM India Council and chapter advisors at NMIMS Indore.',
    },
    {
      title: 'Auditorium Highlights',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2025/10/NMIMS-Audi.webp',
      category: 'campus',
      eventName: 'ACM Chapter Summit December 2024',
      tags: ['2024'],
      description: 'NMIMS Indore state-of-the-art auditorium.',
    },

    // 2023 December
    {
      title: 'ACM Summit December 2023 Keynote',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/11/summit-new.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2023',
      tags: ['2023'],
      description: 'Inspirational keynote address on AI impact.',
      isFeatured: true,
    },
    {
      title: 'Chapter Interactive Session',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/image-2.jpg',
      category: 'workshops',
      eventName: 'ACM Chapter Summit December 2023',
      tags: ['2023'],
      description: 'Chapter representatives brainstorm next-gen coding workshops.',
    },
    {
      title: 'Delegate Discussions',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/image.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2023',
      tags: ['2023'],
      description: 'Delegates in deep discussion during the networking break.',
    },
    {
      title: 'December 2023 Panelists',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/DSC_0126-scaled.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2023',
      tags: ['2023'],
      description: 'Distinguished panel of experts from academic and industry sectors.',
    },
    {
      title: 'Summit Presentation',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/DSC_0097-scaled.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2023',
      tags: ['2023'],
      description: 'Presentation on student chapter growth and engagement strategies.',
    },
    {
      title: 'Interactive Q&A Session',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/DSC_0056-scaled.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit December 2023',
      tags: ['2023'],
      description: 'Students interacting with ACM India members during Q&A.',
    },

    // 2023 January
    {
      title: 'January 2023 Summit Welcome',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/summit-3.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit January 2023',
      tags: ['2023'],
      description: 'Delegates welcomed to the winter edition of the Chapter Summit.',
      isFeatured: true,
    },
    {
      title: 'Speaker Presentation Jan 2023',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/summit-2.png',
      category: 'events',
      eventName: 'ACM Chapter Summit January 2023',
      tags: ['2023'],
      description: 'Insightful tech talks covering decentralized architectures.',
    },
    {
      title: 'Technical Session Group',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/Summit-1.png',
      category: 'events',
      eventName: 'ACM Chapter Summit January 2023',
      tags: ['2023'],
      description: 'Faculty and student coordinators during the inauguration session.',
    },
    {
      title: 'January 2023 Delegate Meetup',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/IMG_20230120_195610.webp',
      category: 'campus',
      eventName: 'ACM Chapter Summit January 2023',
      tags: ['2023'],
      description: 'Delegates assembling at the summit registration desk.',
    },
    {
      title: 'Summit Dinner Networking',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/IMG_20230120_202449.webp',
      category: 'team',
      eventName: 'ACM Chapter Summit January 2023',
      tags: ['2023'],
      description: 'Networking dinner for chapter officers and ACM coordinators.',
    },

    // 2019
    {
      title: 'ACM Chapter Summit 2019 Keynote',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/IMG_8736-3-1.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit August 2019',
      tags: ['2019'],
      description: 'Opening remarks at the 2019 edition of ACM Chapter Summit.',
      isFeatured: true,
    },
    {
      title: 'Summit Panel Discussion 2019',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/IMG_8570-2-1.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit August 2019',
      tags: ['2019'],
      description: 'Eminent panel addressing regional computing challenges.',
      isFeatured: true,
    },
    {
      title: 'Student Innovation Showcase 2019',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/IMG_6678-1.jpg',
      category: 'competitions',
      eventName: 'ACM Chapter Summit August 2019',
      tags: ['2019'],
      description: 'Students presenting computing projects to national judges.',
    },
    {
      title: 'Regional Meetup Delegates',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/IMG_6739-1.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit August 2019',
      tags: ['2019'],
      description: 'Attendees representing student chapters from across the zone.',
    },
    {
      title: '2019 Closing Ceremony',
      imageUrl: 'https://event.india.acm.org/wp-content/uploads/2023/12/IMG_6544-1.jpg',
      category: 'events',
      eventName: 'ACM Chapter Summit August 2019',
      tags: ['2019'],
      description: 'Celebrating the success of the August 2019 Chapter Summit.',
    },
  ]);

  await Announcement.create({
    title: 'Web-Sprint 2026 Registration Open',
    message: 'Register now for the official launch event on June 20, 2026.',
    type: 'info',
    isActive: true,
    priority: 10,
  });

  console.log(`Seeded database with ${team.length} team members`);
  if (shouldDisconnect) {
    await mongoose.disconnect();
  }
};

import { fileURLToPath } from 'url';
const nodePath = fileURLToPath(import.meta.url);
if (process.argv[1] && (process.argv[1] === nodePath || process.argv[1].endsWith('seed.js'))) {
  const run = async () => {
    await connectDB();
    await seed(true);
  };
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
