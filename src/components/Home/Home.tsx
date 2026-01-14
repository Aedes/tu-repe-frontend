import "./Home.css"
import Hero from "./Hero/Hero";
import WhatIs from "./WhatIs/WhatIs";
import NavBar from "../common/NavBar/NavBar";

const Home = () => {
    return (
        <div className="homeContainer">
            <NavBar />
            <Hero />
            <WhatIs />
        </div>
    );
}

export default Home;
