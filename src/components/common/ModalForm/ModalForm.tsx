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
        required?: boolean;
    }>
    title: string
    initialData: { [key: string]: any }
    onSubmitForm: (data: {
        [key: string]: any
    }) => void;
    onClose: () => void
    disabledButtons?: boolean
    subtitle?: string
}

const ModalForm: React.FC<Props> = ({ isOpen, title, inputs, initialData, onSubmitForm, onClose, disabledButtons, subtitle }) => {
    const { dataForm, handleChange, deleteData } = useFormData(initialData)

    const handleCloseForm = () => {
        deleteData()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={handleCloseForm}>
            <div className="modalFormContainer">
                <div className="modalFormHeader">
                    <h2 className="modalFormTitle">{title}</h2>
                    {subtitle && <p className="modalSubtitle">{subtitle}</p>}
                </div>
                <form className="modalForm"
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmitForm(dataForm)
                    }}
                >
                    {
                        inputs.map((input, index) => (
                            <div className="modalFormField" key={index}>
                                <label htmlFor={input.name}>{input.required ? "* " : ""}{input.label}</label>
                                {
                                    input.type === "textarea" ? (
                                        <textarea
                                            id={input.name}
                                            name={input.name}
                                            placeholder={input.placeholder || ""}
                                            className="modalFormTextarea"
                                            onChange={handleChange}
                                            required={input.required || false}
                                            maxLength={200}
                                        />
                                    ) : (
                                        <input
                                            type={input.type}
                                            id={input.name}
                                            name={input.name}
                                            placeholder={input.placeholder || ""}
                                            className="modalFormInput"
                                            onChange={handleChange}
                                            required={input.required || false}
                                        />
                                    )
                                }
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
