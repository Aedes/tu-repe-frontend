import "./NavBar.css"
import logo from "../../../assets/logo/logo.png"

const NavBar = () => {
    return (
        <nav className="navBar">
            <div className="navBarContainer">
                <a href="#inicio" className="anchordLogo">
                    <div
                        className="logoContainer"
                    >
                        <img className="logoImg" src={logo} alt="Logo Tu Repe" />
                        <h2 className="navBarLogo">Tu Repe</h2>
                    </div>
                </a>
                <ul className="navBarLinks">
                    <li className="navBarLinkItem"><a href="#whatis">¿Qué es Tu Repe?</a></li>
                    <li className="navBarLinkItem"><a href="#personalization">Para mi club</a></li>
                    <li className="navBarLinkItem"><a href="#footer">Contacto</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
