import "./Home.css"
import NavBar from "../common/NavBar/NavBar";
import Hero from "./Hero/Hero";
import WhatIs from "./WhatIs/WhatIs";

const Home = () => {
    return (
        <div className="homeContainer">
            <NavBar/>
            <Hero/>
            <WhatIs/>
        </div>
    );
}

export default Home;
