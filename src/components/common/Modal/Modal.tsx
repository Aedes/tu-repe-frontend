import "./Modal.css"
import { useState, useEffect } from "react"

interface Props {
    isOpen: boolean
    children: React.ReactNode
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: React.FC<Props> = ({ isOpen, children, setIsOpen }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setClosing(false);
            document.body.classList.add("modal-open");
        } else {
            setClosing(true);
            document.body.classList.remove("modal-open");

            const timeout = setTimeout(() => {
                setShouldRender(false);
                setClosing(false);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!shouldRender) return null

    return (
        <div className={`modalOverlay ${closing ? "closing" : "opening"}`}>
            <div className="modalContent">
                {
                    setIsOpen && (
                        <button
                            className="modalCloseButton"
                            aria-label="Cerrar"
                            onClick={() => {
                                setIsOpen(false)
                            }}
                        >
                            &times;
                        </button>
                    )
                }
                <div className="modalBody">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal;
