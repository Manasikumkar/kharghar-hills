import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { PromotionalVideoSection } from './components/PromotionalVideoSection'
import { InfrastructureSection } from './components/InfrastructureSection'
import { LifestyleSection } from './components/LifestyleSection'
import { LocationSection } from './components/LocationSection'
import { PricingSection } from './components/PricingSection'
import { EnquirySection } from './components/EnquirySection'
import { FooterSection } from './components/FooterSection'
import { EnquiryModal } from './components/EnquiryModal'
import { FloatingContactBar } from './components/FloatingContactBar'

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalUnit, setModalUnit] = useState<string>('Help me decide')

  const handleOpenModal = (unitType?: string) => {
    if (unitType) {
      setModalUnit(unitType)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="kharghar-hills-landing-page">
      {/* Sticky Navigation */}
      <Navbar onOpenModal={() => handleOpenModal('General Enquiry')} />

      {/* Main Content Sections corresponding to Pages 1-7 */}
      <main id="main-content">
        {/* Page 1: Hero Section */}
        <HeroSection onOpenModal={() => handleOpenModal('1 & 2 BHK Advance Booking')} />

        {/* Promotional Video: A beautiful new address is on its way */}
        <PromotionalVideoSection onOpenModal={() => handleOpenModal('1 & 2 BHK Advance Booking')} />

        {/* Page 2: Signature Animated Infrastructure Moves */}
        <InfrastructureSection />

        {/* Page 3: Live. Shop. Play. Repeat. Lifestyle */}
        <LifestyleSection />

        {/* Page 4: The Hills. The City. The Best of Both Worlds */}
        <LocationSection />

        {/* Page 5: Your Home. Your Budget. Pricing */}
        <PricingSection onOpenModal={handleOpenModal} />

        {/* Page 6: Visit Us. Enquiry & Callback Form */}
        <EnquirySection />
      </main>

      {/* Page 7: Footer, Developer Logos, MahaRERA & Disclaimers */}
      <FooterSection />

      {/* Interactive Modals & Floating Mobile Controls */}
      <EnquiryModal
        key={modalUnit}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialUnit={modalUnit}
      />

      <FloatingContactBar onOpenModal={() => handleOpenModal('Quick Mobile Booking')} />
    </div>
  )
}

export default App
