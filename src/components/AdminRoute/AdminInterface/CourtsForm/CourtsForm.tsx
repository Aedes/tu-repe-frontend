import "./CourtsForm.css"
import { useAdminActions } from "../../../../hooks/useAdminActions";
import Button from "../../../common/Button/Button";
import { useAdminStore } from "../../../../stores/adminStore";

const CourtsForm = () => {
    const {
        isLoadingPostCourt,
        isLoadingUpdateCourt
    } = useAdminStore()

    const {
        courtToEdit,
        courtFormData,
        setCourtFormData,
        setIsOpenCourtForm,
        setCourtToEdit,
        resetCourtFormData,
        handleSubmitCourtForm
    } = useAdminActions()

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
                <div className="divInputClubInfoRow">
                    <div className="divInputClubInfo">
                        <label>Host de la cámara *</label>
                        <input
                            type="text"
                            value={courtFormData.cameraHost || ""}
                            onChange={(e) => setCourtFormData({ ...courtFormData, cameraHost: e.target.value })}
                            placeholder="192.168.1.100"
                            required
                        />
                    </div>
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
                        disabled={isLoadingPostCourt || isLoadingUpdateCourt}
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
                        disabled={isLoadingPostCourt || isLoadingUpdateCourt}
                    >
                        {courtToEdit ? "Guardar cambios" : "Crear cancha"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CourtsForm;
