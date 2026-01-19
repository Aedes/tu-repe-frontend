import "./ModalForm.css"
import { useFormData } from "../../../hooks/useFormData";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

interface Props {
    isOpen: boolean
    inputs: Array<{
        label: string;
        type: string;
        name: string;
        placeholder?: string;
    }>
    title: string
    initialData: { [key: string]: any }
    onSubmitForm: (data: {
        [key: string]: any
    }) => void;
    onClose: () => void
    disabledButtons?: boolean
}

const ModalForm: React.FC<Props> = ({ isOpen, title, inputs, initialData, onSubmitForm, onClose, disabledButtons }) => {
    const { dataForm, handleChange, deleteData } = useFormData(initialData)

    const handleCloseForm = () => {
        deleteData()
        onClose()
    }

    return (
        <Modal isOpen={isOpen}>
            <div className="modalFormContainer">
                <h2 className="modalFormTitle">{title}</h2>
                <form className="modalForm"
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmitForm(dataForm)
                    }}
                >
                    {
                        inputs.map((input, index) => (
                            <div className="modalFormField" key={index}>
                                <label htmlFor={input.name}>{input.label}</label>
                                <input
                                    type={input.type}
                                    id={input.name}
                                    name={input.name}
                                    placeholder={input.placeholder || ""}
                                    className="modalFormInput"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))
                    }
                    <div className="buttonsContainer">
                        <Button disabled={disabledButtons} onClick={handleCloseForm} margin="0" backgroundColor="grey" color="white" width="100px" padding=".5rem 1rem">Cancelar</Button>
                        <Button disabled={disabledButtons} type="submit" margin="0" backgroundColor="rgb(0, 173, 0)" color="white" width="100px" padding=".5rem 1rem">Enviar</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default ModalForm;
