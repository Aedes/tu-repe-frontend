import { useUserActions } from "../../../../hooks/useUserActions";
import Button from "../../../common/Button/Button";
import { useUserStore } from "../../../../stores/userStore";

const CourtsForm = () => {
    const {
        isLoadingUpdateCourt
    } = useUserStore()

    const {
        courtToEdit,
        courtFormData,
        setCourtFormData,
        setIsOpenCourtForm,
        setCourtToEdit,
        resetCourtFormData,
        handleSubmitCourtForm
    } = useUserActions()

    const handleCloseCourtForm = () => {
        setIsOpenCourtForm(false);
        setCourtToEdit(null);
        resetCourtFormData();
    };

    const handleSubmitCourt = async () => {
        const success = await handleSubmitCourtForm();
        if (success) {
            handleCloseCourtForm();
        }
    };

    return (
        <div className="courtFormContainer">
            <h2 className="courtFormTitle">
                {courtToEdit ? "Editar Cancha" : "Nueva Cancha"}
            </h2>
            <form className="courtForm" onSubmit={(e) => { e.preventDefault(); handleSubmitCourt(); }}>
                <div className="divInputClubInfo">
                    <label>Nombre de la cancha *</label>
                    <input
                        type="text"
                        value={courtFormData.name || ""}
                        onChange={(e) => setCourtFormData({ ...courtFormData, name: e.target.value })}
                        placeholder="Cancha 1"
                        required
                    />
                </div>
                <div className="courtFormActions">
                    <Button
                        width={window.innerWidth < 510 ? "100%" : "auto"}
                        padding=".5rem 1rem"
                        margin="0"
                        onClick={handleCloseCourtForm}
                        backgroundColor="grey"
                        color="white"
                        type="button"
                        disabled={isLoadingUpdateCourt}
                    >
                        Cancelar
                    </Button>
                    <Button
                        width={window.innerWidth < 510 ? "100%" : "auto"}
                        padding=".5rem 1rem"
                        margin="0"
                        backgroundColor="rgb(0, 173, 0)"
                        color="white"
                        type="submit"
                        disabled={isLoadingUpdateCourt}
                    >
                        Guardar Cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CourtsForm;
