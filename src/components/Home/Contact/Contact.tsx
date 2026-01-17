import "./Contact.css"
import Button from "../../common/Button/Button";
import { CameraIcon } from "../../../assets/Icons";

const Contact = () => {
    return (
        <div className="contactContainer">
            <h2>¿Listo para ofrecer esta experiencia en tu complejo?</h2>
            <p>Unite a los complejos deportivos que ya están revolucionando la experiencia de sus jugadores.</p>
            <Button
                width="max-content"
                onClick={() => console.log("")}
                icon={<CameraIcon
                    width={20}
                    height={20}
                    fill="blacks"
                />}
            >
                Sumá Tu Repe a tu complejo
            </Button>
        </div>
    );
}

export default Contact;
