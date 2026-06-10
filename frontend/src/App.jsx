import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster, toast } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Events, { EventDetail } from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Projects, { ProjectDetail } from './pages/Projects';
import Achievements from './pages/Achievements';
import Live from './pages/Live';
import Membership from './pages/Membership';
import Blogs, { BlogDetail } from './pages/Blogs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  // Listen for live event publish notifications from the backend
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const sseUrl = `${backendUrl}/notifications/live`;
    
    console.log('[SSE] Connecting to live notification stream:', sseUrl);
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'NEW_EVENT') {
          console.log('[SSE] Live notification received:', payload.data);
          
          // Show a beautiful sticky live toast notification
          toast((t) => (
            <div className="flex flex-col text-left py-1">
              <span className="font-bold text-sm text-[#005daa] flex items-center gap-1.5">
                🚨 Live Announcement!
              </span>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 mt-1">
                New Event Published: "{payload.data.title}"
              </span>
              <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                {payload.data.shortDescription}
              </p>
              <a 
                href={`/events/${payload.data.slug}`} 
                className="text-xs text-[#005daa] font-bold mt-2 hover:underline"
                onClick={() => toast.dismiss(t.id)}
              >
                Learn More & Register →
              </a>
            </div>
          ), { 
            duration: 10000,
            icon: '📢',
            style: {
              background: '#ffffff',
              color: '#333333',
              borderRadius: '12px',
              border: '1px solid #005daa',
              boxShadow: '0 10px 25px -5px rgba(0, 93, 170, 0.3)',
            }
          });
        }
      } catch (err) {
        console.error('[SSE] Error parsing notification payload:', err.message);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('[SSE] Notification stream disconnected, retrying...', err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          {/* Global Toast Notifications Container */}
          <Toaster position="top-right" />
          
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:slug" element={<EventDetail />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="team" element={<Team />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="live" element={<Live />} />
              <Route path="membership" element={<Membership />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/:slug" element={<BlogDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}
