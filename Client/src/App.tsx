import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App: React.FC = () => {

return (

<>
<ScrollToTop />
<Navbar />
<div className="h-[95px]" /> {/* bump this up if content is still hidden */}

<Outlet />

<Footer />
</>

);

};

export default App;
