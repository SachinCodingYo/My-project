import HeroSection from "../home/HeroSection"
import CountrySection from "../home/CountrySection"
import WhyRapportSection from "../home/WhyRapportSection"
// import CompareProvidersSection from "../home/CompareProvidersSection"
import ServicesSection from "../home/ServicesSection"
import ReviewsSection from "../home/ReviewsSection"

// import PlansSection from "../home/PlansSection"
import PopularPlansPage from "../home/PopularPlansPage"
import UpdatesSection from "../home/UpdatesPage"
import BillPayments from "../home/BillPayments"






const Home = () => {

    return (

        <div>
            <HeroSection />
            <PopularPlansPage />
            <ServicesSection />
            <CountrySection />
            <BillPayments />
            {/* <CompareProvidersSection /> */}
            {/* <PlansSection /> */}
            <WhyRapportSection />
            <UpdatesSection />
            <ReviewsSection />
        </div>

    )

}

export default Home