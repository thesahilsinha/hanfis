import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import AIChat from '@/components/layout/AIChat'
import FloatingButtons from '@/components/layout/FloatingButtons'

<head>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
  <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
</head>

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