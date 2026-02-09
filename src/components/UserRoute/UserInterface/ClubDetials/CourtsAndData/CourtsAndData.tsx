import { toast } from "sonner";
import { CameraIcon, PencilIcon, CopyIcon } from "../../../../../assets/Icons";
import { useUserActions } from "../../../../../hooks/useUserActions";
import Button from "../../../../common/Button/Button";

const CourtsAndData = () => {

    const {
        selectedClub,
        editedClubData,
        courtToEdit,
        isClubDataChanged,
        setCourtToEdit,
        resetCourtFormData,
        setIsOpenCourtForm,
        setEditedClubData,
        setIsOpenClubForm,
        resetSelectedClub,
        handleUpdateClub,
    } = useUserActions()

    if (!selectedClub || !editedClubData) return null

    const handleOpenCourtForm = (court?: typeof courtToEdit) => {
        if (court) {
            setCourtToEdit(court);
        } else {
            setCourtToEdit(null);
            resetCourtFormData();
        }
        setIsOpenCourtForm(true);
    };

    const handleCloseClubDetails = () => {
        setIsOpenClubForm(false);
        resetSelectedClub();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://turepe.aedestec.com/c/${editedClubData?.urlId}`);
        toast.success("¡Link copiado!")
    }

    return (
        <div className="animationIn">
            <div className="courtsManagementContainer">
                <div className="courtsManagementHeader">
                    <h3>Gestión de Canchas</h3>
                </div>
                {selectedClub.courts.length === 0 ? (
                    <div className="noCourtsMessage">
                        <CameraIcon width={48} height={48} fill="#ccc" />
                        <p>No hay canchas registradas</p>
                        <p className="noCourtsSubtext">Agrega una nueva cancha para comenzar</p>
                    </div>
                ) : (
                    <div className="courtsList">
                        {selectedClub.courts.map((court) => (
                            <div key={court.id} className="courtCard">
                                <div className="courtCardHeader">
                                    <div className="courtCardTitle">
                                        <CameraIcon width={20} height={20} fill="#0077b6" />
                                        <h4>{court.name}</h4>
                                    </div>
                                    <div className="courtCardActions">
                                        <button
                                            className="editCourtButton"
                                            onClick={() => handleOpenCourtForm(court)}
                                            title="Editar cancha"
                                        >
                                            <PencilIcon width={16} height={16} fill="#0077b6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="courtCardDetails">
                                    <div className="courtDetailItem">
                                        <span className="courtDetailLabel">Host de cámara:</span>
                                        <span className="courtDetailValue">{court.cameraHost}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="clubInfoContainer">
                <div className="divInputClubInfo">
                    <label>Nombre del club:</label>
                    <input
                        type="text"
                        value={editedClubData.name}
                        onChange={(e) => setEditedClubData({ ...editedClubData, name: e.target.value })}
                    />
                </div>
                <div className="divInputClubInfo urlId">
                    <label>Link para jugadores:</label>
                    <div className="url">
                        <label>turepe.aedestec.com/c/</label>
                        <input
                            className="inputUrl"
                            type="text"
                            value={editedClubData.urlId}
                            onChange={(e) => setEditedClubData({ ...editedClubData, urlId: e.target.value.trim() })}
                        />
                    </div>
                    <Button
                        onClick={copyToClipboard}
                        margin="0"
                        padding=".5rem"
                        color="white"
                        backgroundColor="#0077b6"
                        width="min-content"
                        icon={
                            <CopyIcon
                                width={16}
                                height={16}
                                fill="white"
                            />
                        }
                    >
                        Copiar
                    </Button>
                </div>
                <div className="divInputClubInfoRow">
                    <div className="divInputClubInfo">
                        <label>Horario de apertura:</label>
                        <input
                            type="text"
                            value={`${editedClubData.openTime.split(":")[0]}:${editedClubData.openTime.split(":")[1]}`}
                            onChange={(e) => setEditedClubData({ ...editedClubData, openTime: `${e.target.value}:00` })}
                        />
                    </div>
                    <div className="divInputClubInfo">
                        <label>Horario de cierre:</label>
                        <input
                            type="text"
                            value={`${editedClubData.closeTime.split(":")[0]}:${editedClubData.closeTime.split(":")[1]}`}
                            onChange={(e) => setEditedClubData({ ...editedClubData, closeTime: `${e.target.value}:00` })}
                        />
                    </div>
                </div>
                <div className="divInputClubInfo">
                    <label>Duración de los turnos (en minutos): </label>
                    <input
                        type="number"
                        value={editedClubData.appointmentDuration}
                        onChange={(e) => setEditedClubData({ ...editedClubData, appointmentDuration: parseInt(e.target.value) })}
                    />
                </div>
                <div className="divInputClubInfoRow">
                    <div className="divInputClubInfo">
                        <label>País:</label>
                        <input
                            type="text"
                            value={editedClubData.country}
                            onChange={(e) => setEditedClubData({ ...editedClubData, country: e.target.value })}
                        />
                    </div>
                    <div className="divInputClubInfo">
                        <label>Provincia:</label>
                        <input
                            type="text"
                            value={editedClubData.province}
                            onChange={(e) => setEditedClubData({ ...editedClubData, province: e.target.value })}
                        />
                    </div>
                </div>
                <div className="divInputClubInfoRow">
                    <div className="divInputClubInfo">
                        <label>Cuidad:</label>
                        <input
                            type="text"
                            value={editedClubData.city}
                            onChange={(e) => setEditedClubData({ ...editedClubData, city: e.target.value })}
                        />
                    </div>
                    <div className="divInputClubInfo">
                        <label>Dirección:</label>
                        <input
                            type="text"
                            value={editedClubData.address}
                            onChange={(e) => setEditedClubData({ ...editedClubData, address: e.target.value })}
                        />
                    </div>
                </div>
                <div className="divInputClubInfo">
                    <label>Descripción:</label>
                    <textarea
                        value={editedClubData.description}
                        onChange={(e) => setEditedClubData({ ...editedClubData, description: e.target.value })}
                    />
                </div>
                <div className="divInputClubInfoRow">
                    <div className="divInputClubInfo">
                        <label>Teléfono del club:</label>
                        <input
                            type="text"
                            value={editedClubData.phone}
                            onChange={(e) => setEditedClubData({ ...editedClubData, phone: e.target.value })}
                        />
                    </div>
                    <div className="divInputClubInfo">
                        <label>Instagram del club:</label>
                        <input
                            type="text"
                            value={editedClubData.instagramHandle}
                            onChange={(e) => setEditedClubData({ ...editedClubData, instagramHandle: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div className="clubDetailsActions">
                <Button
                    width={window.innerWidth < 510 ? "100%" : "auto"} padding=".5rem 1rem"
                    margin="0"
                    onClick={handleCloseClubDetails}
                    backgroundColor="grey"
                    color="white"
                >
                    Cancelar
                </Button>
                <Button
                    width={window.innerWidth < 510 ? "100%" : "auto"} padding=".5rem 1rem"
                    margin="0"
                    onClick={handleUpdateClub}
                    backgroundColor="rgb(0, 173, 0)"
                    color="white"
                    disabled={!isClubDataChanged}
                >
                    Guardar cambios
                </Button>
            </div>
        </div>
    );
}

export default CourtsAndData;
