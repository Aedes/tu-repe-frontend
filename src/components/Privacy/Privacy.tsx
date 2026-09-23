import NavBar from "../common/NavBar/NavBar"
import "./Privacy.css"

const Privacy = () => {
    return (
        <div className="privacyPage">
            <NavBar context="club" />
            <article className="privacyContent">
                <h1>Privacidad y grabación</h1>
                <p>Tu Repe graba partidos en canchas de clubes adheridos y los pone a disposición mediante una búsqueda pública por club, cancha y horario.</p>
                <ul>
                    <li>Las grabaciones se conservan <strong>72 horas</strong> y luego se borran del almacenamiento y de la base de datos.</li>
                    <li>La búsqueda es pública: no hay cuenta ni código de turno. Un tercero que conozca o pruebe el horario puede ver el partido. CAPTCHA, límites y enlaces temporales reducen el scraping, pero no eliminan ese riesgo.</li>
                    <li>Los clubes deben señalizar las canchas y obtener el consentimiento de quienes juegan.</li>
                </ul>
                <p>Al usar el sitio aceptás esta política. Contacto: hola@turepe.aedestec.com</p>
            </article>
        </div>
    )
}

export default Privacy
