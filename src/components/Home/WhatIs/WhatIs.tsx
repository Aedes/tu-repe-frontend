import "./WhatIs.css"
import SubtitleItem from "../../common/SubtitleItem/SubtitleItem";
import { CompanyIcon, PlayIcon, StarsIcon, PlusIcon } from "../../../assets/Icons";
import ItemCard from "../../common/ItemCard/ItemCard";

const WhatIs = () => {
    return (
        <div id="whatis" className="whatIsContainer">
            <SubtitleItem
                text="¿Qué es Tu Repe?"
                icon={<PlayIcon width={"20px"} height={"20px"} fill="#0077b6" />}
            />
            <h2 className="whatIsTitle">La plataforma que conecta clubes con sus jugadores</h2>
            <p className="whatIsDescription">Tu repe es una plataforma donde los clubes deportivos alojan los videos de sus partidos y los jugadores pueden acceder fácilmente a ellos, <span className="whatIsSpan">sin mensajes, sin confusión y sin perder tiempo.</span></p>
            <h2 className="whatIsTitle2">¿Por qué unirte a Tu Repe?</h2>
            <p className="whatIsDescription">Simplifica la gestión de videos y mejora la experiencia de tus jugadores</p>
            <div className="itemCardContainer">
                <ItemCard
                    icon={
                        <StarsIcon width={"32px"} height={"32px"} fill="white" />
                    }
                    title="Mejor experiencia para tus jugadores"
                    description="Ofrece una experiencia premium con acceso instantáneo a videos de calidad. Tus jugadores volverán una y otra vez."
                    colorPrimary="#0077b6"
                    colorSecundary="#8ecae6"
                />
                <ItemCard
                    icon={
                        <PlusIcon width={"32px"} height={"32px"} fill="white" />
                    }
                    title="Sumá valor sin complicarte"
                    description="Ofrecé a tus jugadores la posibilidad de revivir sus partidos cuando quieran, sin cambiar tu operatoria diaria ni sumar trabajo extra."
                    colorPrimary="#40916c"
                    colorSecundary="#74c69d"
                />
                <ItemCard
                    icon={
                        <CompanyIcon width={"32px"} height={"32px"} fill="white" />
                    }
                    title="Tu club, tu identidad"
                    description="Cada club tiene su perfil personalizado con colores y marca propia. Fortalece tu identidad y destaca entre la competencia."
                    colorPrimary="#0077b6"
                    colorSecundary="#40916c"
                />
            </div>
        </div>
    );
}

export default WhatIs;
