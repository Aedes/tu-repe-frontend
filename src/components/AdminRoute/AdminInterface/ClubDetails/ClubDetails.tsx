import "./ClubDetails.css"
import Button from "../../../common/Button/Button";
import { PlusIcon, CameraIcon, PencilIcon, ImageIcon } from "../../../../assets/Icons";
import { DEFAULT_COVER_IMAGE_URL, DEFAULT_PROFILE_IMAGE_URL } from "../../../../config";
import { useAdminActions } from "../../../../hooks/useAdminActions";

const ClubDetails = () => {
    const {
        courts,
        selectedClub,
        editedClubData,
        isClubDataChanged,
        courtToEdit,
        handleDeleteCover,
        handleDeleteLogo,
        handleCoverChange,
        handleLogoChange,
        setEditedClubData,
        setCourtToEdit,
        resetCourtFormData,
        setIsOpenCourtForm,
        setIsOpenClubDetails,
        resetSelectedClub,
        handleDeleteClub,
        handleUpdateClub,
        handleDeleteCourt
    } = useAdminActions()

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
        setIsOpenClubDetails(false);
        resetSelectedClub();
    };

    const handleDeleteClubAndClose = async () => {
        const success = await handleDeleteClub();
        if (success) {
            handleCloseClubDetails();
        }
    };

    return (
        <div className="clubDetailsContainer">
            <h2 className="clubDetailsTitle">Editar club</h2>
            <div className="clubDetails">
                <div className="courtsManagementContainer">
                    <div className="courtsManagementHeader">
                        <h3>Gestión de Canchas</h3>
                        <Button
                            width={window.innerWidth < 510 ? "100%" : "auto"}
                            margin="0"
                            padding=".5rem 1rem"
                            backgroundColor="rgb(0, 173, 0)"
                            color="white"
                            onClick={() => handleOpenCourtForm()}
                            icon={<PlusIcon width={16} height={16} fill="white" />}
                        >
                            Nueva Cancha
                        </Button>
                    </div>
                    {courts.length === 0 ? (
                        <div className="noCourtsMessage">
                            <CameraIcon width={48} height={48} fill="#ccc" />
                            <p>No hay canchas registradas</p>
                            <p className="noCourtsSubtext">Agrega una nueva cancha para comenzar</p>
                        </div>
                    ) : (
                        <div className="courtsList">
                            {courts.map((court) => (
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
                                            <button
                                                className="deleteCourtButton"
                                                onClick={() => handleDeleteCourt(`${court.id}`)}
                                                title="Eliminar cancha"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                    <div className="courtCardDetails">
                                        <div className="courtDetailItem">
                                            <span className="courtDetailLabel">Host de cámara:</span>
                                            <span className="courtDetailValue">{court.cameraHost}</span>
                                        </div>
                                        <div className="courtDetailItem">
                                            <span className="courtDetailLabel">Puerto:</span>
                                            <span className="courtDetailValue">{court.cameraPort}</span>
                                        </div>
                                        <div className="courtDetailItem">
                                            <span className="courtDetailLabel">Ruta:</span>
                                            <span className="courtDetailValue">{court.cameraPath}</span>
                                        </div>
                                        <div className="courtDetailItem">
                                            <span className="courtDetailLabel">Usuario RTSP:</span>
                                            <span className="courtDetailValue">{court.rtspUsername}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="coverImageContainer">
                    <h3>Foto de portada</h3>
                    <div className="coverImageWrapper"
                        style={{
                            backgroundImage: selectedClub?.coverImageUrl
                                ? `url(${selectedClub.coverImageUrl})`
                                : `url("${DEFAULT_COVER_IMAGE_URL}")`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                    />
                    <div className="buttonsCoverImageContainer">
                        <p className="pCoverImageContainer">La imagen se centrará automáticamente, recomendamos que lo que se quiera mostrar esté un poco más arriba del centro.</p>
                        <div className="buttonsCoverImageInnerContainer">
                            {
                                selectedClub.coverImageUrl &&
                                <Button
                                    width={window.innerWidth < 510 ? "100%" : "auto"} margin="0"
                                    padding=".5rem 1rem"
                                    color="white"
                                    backgroundColor="rgb(221, 76, 76)"
                                    onClick={handleDeleteCover}
                                >
                                    Eliminar
                                </Button>
                            }
                            <label className="customFileUpload">
                                <ImageIcon
                                    width={20}
                                    height={20}
                                    fill="black"
                                />
                                Cambiar portada
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="profileImageContainer">
                    <h3>Foto de perfil / Logo</h3>
                    <div className="profileImageInnerContainer">
                        <div className="profileImageWrapper">
                            <img
                                src={selectedClub.profileImageUrl ? selectedClub.profileImageUrl : DEFAULT_PROFILE_IMAGE_URL}
                                alt="Logo del club"
                                className="profileImage"
                            />
                        </div>
                        <div className="buttonsProfileImageContainer">
                            <p className="pProfilaImageContainer">Recomandación: 400x400px. El logo debe posicionarse en el medio de la foto</p>
                            <div className="buttonsProfileImageInnerContainer">
                                {
                                    selectedClub.profileImageUrl &&
                                    <Button
                                        width={window.innerWidth < 510 ? "100%" : "auto"}
                                        margin="0"
                                        padding=".5rem 1rem"
                                        color="white"
                                        backgroundColor="rgb(221, 76, 76)"
                                        onClick={handleDeleteLogo}
                                    >
                                        Eliminar
                                    </Button>
                                }
                                <label className="customFileUpload">
                                    <ImageIcon
                                        width={20}
                                        height={20}
                                        fill="black"
                                    />
                                    Cambiar logo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        style={{ display: "none" }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
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
                        onClick={handleDeleteClubAndClose}
                        backgroundColor="rgb(221, 76, 76)"
                        color="white"
                    >
                        Eliminar Club
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
        </div>
    );
}

export default ClubDetails;
