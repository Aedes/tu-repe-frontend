import "./NavBar.css"
import logo from "../../../assets/logo/logo.png"
import { useState } from "react";
import { ExitIcon, MenuIcon } from "../../../assets/Icons";

const NavBar: React.FC<{ context: "landing" | "club" }> = ({ context }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className={`navBar ${context === 'landing' ? 'navBarLanding' : 'navBarClub'}`}>
            <div className="navBarContainer">
                <a href={`${context === "landing" ? "#inicio" : "/"}`} className="anchordLogo">
                    <div
                        className="logoContainer"
                    >
                        <img className="logoImg" src={logo} alt="Logo Tu Repe" />
                        <h2 className="navBarLogo">Tu Repe</h2>
                    </div>
                </a>
                {
                    context === "landing" &&
                    <>
                        <ul className="navBarLinks">
                            <li className="navBarLinkItem"><a href="#whatis">¿Qué es Tu Repe?</a></li>
                            <li className="navBarLinkItem"><a href="#personalization">Para mi club</a></li>
                            <li className="navBarLinkItem"><a href="#footer">Contacto</a></li>
                        </ul>
                        <div className="menuButton" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <ExitIcon width={25} height={25} fill="#0077b6" /> : <MenuIcon width={25} height={25} fill="#0077b6" />}
                        </div>
                        {isMenuOpen && (
                            <div className={`mobile-menu`}>
                                <nav className="mobile-nav">
                                    <a href="#inicio" className="mobile-link">Inicio</a>
                                    <a href="#whatis" className="mobile-link">¿Qué es Tu Repe?</a>
                                    <a href="#personalization" className="mobile-link">Para mi club</a>
                                    <a href="#footer" className="mobile-link">Contacto</a>
                                </nav>
                            </div>
                        )}
                    </>
                }
            </div>
        </nav>
    );
}

export default NavBar;
