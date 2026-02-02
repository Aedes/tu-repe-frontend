import { DEFAULT_COVER_IMAGE_URL, DEFAULT_PROFILE_IMAGE_URL } from "../../../../../config";
import Button from "../../../../common/Button/Button";
import { ImageIcon, InstagramIcon, PhoneIcon, PinIcon, SearchIcon, CameraIcon } from "../../../../../assets/Icons";
import { useUserActions } from "../../../../../hooks/useUserActions";
import { useEffect } from "react";

const Personalization = () => {
    const {
        selectedClub,
        editedClubData,
        handleDeleteCover,
        handleDeleteLogo,
        handleLogoChange,
        handleCoverChange,
        setEditedClubData,
        handleChangeTheme
    } = useUserActions()

    if (!selectedClub || !editedClubData) return null

    useEffect(() => {
        if (!editedClubData) return

        const root = document.documentElement

        root.style.setProperty(
            '--color-primary',
            editedClubData.theme?.primary ?? '#0077b6'
        )

        root.style.setProperty(
            '--color-secondary',
            editedClubData.theme?.secondary ?? '#caf0f8'
        )

        root.style.setProperty(
            '--color-bg',
            editedClubData.theme?.background ?? '#edfafd'
        )
    }, [editedClubData.theme])

    const updateThemeColor = (colorKey: 'primary' | 'secondary' | 'background', value: string) => {
        const currentTheme = editedClubData.theme || {
            primary: "#0077b6",
            secondary: "#caf0f8",
            background: "#edfafd"
        };
        setEditedClubData({
            ...editedClubData,
            theme: {
                ...currentTheme,
                [colorKey]: value
            }
        });
    };

    const getThemeColor = (colorKey: 'primary' | 'secondary' | 'background') => {
        return editedClubData.theme?.[colorKey] ||
            (colorKey === 'primary' ? "#0077b6" :
                colorKey === 'secondary' ? "#caf0f8" : "#edfafd");
    };

    const setDefaultColors = () => {
        updateThemeColor("primary", "#0077b6")
        updateThemeColor("secondary", "#caf0f8")
        updateThemeColor("background", "#edfafd")
        setEditedClubData({
            ...editedClubData,
            theme: {
                primary: "#0077b6",
                secondary: "#caf0f8",
                background: "#edfafd",
            }
        })
    }

    return (
        <div className="animationIn">
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
            <div className="themeContainer">
                <h3>Personalización de Colores</h3>
                <p className="themeDescription">Personaliza los colores que se mostrarán en el perfil público del club.</p>
                <p className="themeDescription">Recomendamos un color sólido como prinicpal, que contraste bien con el blanco, un color más claro como secundario y uno casi blanco para el fondo.</p>
                <div className="themeColorsGrid">
                    <div className="themeColorInput">
                        <label htmlFor="theme-primary">Color Principal:</label>
                        <div className="colorInputWrapper">
                            <input
                                type="color"
                                id="theme-primary"
                                value={getThemeColor('primary')}
                                onChange={(e) => updateThemeColor('primary', e.target.value)}
                            />
                            <input
                                type="text"
                                value={getThemeColor('primary')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                                        updateThemeColor('primary', value);
                                    }
                                }}
                                placeholder="#0077b6"
                            />
                        </div>
                    </div>
                    <div className="themeColorInput">
                        <label htmlFor="theme-secondary">Color Secundario:</label>
                        <div className="colorInputWrapper">
                            <input
                                type="color"
                                id="theme-secondary"
                                value={getThemeColor('secondary')}
                                onChange={(e) => updateThemeColor('secondary', e.target.value)}
                            />
                            <input
                                type="text"
                                value={getThemeColor('secondary')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                                        updateThemeColor('secondary', value);
                                    }
                                }}
                                placeholder="#caf0f8"
                            />
                        </div>
                    </div>
                    <div className="themeColorInput">
                        <label htmlFor="theme-background">Color de Fondo:</label>
                        <div className="colorInputWrapper">
                            <input
                                type="color"
                                id="theme-background"
                                value={getThemeColor('background')}
                                onChange={(e) => updateThemeColor('background', e.target.value)}
                            />
                            <input
                                type="text"
                                value={getThemeColor('background')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                                        updateThemeColor('background', value);
                                    }
                                }}
                                placeholder="#edfafd"
                            />
                        </div>
                    </div>
                </div>
                <div className="themePreview">
                    <h4>Vista Previa:</h4>
                    <div className="themePreviewBox">
                        <div
                            className="clubImgPreview"
                            style={{
                                backgroundImage: selectedClub.coverImageUrl
                                    ? `url(${selectedClub.coverImageUrl})`
                                    : `url("${DEFAULT_COVER_IMAGE_URL}")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                        </div>
                        <div className="previewContent">
                            <div className="themePreviewHeader">
                                <div className="clubProfileLogoPreview"
                                    style={{
                                        border: `5px solid ${getThemeColor("primary")}`
                                    }}
                                >
                                    <img className="clubLogoImgPreview" src={selectedClub.profileImageUrl ? selectedClub.profileImageUrl : DEFAULT_PROFILE_IMAGE_URL} alt={`Logo Club ${selectedClub?.name}`} />
                                </div>
                                <div className="clubProfileNameAndDescription">
                                    <h5 style={{ margin: 0 }}>{selectedClub.name}</h5>
                                    {selectedClub.description && <p className="descriptionDesktopPreview">{selectedClub.description}</p>}
                                    <div className="clubProfileItems desktop">
                                        <div className="clubProfileItem">
                                            <PinIcon
                                                width="16"
                                                height="16"
                                                fill={getThemeColor("primary")}
                                            />
                                            <p className="pPreview">{selectedClub.address}, {selectedClub.city}, {selectedClub.province}</p>
                                        </div>
                                        {
                                            selectedClub.instagramHandle &&
                                            <div className="clubProfileItem">
                                                <InstagramIcon
                                                    width="16"
                                                    height="16"
                                                    fill={getThemeColor("primary")}
                                                />
                                                <p className="pPreview">{selectedClub.instagramHandle}</p>
                                            </div>
                                        }
                                        {
                                            selectedClub.phone &&
                                            <div className="clubProfileItem">
                                                <PhoneIcon
                                                    width="16"
                                                    height="16"
                                                    fill={getThemeColor("primary")}
                                                />
                                                <p className="pPreview">{selectedClub.phone}</p>
                                            </div>
                                        }
                                    </div>
                                    <div className="hoursContainer desktop">
                                        <p className="clubHours"><span>De</span> {selectedClub.openTime.split(":")[0]}:{selectedClub.openTime.split(":")[1]} a {selectedClub.closeTime.split(":")[0]}:{selectedClub.closeTime.split(":")[1]} hs</p>
                                    </div>
                                </div>
                            </div>
                            <div className="findYourMatchSectionPreview">
                                <div className="findYourMatchTitleContainer">
                                    <div className="findYourMatchHeaderPreview desktop">
                                        <div className="findYourMatchIcon">
                                            <SearchIcon
                                                width="32"
                                                height="32"
                                                fill={getThemeColor("primary")}
                                            />
                                        </div>
                                        <div className="findYourMatchTitleAndDescription">
                                            <h2>Encuentra tu partido</h2>
                                            <p>Selecciona cancha, fecha y horario para ver el video</p>
                                        </div>
                                    </div>
                                    <div className="findYourMatchHeader mobile">
                                        <div className="titleFindYourMatch">
                                            <div className="findYourMatchIcon">
                                                <SearchIcon
                                                    width="24"
                                                    height="24"
                                                    fill={getThemeColor("primary")}
                                                />
                                            </div>
                                            <h2>Encuentra tu partido</h2>
                                        </div>
                                        <div className="findYourMatchTitleAndDescription">
                                            <p>Selecciona cancha, fecha y horario para ver el video</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="filtersContainerPreview">
                                    <div className="filterContainer">
                                        <label htmlFor="filter-court" style={{ fontWeight: 500 }}>Selecciona una cancha:</label>
                                        <select id="filter-day" className="filter">
                                            <option value="">¿En qué cancha jugaste?</option>
                                        </select>
                                    </div>
                                    <div className="filterContainer">
                                        <label htmlFor="filter-day" style={{ fontWeight: 500 }}>Selecciona un día: </label>
                                        <select id="filter-day" className="filter">
                                            <option value="">Selecciona un día</option>
                                        </select>
                                    </div>
                                    <div className="filterContainer">
                                        <label htmlFor="filter-hour" style={{ fontWeight: 500 }}>Hora:</label>
                                        <select id="filter-hour" className="filter">
                                            <option value="">¿A qué hora?</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="buttonVideoContainerPreview">
                                    <Button
                                        margin="0"
                                        backgroundColor={getThemeColor("primary")}
                                        color="white"
                                        onClick={() => { }}
                                        icon={
                                            <CameraIcon
                                                width="24"
                                                height="24"
                                                fill="white"
                                            />
                                        }
                                        width={window.innerWidth <= 530 ? "100%" : ""}
                                    >
                                        Ver partido
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="colorsActions">
                    <Button
                        onClick={setDefaultColors}
                        margin="0"
                        padding=".5rem .8rem"
                        color="white"
                        backgroundColor="grey"
                    >
                        Volver a los predeterminados
                    </Button>
                    <Button
                        onClick={handleChangeTheme}
                        margin="0"
                        padding=".5rem .8rem"
                        color="white"
                        backgroundColor="rgb(0, 173, 0)"
                    >
                        Cambiar colores
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Personalization;
