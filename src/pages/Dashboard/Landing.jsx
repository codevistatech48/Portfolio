import Footer from "../../components/Footer/footer";
import Hero from "./Hero/hero";
import ServicesSection from "./Service_section/service_Section";
import CTASection from "./Service_section/CTA_section";

function Landing() {
    return (
        <>
            <Hero />
            <ServicesSection />
            <CTASection />
            <Footer />
        </>
    );
}

export default Landing;
