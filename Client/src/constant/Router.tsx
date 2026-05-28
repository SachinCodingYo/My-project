import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../App";
import Loading from "../components/Loading";


const withSuspense = (Component: React.FC) => (
  <Suspense fallback={<Loading h="100vh" />}>
    <Component />
  </Suspense>
);

const Home = lazy(() => import("../pages/Home"));
const Aboutus = lazy(() => import("../pages/Aboutus"));
const Support = lazy(() => import("../pages/Support"));
const RefundPolicy = lazy(() => import("../pages/RefundPolicy"));
const Disclaimer = lazy(() => import("../pages/Disclaimer"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../pages/TermsConditions"));
const Hiring = lazy(() => import("../pages/Hiring"));
const RechargePlansInfo = lazy(() => import("../pages/RechargePlansInfo"));
const Prepaid = lazy(() => import("../pages/Prepaid"));
const Postpaid = lazy(() => import("../pages/Postpaid"));
const PortNumber = lazy(() => import("../pages/PortNumber"));
const FancyNumber = lazy(() => import("../pages/FancyNumber"));
const BusinessSim = lazy(() => import("../pages/BusinessSim"));
const PlanDetails = lazy(() => import("../pages/PlanDetails"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const HelpCenter = lazy(() => import("../pages/HelpCenter"));
const TrackRequest = lazy(() => import("../pages/TrackRequest"));
const RaiseComplaint = lazy(() => import("../pages/RaiseComplaint"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const SafetyInfo = lazy(() => import("../pages/SafetyInfo"));
const Profile = lazy(() => import("../pages/Profile"));
const BlogPage = lazy(() => import("../pages/BlogPage"));
const HeroSection = lazy(() => import("../home/HeroSection"));
const CountryPage = lazy(() => import("../home/CountrySection"));
const WhyRapportPage = lazy(() => import("../home/WhyRapportSection"));
const CompareProvidersPage = lazy(() => import("../home/CompareProvidersSection"));
const PlansPage = lazy(() => import("../home/PlansSection"));
const ServicesPage = lazy(() => import("../home/ServicesSection"));
const PopularPlansPage = lazy(() => import("../home/PopularPlansPage"));
const UpdatesPage = lazy(() => import("../home/UpdatesPage"));
const ReviewsPage = lazy(() => import("../home/ReviewsPage"));
const BillPayements = lazy(() => import("../home/BillPayments"));
const SimStore = lazy(() => import("../pages/SimStore"));
const Rewards = lazy(() => import("../pages/Rewards"));
const BuyNow = lazy(() => import("../payment/BuyNow"));
// const AllPlansPage = lazy(() => import("../pages/AllPlansPage"));
const BookNow = lazy(() => import("../pages/BookNow"));
const Cart = lazy(() => import("../pages/Cart"));
const BusinessCheckout = lazy (() => import ("../pages/BusinessCheckout"));
const Esim = lazy(() => import("../pages/Esim"));
const CountryPlansPage = lazy(() => import("../pages/CountryPlansPage"));
const Esimapp = lazy(() => import("../pages/Esimapp"));
const PlanDetailsPage = lazy(() => import("../pages/PlanDetailsPage"));
const RegionPage = lazy(() => import("../pages/RegionPage"));
const EsimBuyNowPage = lazy(() => import("../payment/EsimBuyNowPage"));


export const router = createBrowserRouter([

  {
    path: "",
    element: <AppLayout />,
    children: [

      {
        path: "/",
        element: withSuspense(Home)
      },

      {
        path: "/aboutus",
        element: withSuspense(Aboutus)
      },

      {
        path: "/support",
        element: withSuspense(Support)
      },

      {
        path: "/refund-policy",
        element: withSuspense(RefundPolicy)
      },

      {
        path: "/disclaimer",
        element: withSuspense(Disclaimer)
      },

      {
        path: "/privacypolicy",
        element: withSuspense(PrivacyPolicy)
      },

      {
        path: "/termsconditions",
        element: withSuspense(TermsConditions)
      },

      {
        path: "/hiring",
        element: withSuspense(Hiring)
      },

      {
        path: "/rechargeplan",
        element: withSuspense(RechargePlansInfo)
      },

      {
        path: "/prepaid",
        element: withSuspense(Prepaid)
      },

      {
        path: "/postpaid",
        element: withSuspense(Postpaid)
      },

      {
        path: "/portnumber",
        element: withSuspense(PortNumber)
      },

      {
        path: "/fancynumber",
        element: withSuspense(FancyNumber)
      },

      {
        path: "/businesssim",
        element: withSuspense(BusinessSim)
      },

      {
        path: "/prepaid/:operator",
        element: withSuspense(Prepaid)
      },

      {
        path: "/postpaid/:operator",
        element: withSuspense(Postpaid)
      },

      {
        path: "/portnumber/:operator",
        element: withSuspense(PortNumber)
      },

      {
        path: "/plan-details/:id" ,
        element: withSuspense(PlanDetails)
      },

      {
       path: "/checkout/:id",
        element: withSuspense(CheckoutPage)
      },
      {
        path: "/helpcenter",
        element: withSuspense(HelpCenter)
      },

      {
        path: "/trackrequest",
        element: withSuspense(TrackRequest)
      },

      {
        path: "/raisecomplaint",
        element: withSuspense(RaiseComplaint)
      },

      {
        path: "/contactus",
        element: withSuspense(ContactUs)
      },
      {
        path: "/safety-info",
        element: withSuspense(SafetyInfo)
      },
      {
        path: "/profile",
        element: withSuspense(Profile)
      },

      {
        path: "/blog/:id",
        element: withSuspense(BlogPage)
      },
      {
        path: "/hero",
        element: withSuspense(HeroSection)
      },

      {
        path: "/countries",
        element: withSuspense(CountryPage)
      },

      {
        path: "/why-rapport",
        element: withSuspense(WhyRapportPage)
      },

      {
        path: "/compare-providers",
        element: withSuspense(CompareProvidersPage)
      },

      {
        path: "/plans",
        element: withSuspense(PlansPage)
      },

      {
        path: "/services",
        element: withSuspense(ServicesPage)
      },

      {
        path: "/popular-plans",
        element: withSuspense(PopularPlansPage)
      },

      {
        path: "/updates",
        element: withSuspense(UpdatesPage)
      },

      {
        path: "/reviews",
        element: withSuspense(ReviewsPage)
      },
      {
        path: "/billpayments",
        element: withSuspense(BillPayements)
      },
      {
        path: "/simstore",
        element: withSuspense(SimStore)
      },
      {
        path: "/rewards",
        element: withSuspense(Rewards)
      },
        {
        path: "/buy-now/:id",
        element: withSuspense(BuyNow)
      },
      {
        path: "/book-now/:id",
        element: withSuspense(BookNow)
      },

      {
        path: "/cart",
        element: withSuspense(Cart)
      },

      {
  path: "/checkout/business/:id",
  element: withSuspense(BusinessCheckout)
    
},

{
  path: "/esim",
  element: withSuspense(Esim)
},
{
   path: "/country/:countryCode",
  element: withSuspense(CountryPlansPage)
},
{
  path: "/esimapp",
  element: withSuspense(Esimapp)
},

{
  path: "/plan/:id",
  element: withSuspense(PlanDetailsPage)
},

{
  path: "/region/:regionName",
  element: withSuspense(RegionPage)
},
{
  path: "/esim-buy-now/:planId",
  element: withSuspense(EsimBuyNowPage)
},

//       {  
// path:"/all-plans",
// element: withSuspense(AllPlansPage)

//       }



    ]

  }

]);
