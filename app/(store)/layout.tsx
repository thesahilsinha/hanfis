import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import AIChat from '@/components/layout/AIChat'
import FloatingButtons from '@/components/layout/FloatingButtons'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
      <AIChat />
    </>
  )
}