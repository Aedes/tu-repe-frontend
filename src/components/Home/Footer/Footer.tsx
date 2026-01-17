import "./Footer.css"
import logo from "../../../assets/logo/logo.png"
import { InstagramIcon, MailIcon } from "../../../assets/Icons";

const Footer = () => {
    return (
        <footer id="footer" className="footerContainer">
            <div className="footerContent">
                <div className="logoAndDescriptionFooter">
                    <a href="#inicio" className="anchordLogo">
                        <div
                            className="logoContainer"
                        >
                            <img className="logoImg" src={logo} alt="Logo Tu Repe" />
                            <h2 className="navBarLogo">Tu Repe</h2>
                        </div>
                    </a>
                    <p>La plataforma que conecta clubes deportivos con sus jugadores. Revive cada jugada de tu partido, sin mensajes, sin confusión.</p>
                </div>
                <div className="fastAccess">
                    <h3>Acceso rápido</h3>
                    <ul className="fastAccessUl">
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#whatis">¿Qué es Tu Repe?</a></li>
                        <li><a href="#personalization">Para mi club</a></li>
                    </ul>
                </div>
                <div className="contactUs">
                    <h3>Seguinos</h3>
                    <div className="networks">
                        <div className="network">
                            <InstagramIcon
                                width={20}
                                height={20}
                                fill="#0077b6"
                            />
                            <p>
                                aedes.tech
                            </p>
                        </div>
                        <div className="network">
                            <MailIcon
                                width={20}
                                height={20}
                                fill="#0077b6"
                            />
                            <p>
                                aedestechnologies@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="credits">
                <p>© {new Date().getFullYear()} Tu Repe. Todos los derechos reservados.</p>
                <p>Powered by <a href="https://aedestec.com" target="_blank" rel="noopener noreferrer">Aedes</a></p>
            </div>
        </footer>
    );
}

export default Footer;
