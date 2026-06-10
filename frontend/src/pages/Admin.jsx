import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import { createItem, fetchList, requestPublishOtp, verifyAndPublishEvent, deleteItem, uploadFile } from '../services/api'

export default function Admin() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('events')
  const [applications, setApplications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [pendingEvent, setPendingEvent] = useState(null)

  // Gallery Management States
  const [galleryItems, setGalleryItems] = useState([])
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'events',
    type: 'image',
    videoUrl: '',
    description: '',
    eventName: '',
    year: '2024',
  })
  const [selectedMediaFile, setSelectedMediaFile] = useState(null)
  const [mediaLoading, setMediaLoading] = useState(false)

  const handleCopyEmails = () => {
    if (applications.length === 0) {
      toast.error('No emails to copy.')
      return
    }
    const emails = applications.map(app => app.email).join(', ')
    navigator.clipboard.writeText(emails)
    toast.success('All registered email IDs copied to clipboard!')
  }

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.rollNumber && app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'workshop',
    date: '',
    location: '',
    registrationLimit: 100,
  })
  const [selectedEventImage, setSelectedEventImage] = useState(null)
  const [eventFileKey, setEventFileKey] = useState(0)

  const loadGallery = async () => {
    try {
      const data = await fetchList('gallery')
      setGalleryItems(data.data || data)
    } catch (err) {
      console.error('Failed to load gallery:', err.message)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('acm_token')
    const savedUser = localStorage.getItem('acm_user')

    if (!token || !savedUser) {
      toast.error('Unauthorized access. Please log in.')
      navigate('/membership')
      return
    }

    const parsedUser = JSON.parse(savedUser)
    setUser(parsedUser)

    // Load recruitment applications
    const loadApplications = async () => {
      try {
        const data = await fetchList('applications')
        setApplications(data.data || data)
      } catch (err) {
        console.error('Failed to load applications:', err.message)
      }
    }
    loadApplications()
    loadGallery()
  }, [navigate])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedMediaFile(file)
      // Auto-detect type
      if (file.type.startsWith('video/')) {
        setGalleryForm(prev => ({ ...prev, type: 'video' }))
      } else {
        setGalleryForm(prev => ({ ...prev, type: 'image' }))
      }
    }
  }

  const handleUploadGallery = async (e) => {
    e.preventDefault()
    if (!selectedMediaFile && galleryForm.type === 'image') {
      toast.error('Please select an image file to upload.')
      return
    }
    setMediaLoading(true)
    try {
      let uploadedUrl = ''
      if (selectedMediaFile) {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = (err) => reject(err)
          reader.readAsDataURL(selectedMediaFile)
        })

        const uploadRes = await uploadFile(selectedMediaFile.name, base64Data)
        uploadedUrl = uploadRes.url
      }

      const payload = {
        title: galleryForm.title,
        category: galleryForm.category,
        type: galleryForm.type,
        description: galleryForm.description,
        eventName: galleryForm.eventName,
        tags: [galleryForm.year],
        imageUrl: galleryForm.type === 'image' ? uploadedUrl : (uploadedUrl || '/images/hero-summit.png'),
        videoUrl: galleryForm.type === 'video' ? (uploadedUrl || galleryForm.videoUrl) : '',
      }

      await createItem('gallery', payload)
      toast.success('Media added to gallery successfully!')
      
      setGalleryForm({
        title: '',
        category: 'events',
        type: 'image',
        videoUrl: '',
        description: '',
        eventName: '',
        year: '2024',
      })
      setSelectedMediaFile(null)
      loadGallery()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add gallery item.')
    } finally {
      setMediaLoading(false)
    }
  }

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return
    try {
      await deleteItem('gallery', id)
      toast.success('Gallery item deleted successfully')
      loadGallery()
    } catch (err) {
      toast.error('Failed to delete gallery item')
    }
  }

  const handlePublishEvent = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let uploadedUrl = '/images/hero-summit.png'
      if (selectedEventImage) {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = (err) => reject(err)
          reader.readAsDataURL(selectedEventImage)
        })

        const uploadRes = await uploadFile(selectedEventImage.name, base64Data)
        uploadedUrl = uploadRes.url
      }

      const payload = {
        ...eventForm,
        registrationLimit: Number(eventForm.registrationLimit),
        isUpcoming: true,
        status: 'upcoming',
        coverImage: uploadedUrl
      }

      await createItem('events', payload)
      toast.success('Event Published Successfully! Live notification broadcasted.')
      resetEventForm()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish event.')
    } finally {
      setLoading(false)
    }
  }

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      shortDescription: '',
      category: 'workshop',
      date: '',
      location: '',
      registrationLimit: 100,
    })
    setSelectedEventImage(null)
    setEventFileKey(prev => prev + 1)
  }

  const handleLogout = () => {
    localStorage.removeItem('acm_token')
    localStorage.removeItem('acm_user')
    toast.success('Logged out successfully.')
    navigate('/membership')
  }

  if (!user) return null

  return (
    <>
      <SEO title="Admin Dashboard" description="ACM NMIMS Indore Admin Portal" />
      <PageHero badge="Console" title="Admin Dashboard" subtitle={`Welcome, ${user.name} (${user.role.toUpperCase()})`} />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Controls */}
            <div className="space-y-4">
              <GlassCard className="p-4 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'events' ? 'bg-acm-blue text-white' : 'hover:bg-white/5 text-neutral-300'
                  }`}
                >
                  📢 Publish New Event
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'gallery' ? 'bg-acm-blue text-white' : 'hover:bg-white/5 text-neutral-300'
                  }`}
                >
                  🖼️ Manage Gallery ({galleryItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === 'applications' ? 'bg-acm-blue text-white' : 'hover:bg-white/5 text-neutral-300'
                  }`}
                >
                  👥 Registrations & Emails ({applications.length})
                </button>
                <div className="h-px bg-[var(--border-color)] my-2" />
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10"
                >
                  Log Out
                </Button>
              </GlassCard>
            </div>

            {/* Dashboard Content */}
            <div className="lg:col-span-3">
              {activeTab === 'events' ? (
                <GlassCard className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">Publish a Chapter Event</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Live Broadcast Channel Active
                    </span>
                  </div>

                  <form onSubmit={handlePublishEvent} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Event Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. HackSprint 2026"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Category</label>
                        <select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-acm-blue outline-none transition-colors"
                        >
                          <option value="workshop">Workshop</option>
                          <option value="hackathon">Hackathon</option>
                          <option value="seminar">Seminar</option>
                          <option value="competition">Competition</option>
                          <option value="meetup">Chapter Meetup</option>
                          <option value="summit">National Summit</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Event Date</label>
                        <input
                          type="datetime-local"
                          required
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Location/Venue</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Auditorium / Online"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Registration Limit</label>
                        <input
                          type="number"
                          required
                          value={eventForm.registrationLimit}
                          onChange={(e) => setEventForm({ ...eventForm, registrationLimit: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Event Cover Image</label>
                        <input
                          key={eventFileKey}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedEventImage(e.target.files[0])}
                          className="w-full px-4 py-2 flex items-center rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-acm-blue/10 file:text-acm-blue hover:file:bg-acm-blue/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Brief Tagline (Short Description)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A 24-hour national hackathon for green technology innovations."
                        value={eventForm.shortDescription}
                        onChange={(e) => setEventForm({ ...eventForm, shortDescription: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] focus:border-acm-blue outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Detailed Description</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Provide full details about speakers, registration, prerequisites, and itinerary..."
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] resize-none focus:border-acm-blue outline-none transition-colors"
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full mt-4">
                      {loading ? 'Publishing...' : '🚀 Publish & Send Broadcast Alerts'}
                    </Button>
                  </form>
                </GlassCard>
              ) : activeTab === 'gallery' ? (
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                  {/* Upload Form */}
                  <GlassCard className="p-8">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 font-sans">Upload Media to Gallery</h3>
                    <form onSubmit={handleUploadGallery} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Media Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. National Summit Highlights"
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-sm focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Category</label>
                          <select
                            value={galleryForm.category}
                            onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:border-acm-blue outline-none transition-colors"
                          >
                            <option value="events">Events</option>
                            <option value="workshops">Workshops</option>
                            <option value="competitions">Competitions</option>
                            <option value="team">Team</option>
                            <option value="campus">Campus</option>
                            <option value="videos">Videos</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Media Type</label>
                          <select
                            value={galleryForm.type}
                            onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:border-acm-blue outline-none transition-colors"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Event Name</label>
                          <input
                            type="text"
                            placeholder="e.g. ACM Summit 2024"
                            value={galleryForm.eventName}
                            onChange={(e) => setGalleryForm({ ...galleryForm, eventName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-sm focus:border-acm-blue outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Year / Tag</label>
                          <select
                            value={galleryForm.year}
                            onChange={(e) => setGalleryForm({ ...galleryForm, year: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:border-acm-blue outline-none transition-colors"
                          >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2019">2019</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                          {galleryForm.type === 'image' ? 'Select Image File' : 'Select Video File'}
                        </label>
                        <input
                          type="file"
                          accept={galleryForm.type === 'image' ? 'image/*' : 'video/*'}
                          onChange={handleFileChange}
                          className="w-full px-4 py-2.5 flex items-center rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-acm-blue/10 file:text-acm-blue hover:file:bg-acm-blue/20"
                        />
                      </div>

                      {galleryForm.type === 'video' && (
                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Or External Video URL (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. YouTube / Instagram Reel URL"
                            value={galleryForm.videoUrl}
                            onChange={(e) => setGalleryForm({ ...galleryForm, videoUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-sm focus:border-acm-blue outline-none transition-colors"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Description</label>
                        <textarea
                          rows={3}
                          placeholder="Brief context..."
                          value={galleryForm.description}
                          onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-sm resize-none focus:border-acm-blue outline-none transition-colors"
                        />
                      </div>

                      <Button type="submit" disabled={mediaLoading} className="w-full mt-2">
                        {mediaLoading ? 'Uploading...' : '🖼️ Add to Gallery'}
                      </Button>
                    </form>
                  </GlassCard>

                  {/* Gallery List Grid */}
                  <GlassCard className="p-8 flex flex-col">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 font-sans">Current Gallery Items</h3>
                    {galleryItems.length === 0 ? (
                      <p className="text-[var(--text-secondary)] text-sm">No items in the gallery yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                        {galleryItems.map((item) => (
                          <div key={item._id} className="relative rounded-xl overflow-hidden group border border-[var(--border-color)] bg-black/30 h-28">
                            {item.type === 'video' ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-blue-950/20 text-acm-blue font-bold text-[10px] p-2 text-center">
                                <span>📹 Video Link</span>
                                <span className="text-[var(--text-primary)] dark:text-white mt-1 text-[9px] line-clamp-1">{item.title}</span>
                              </div>
                            ) : (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2.5 transition-all">
                              <p className="text-[10px] text-white font-semibold line-clamp-2">{item.title}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white capitalize">{item.category}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryItem(item._id)}
                                  className="text-red-400 hover:text-red-300 text-xs p-1"
                                  title="Delete item"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </div>
              ) : (
                <GlassCard className="p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)]">Chapter Registrations</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Manage membership, volunteer, and recruitment submissions</p>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        onClick={handleCopyEmails}
                        variant="secondary"
                        className="px-4 py-2 border-acm-blue/30 text-acm-blue hover:bg-acm-blue/10 text-xs font-semibold"
                      >
                        📋 Copy All Registered Email IDs
                      </Button>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl glass border border-[var(--border-color)] bg-white/5">
                      <p className="text-xs text-[var(--text-secondary)]">Total Registered</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{applications.length}</p>
                    </div>
                    <div className="p-4 rounded-xl glass border border-[var(--border-color)] bg-white/5">
                      <p className="text-xs text-[var(--text-secondary)]">Memberships</p>
                      <p className="text-2xl font-bold text-acm-blue">
                        {applications.filter(a => a.type === 'membership').length}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl glass border border-[var(--border-color)] bg-white/5">
                      <p className="text-xs text-[var(--text-secondary)]">Volunteers</p>
                      <p className="text-2xl font-bold text-green-400">
                        {applications.filter(a => a.type === 'volunteer').length}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl glass border border-[var(--border-color)] bg-white/5">
                      <p className="text-xs text-[var(--text-secondary)]">Recruitments</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {applications.filter(a => a.type === 'recruitment').length}
                      </p>
                    </div>
                  </div>

                  {/* Search filter */}
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Search by name, email, roll number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] text-sm focus:border-acm-blue outline-none transition-colors"
                    />
                  </div>

                  {filteredApplications.length === 0 ? (
                    <p className="text-[var(--text-secondary)] text-sm">No matching registrations found.</p>
                  ) : (
                    <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                      {filteredApplications.map((app) => (
                        <GlassCard key={app._id} className="p-4 border border-[var(--border-color)] hover:border-acm-blue/20 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <p className="font-bold text-[var(--text-primary)] text-base">{app.name}</p>
                              <p className="text-xs text-acm-blue font-mono select-all">{app.email}</p>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                Roll No: <span className="text-[var(--text-primary)]">{app.rollNumber || 'N/A'}</span> | 
                                Branch: <span className="text-[var(--text-primary)]">{app.branch || 'N/A'}</span> | 
                                Year: <span className="text-[var(--text-primary)]">{app.year || 'N/A'}</span>
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <span className={`text-xs px-2.5 py-1 rounded-full border capitalize font-semibold ${
                                app.type === 'membership' ? 'bg-acm-blue/10 text-acm-blue border-acm-blue/20' :
                                app.type === 'volunteer' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              }`}>
                                {app.type}
                              </span>
                              <span className="text-[10px] text-neutral-500">
                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                          </div>
                          {app.motivation && (
                            <p className="text-xs text-[var(--text-primary)] bg-black/5 dark:bg-black/25 p-3 rounded-lg mt-3 border border-[var(--border-color)] italic">
                              &ldquo;{app.motivation}&rdquo;
                            </p>
                          )}
                        </GlassCard>
                      ))}
                    </div>
                  )}
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
