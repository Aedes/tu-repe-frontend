import "./Personalization.css"
import SubtitleItem from "../../common/SubtitleItem/SubtitleItem";
import { PencilIcon, CompanyIcon, PaintIcon, StarsIcon } from "../../../assets/Icons";

const Personalization = () => {
    return (
        <div className="personalizationContainer">
            <div className="personalizationContent">
                <SubtitleItem
                    text="Personalización total"
                    icon={<PencilIcon width={"20px"} height={"20px"} fill="#0077b6" />}
                />
                <h2 className="personalizationTitle">
                    Cada club es distinto.{" "}
                    <span>Tu Repe también.</span>
                </h2>
                <p className="whatIsDescription">Personalizá tu perfil con tus colores, imágenes y estilo para que tus jugadores se sientan como en casa.</p>
                <div className="examplesProfilesContainer">
                    <div className="exampleProfile futbol">
                        <div className="backgroundImageProfile backgroundFutbol">
                        </div>
                        <div className="logoExampleProfile">
                            <CompanyIcon
                                width={40}
                                height={40}
                                fill="white"
                            />
                        </div>
                        <div className="nameExampleProfileAndDescription">
                            <h3>Azul FC</h3>
                            <p>Colores corporativos únicos</p>
                        </div>
                    </div>
                    <div className="exampleProfile padel">
                        <div className="backgroundImageProfile backgroundPadel">
                        </div>
                        <div className="logoExampleProfile">
                            <CompanyIcon
                                width={40}
                                height={40}
                                fill="white"
                            />
                        </div>
                        <div className="nameExampleProfileAndDescription">
                            <h3>Pádel Verde</h3>
                            <p>Imágenes personalizadas</p>
                        </div>
                    </div>
                    <div className="exampleProfile basquet">
                        <div className="backgroundImageProfile backgroundBasquet">
                        </div>
                        <div className="logoExampleProfile">
                            <CompanyIcon
                                width={40}
                                height={40}
                                fill="white"
                            />
                        </div>
                        <div className="nameExampleProfileAndDescription">
                            <h3>Rojo Sports</h3>
                            <p>Estilo prolijo y distintivo</p>
                        </div>
                    </div>
                </div>
                <div className="characteristicsContainer">
                    <div className="characteristic blue">
                        <div className="charIconContainer">
                            <PaintIcon
                                width={20}
                                height={20}
                                fill="#0077b6"
                            />
                        </div>
                        <p className="charTitle">Colores personalizados</p>
                        <p className="charDescription">Refleja la identidad visual de tu club</p>
                    </div>
                    <div className="characteristic green">
                        <div className="charIconContainer">
                            <StarsIcon
                                width={20}
                                height={20}
                                fill="#40916c"
                            />
                        </div>
                        <p className="charTitle">Imágenes únicas</p>
                        <p className="charDescription">Elige tu foto de portada y perfil</p>
                    </div>
                    <div className="characteristic red">
                        <div className="charIconContainer">
                            <CompanyIcon
                                width={20}
                                height={20}
                                fill="rgb(221, 76, 76)"
                            />
                        </div>
                        <p className="charTitle">Tu marca</p>
                        <p className="charDescription">Fortalece tu presencia digital</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Personalization;
