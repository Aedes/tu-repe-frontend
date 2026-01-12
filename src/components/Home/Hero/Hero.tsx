import "./Hero.css"
import Button from "../../common/Button/Button";
import { SearchIcon, CameraIcon } from "../../../assets/Icons";

const Hero = () => {
    return (
        <div className="heroSection">
                <h1><span>Tu Repe</span>. Donde los partidos vuelven a jugarse.</h1>
                <p className="heroDescription">Tu Repe conecta complejos deportivos con sus jugadores. Grabamos tus partidos y te entregamos el video completo del juego.</p>
                <Button 
                    onClick={()=> console.log("")}
                    icon={<CameraIcon
                        width={20} 
                        height={20} 
                        fill="blacks"
                    />}
                >
                    Sumá Tu Repe a tu complejo
                </Button>
                <div className="searchClubSection">
                    <h3>¿Jugaste un partido? Buscá tu club</h3>
                    <div className="searchInputAndButtonContainer">
                        <div className="searchInputContainer">
                            <SearchIcon
                                width={20}
                                height={20}
                                fill="gray"
                            />
                            <input className="searchInput" type="text" placeholder="Escribí el nombre del club o complejo..." />
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Hero;
