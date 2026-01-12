import "./WhatIs.css"
import SubtitleItem from "../../common/SubtitleItem/SubtitleItem";
import { PlayIcon } from "../../../assets/Icons";

const WhatIs = () => {
    return (
        <div className="whatIsContainer">
            <SubtitleItem 
                text="¿Qué es Tu Repe?" 
                icon={<PlayIcon width={"20px"} height={"20px"} fill="#0077b6"/>}
            />
            <h2 className="whatIsTitle">La plataforma que conecta clubes con sus jugadores</h2>
            <p className="whatIsDescription">Tu repe es una plataforma donde los clubes deportivos alojan los videos de sus partidos y los jugadores pueden acceder fácilmente a ellos, <span className="whatIsSpan">sin mensajes, sin confusión y sin perder tiempo.</span></p>
            <h2 className="whatIsTitle2">¿Por qué unirte a Tu Repe?</h2>
            <p className="whatIsDescription">Simplifica la gestión de videos y mejora la experiencia de tus jugadores</p>
        </div>
    );
}

export default WhatIs;
