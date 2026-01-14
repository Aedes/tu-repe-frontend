import "./NavBar.css"
import logo from "../../../assets/logo/logo.png"
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate()

    return (
        <nav className="navBar">
            <div className="navBarContainer">
                <div
                    className="logoContainer"
                    onClick={() => navigate("/")}
                >
                    <img className="logoImg" src={logo} alt="Logo Tu Repe" />
                    <h2 className="navBarLogo">Tu Repe</h2>
                </div>
                <ul className="navBarLinks">
                    <li className="navBarLinkItem">Cómo Funciona</li>
                    <li className="navBarLinkItem">Para mi club</li>
                    <li className="navBarLinkItem">Contacto</li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
