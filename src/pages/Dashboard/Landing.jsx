import Footer from "../../components/Footer/footer";
import NavBar from "../../components/Navbar/navBar";
import Hero from "./Hero/hero";
import ServicesSection from "./Service_section/service_Section";
import CTASection from "./Service_section/CTA_section";

function Landing() {
    return (
        <>
            <NavBar />
            <Hero />
            <ServicesSection />
            <CTASection />
            <Footer />
        </>
    );
}

export default Landing;