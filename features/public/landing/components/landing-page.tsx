import Image from 'next/image';
import type { JSX } from 'react';
import { HeroSection } from './landing-hero';
import { AboutSection } from './landing-about';
import { ProgramsSection } from './landing-programs';
import { LearningSection } from './landing-learning';
import { AdmissionsSection } from './landing-admissions';
import { TestimonialsSection } from './landing-testimonials';
import { ContactSection } from './landing-contact';

const LandingPage = (): JSX.Element => (
  <div className="pb-16">
    <HeroSection />
    <AboutSection />
    <ProgramsSection />
    <LearningSection />
    <AdmissionsSection />
    <TestimonialsSection />
    <ContactSection />

    <a href="https://wa.me/51966845120?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20el%20CEBA%20Joseph%20Lister" target="_blank" rel="noreferrer" className="fixed bottom-5 right-4 z-40 inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-4 text-[10px] font-bold text-secondary-foreground shadow-lg shadow-secondary/20 transition-transform hover:scale-[1.03] sm:bottom-7 sm:right-7">
      <Image src="/icons/whatsapp-icon.svg" alt="" width={16} height={16} className="size-4" />
      <span className="hidden sm:inline">Asesoría por WhatsApp</span>
    </a>
  </div>
);

export { LandingPage };
