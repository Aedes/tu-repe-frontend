import "./ModalLoading.css"
import Modal from "../Modal/Modal";

const ModalLoading: React.FC<{
    text: string,
    isOpen: boolean
}> = ({ text, isOpen }) => {
    return (
        <Modal isOpen={isOpen}>
            <div className="modal-loading">
                <div className="spinner"></div>
                <p>{text}</p>
            </div>
        </Modal>
    );
}

export default ModalLoading;
