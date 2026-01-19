import "./Home.css"
import Hero from "./Hero/Hero";
import WhatIs from "./WhatIs/WhatIs";
import NavBar from "../common/NavBar/NavBar";
import Personalization from "./Personalization/Personalization";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";

const Home = () => {
    return (
        <div className="homeContainer">
            <NavBar context="landing" />
            <Hero />
            <WhatIs />
            <Personalization />
            <Contact />
            <Footer />
        </div>
    );
}

export default Home;
