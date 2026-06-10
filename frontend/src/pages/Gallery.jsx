import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Film, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Download, 
  Calendar, 
  Info,
  Maximize2
} from 'lucide-react'
import SEO from '../components/ui/SEO'
import PageHero from '../components/ui/PageHero'
import SectionHeader from '../components/ui/SectionHeader'
import GlassCard from '../components/ui/GlassCard'
import { galleryItems } from '../data/staticData'
import { useFetch } from '../hooks/useFetch'

const reels = [
  {
    id: 'DVK7MdmiK-H',
    title: 'Flagship Event Highlights',
    description: 'Relive the high-energy moments from our national summits, hackathons, and technical sessions.',
  },
  {
    id: 'DVK61PAiDOI',
    title: 'Core Committee & Team Introductions',
    description: 'Meet the student leadership team driving our programming chapter\'s vision and daily operations.',
  },
  {
    id: 'DVK69lTCCaN',
    title: 'Chapter Faculty Induction & Mentors',
    description: 'Meet our dedicated academic advisors guiding the SVKM NMIMS Indore chapter growth.',
  },
]

const years = ['All', '2024', '2023', '2019']

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('photos')
  const [selectedYear, setSelectedYear] = useState('All')
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 })

  // Fetch real images from backend, fall back to static scraped list
  const { data: rawPhotos, loading } = useFetch('gallery', {}, galleryItems)

  // Filter only images (type "image" or not video)
  const photos = rawPhotos.filter(item => item.type !== 'video')

  // Filter photos based on selected year (tags contain the year)
  const filteredPhotos = photos.filter(photo => {
    if (selectedYear === 'All') return true
    return photo.tags?.includes(selectedYear) || photo.eventName?.includes(selectedYear)
  })

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightbox({ isOpen: true, index })
  }

  const closeLightbox = () => {
    setLightbox({ isOpen: false, index: 0 })
  }

  const nextPhoto = (e) => {
    e?.stopPropagation()
    setLightbox(prev => ({
      ...prev,
      index: (prev.index + 1) % filteredPhotos.length
    }))
  }

  const prevPhoto = (e) => {
    e?.stopPropagation()
    setLightbox(prev => ({
      ...prev,
      index: (prev.index - 1 + filteredPhotos.length) % filteredPhotos.length
    }))
  }

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightbox.isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox.isOpen, filteredPhotos.length])

  const currentPhoto = filteredPhotos[lightbox.index]

  return (
    <>
      <SEO title="Chapter Gallery" description="NMIMS Indore ACM Chapter photo and video highlights." />
      
      <PageHero 
        badge="Memories" 
        title="Chapter Gallery" 
        subtitle="Capturing the milestones, innovation, and digital legacy of NMIMS Indore ACM." 
      />

      <section className="section-padding bg-[#050811] min-h-screen">
        <div className="container-wide">
          {/* Tab Selection */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-acm-blue/10 border border-acm-blue/20 rounded-xl backdrop-blur-md">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'photos'
                    ? 'bg-acm-blue text-white shadow-lg shadow-acm-blue/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ImageIcon size={18} />
                Photo Gallery
              </button>
              <button
                onClick={() => setActiveTab('reels')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'reels'
                    ? 'bg-acm-blue text-white shadow-lg shadow-acm-blue/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Film size={18} />
                Video Reels
              </button>
            </div>
          </div>

          {activeTab === 'photos' ? (
            <div>
              {/* Year Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                      selectedYear === year
                        ? 'bg-acm-blue border-acm-blue text-white shadow-md shadow-acm-blue/20'
                        : 'border-acm-blue/15 text-gray-400 hover:border-acm-blue/30 hover:text-white bg-acm-blue/5'
                    }`}
                  >
                    {year === 'All' ? 'All Years' : `Summit ${year}`}
                  </button>
                ))}
              </div>

              {/* Photo Grid */}
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredPhotos.map((photo, index) => (
                    <motion.div
                      key={photo._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      <GlassCard className="relative overflow-hidden p-0 border-acm-blue/15 hover:border-acm-blue/45 transition-all duration-300 h-full flex flex-col">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                          <img 
                            src={photo.imageUrl} 
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-[10px] bg-acm-blue text-white font-bold px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                              <Calendar size={10} />
                              {photo.tags?.[0] || 'Summit'}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Maximize2 size={14} className="text-white" />
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between bg-black/20">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-acm-blue transition-colors">
                              {photo.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 font-semibold mb-2">
                              {photo.eventName || 'ACM India Event'}
                            </p>
                          </div>
                          {photo.description && (
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                              {photo.description}
                            </p>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredPhotos.length === 0 && (
                <div className="text-center py-16">
                  <Info className="mx-auto text-gray-600 mb-3" size={32} />
                  <p className="text-gray-400 text-sm">No photos found for Summit {selectedYear}.</p>
                </div>
              )}
            </div>
          ) : (
            /* Instagram Reels Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-6 px-4 sm:px-0">
              {reels.map((reel) => (
                <GlassCard 
                  key={reel.id} 
                  className="flex flex-col h-full overflow-hidden p-0 !p-0 border-acm-blue/15 bg-gradient-to-b from-acm-blue/5 to-transparent hover:border-acm-blue/30 transition-all duration-300"
                >
                  <div className="relative w-full aspect-[9/16] bg-black max-h-[580px] overflow-hidden rounded-t-2xl">
                    <iframe
                      src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                      className="absolute inset-0 w-full h-full border-none"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency="true"
                      allow="encrypted-media"
                      title={reel.title}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{reel.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                      {reel.description}
                    </p>
                    <a
                      href={`https://www.instagram.com/reel/${reel.id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-acm-blue hover:underline font-bold text-xs uppercase tracking-wider mt-4"
                    >
                      View on Instagram →
                    </a>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.isOpen && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
          >
            {/* Top Toolbar */}
            <div className="flex justify-between items-center w-full z-10">
              <span className="text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {lightbox.index + 1} / {filteredPhotos.length} — Summit {currentPhoto.tags?.[0] || 'Event'}
              </span>
              <div className="flex gap-2">
                <a
                  href={currentPhoto.imageUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition"
                  title="Download Image"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={closeLightbox}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Middle Container (Image & Nav) */}
            <div className="relative flex items-center justify-center flex-1 w-full max-h-[80vh] my-4">
              {/* Prev Button */}
              <button
                onClick={prevPhoto}
                className="absolute left-2 md:left-6 z-10 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all duration-200"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Image */}
              <motion.img
                key={currentPhoto.imageUrl}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={currentPhoto.imageUrl}
                alt={currentPhoto.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5 select-none"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Next Button */}
              <button
                onClick={nextPhoto}
                className="absolute right-2 md:right-6 z-10 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all duration-200"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="w-full text-center max-w-3xl mx-auto pb-4 z-10">
              <h3 className="text-lg font-bold text-white mb-1">{currentPhoto.title}</h3>
              <p className="text-xs text-acm-blue font-bold tracking-wider mb-2">
                {currentPhoto.eventName || 'ACM Student Chapter Event'}
              </p>
              {currentPhoto.description && (
                <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  {currentPhoto.description}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
