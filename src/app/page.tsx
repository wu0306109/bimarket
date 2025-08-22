import HomeHero from '@/components/home/home-hero';
import FeatureHighlights from '@/components/home/feature-highlights';
import ContactSection from '@/components/home/contact-section';
import AboutSection from '@/components/home/about-section';
import Section from '@/components/home/section';
import SectionNav from '@/components/home/section-nav';

export default function Home() {
  return (
    <div style={{ scrollSnapType: 'y proximity', overflowY: 'auto' }}>
      <SectionNav />
      <Section id="hero">
        <HomeHero />
      </Section>
      <Section id="about">
        <AboutSection />
      </Section>
      <Section id="features">
        <FeatureHighlights />
      </Section>
      <Section id="contact">
        <ContactSection />
      </Section>
    </div>
  );
}
