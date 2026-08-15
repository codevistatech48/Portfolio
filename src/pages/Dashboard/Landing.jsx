import Footer from "../../components/Footer/footer";
import Hero from "./Hero/hero";
import ServicesSection from "./Service_section/service_Section";
import ProcessSection from "./Service_section/ProcessSection";
import StatsSection from "./Service_sections/StatsSection";
import TechnologySection from "./Service_section/TechnologySection";
import CTASection from "./Service_section/CTA_section";

function Landing() {
    return (
        <>
            <Hero />
            <ServicesSection />
            <ProcessSection />
            <StatsSection />
            <TechnologySection />
            <CTASection />
            <Footer />
        </>
    );
}

export default Landing;
