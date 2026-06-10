import { sendEmail } from '../utils/email.js';
import User from '../models/User.js';

// Global array to store active SSE connections (express responses)
const sseClients = [];

// SSE endpoint handler
export const sseNotifications = (req, res) => {
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*', // Allow cross-origin connection
  });

  // Keep connection open with a heartbeat
  res.write('\n');

  // Add client to active connections
  sseClients.push(res);
  console.log(`[SSE Client Connected] Active clients: ${sseClients.length}`);

  // Heartbeat interval to prevent socket timeout
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // Handle client disconnection
  req.on('close', () => {
    clearInterval(heartbeat);
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
    console.log(`[SSE Client Disconnected] Active clients: ${sseClients.length}`);
  });
};

// Function to broadcast new event notifications to connected clients and trigger emails
export const handleEventPublished = async (eventDoc) => {
  console.log(`[Live Notification] Broadcasting new event: ${eventDoc.title}`);

  // 1. Send SSE Live Notification to all connected browsers
  const notificationPayload = {
    type: 'NEW_EVENT',
    data: {
      id: eventDoc._id,
      title: eventDoc.title,
      slug: eventDoc.slug,
      shortDescription: eventDoc.shortDescription || eventDoc.description.substring(0, 100),
      category: eventDoc.category,
      date: eventDoc.date,
      location: eventDoc.location,
    }
  };

  sseClients.forEach((client) => {
    client.write(`data: ${JSON.stringify(notificationPayload)}\n\n`);
  });

  // 2. Send email notification to all registered users (or admin/testing subscribers)
  try {
    const users = await User.find({ isActive: true }, 'email');
    const emailRecipients = users.map((u) => u.email);

    if (emailRecipients.length > 0) {
      console.log(`[Email Notification] Dispatched notification to ${emailRecipients.length} users.`);
      
      // Send mail to the users (in a real app we'd BCC or send individually, for testing we'll send to the active user list)
      const recipientString = emailRecipients.join(', ');
      
      const emailInfo = await sendEmail({
        to: recipientString,
        subject: `🚨 New ACM Event Published: ${eventDoc.title}`,
        text: `A new event "${eventDoc.title}" has been published by the Admin! Date: ${new Date(eventDoc.date).toLocaleDateString()}, Location: ${eventDoc.location}. Description: ${eventDoc.shortDescription || eventDoc.description}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #005daa; margin-top: 0;">New Event Announcement!</h2>
            <p>Hello ACM Community,</p>
            <p>We are excited to announce a new event has been published by the admin:</p>
            <div style="background-color: #f5f9fc; padding: 15px; border-left: 4px solid #005daa; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #004a88;">${eventDoc.title}</h3>
              <p><strong>Category:</strong> ${eventDoc.category.toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(eventDoc.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> ${eventDoc.location || 'Online'}</p>
              <p style="margin-bottom: 0;">${eventDoc.shortDescription || eventDoc.description}</p>
            </div>
            <p>Visit the events page of our website to register!</p>
            <p>Best regards,<br/><strong>ACM NMIMS Indore Student Chapter</strong></p>
          </div>
        `,
      });

      if (emailInfo?.previewUrl) {
        console.log(`[Email Notification] Test Email Preview URL: ${emailInfo.previewUrl}`);
      }
    } else {
      console.log('[Email Notification] No active users to notify.');
    }
  } catch (err) {
    console.error('Error dispatching published event email notifications:', err.message);
  }
};
