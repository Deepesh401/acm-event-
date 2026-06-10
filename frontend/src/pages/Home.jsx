import SEO from '../components/ui/SEO'
import Hero from '../components/Hero'
import StatsSection from '../components/home/StatsSection'
import { VisionMission, UpcomingEvents, FeaturedProjects, AchievementHighlights, JoinCTA } from '../components/home/HomeSections'
import { PartnersSection, FacultySection, SpeakersSection, InstagramSection } from '../components/home/ChapterSections'

export default function Home() {
  return (
    <>
      <SEO title="Home" description="NMIMS Indore ACM Student Chapter. Preserving Legacy. Showcasing Innovation." />
      <Hero />
      <StatsSection />
      <PartnersSection />
      <VisionMission />
      <FacultySection showCommittee={false} />
      <SpeakersSection />
      <UpcomingEvents />
      <FeaturedProjects />
      <AchievementHighlights />
      <InstagramSection />
      <JoinCTA />
    </>
  )
}
