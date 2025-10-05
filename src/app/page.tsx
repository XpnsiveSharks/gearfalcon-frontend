import Hero from "./shared/components/Hero";
import Services from "./shared/components/Services";
import HowItWorks from "./shared/components/HowItWorks";
import TrustedCorporations from "./shared/components/TrustedCorporations";
import ServiceCoverageAreas from "./shared/components/ServiceCoverageAreas";
import EmergencyService from "./shared/components/EmergencyService";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <TrustedCorporations />
      <ServiceCoverageAreas />
      <EmergencyService />
    </>
  );
}
