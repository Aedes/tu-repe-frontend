import { useNavigate, useParams } from "react-router-dom";
import "./ClubProfile.css"
import { useFetchData } from "../../hooks/useFetchData";
import type { IClub, ICourt } from "../../types";
import { BACKEND_API_URL } from "../../config";
import { useEffect, useState } from "react";
import logoClub from "../../assets/tmp/center-logo.jpeg"
import { PlayIcon, SearchIcon, PinIcon, PhoneIcon, InstagramIcon, NoVideoIcon } from "../../assets/Icons";
import Button from "../common/Button/Button";
import { CameraIcon } from "../../assets/Icons";
import MatchVideoPlayer from "./MatchVideoPlayer/MatchVideoPlayer";
import { toast } from "sonner";

const ClubProfile = () => {
    const { clubId } = useParams();
    const { isLoading, error, fetchData } = useFetchData<IClub>(`${BACKEND_API_URL}/clubs/c/${clubId}`, "GET")
    const { isLoading: isLoadingCourts, error: errorCourts, fetchData: fetchDataCourts } = useFetchData<ICourt[]>(`${BACKEND_API_URL}/courts/cl/${clubId}`, "GET")
    const [club, setClub] = useState<IClub | null>(null)
    const [courts, setCourts] = useState<ICourt[]>([])
    const [day, setDay] = useState<string>("")
    const [hour, setHour] = useState<string>("")
    const [courtId, setCourtId] = useState<string>("")
    const [videos, setVideos] = useState<string[] | null>(null)
    const navigate = useNavigate()
    const { isLoading: isLoadingVideos, error: errorFetchVideos, fetchData: fetchDataVideos } = useFetchData<string[]>(`${BACKEND_API_URL}/videos/urls?startTime=${day}T${hour}:00Z&courtId=${courtId}`, "GET")

    useEffect(() => {
        const fetchClubAndCourts = async () => {
            const dataClub = await fetchData()
            const dataCourts = await fetchDataCourts()
            setClub(dataClub)
            setCourts(dataCourts)
        }

        fetchClubAndCourts()
    }, [])

    const fetchVideos = async () => {
        const dataVideos = await fetchDataVideos()
        setVideos(dataVideos)
        if (dataVideos && dataVideos.length > 0) {
            setTimeout(() => {
                const videoContainer = document.querySelector('.matchVideoPlayerContainer');
                if (videoContainer) {
                    videoContainer.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    }

    if (error) {
        console.error(error)
        return <div className="clubProfileContainerLoading">
            <p className="pLoading">No se encontró el club que estabas buscando.</p>
            <Button backgroundColor="#0077b6" color="white" onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
    }

    if (errorCourts) {
        console.error(errorCourts)
        toast.error("Error al cargar las canchas del club, vuelve a intentarlo más tarde.", {
            duration: 10000
        })
    }

    if (errorFetchVideos) {
        console.error(errorFetchVideos)
        toast.error("Error al obtener el partido, inténtalo de nuevo más tarde.")
    }

    if (isLoading || isLoadingCourts) {
        return <div className="clubProfileContainerLoading">
            <p className="pLoading">Cargando perfil del club...</p>
        </div>
    }

    return (
        <div className="clubProfileContainer">
            <div className="clubImg">
            </div>
            <div className="clubProfileContent">
                <div className="clubProfileLogoAndName">
                    <div className="clubProfileLogoAndNameContainer">
                        <div className="clubProfileLogo">
                            <img className="clubLogoImg" src={logoClub} alt={`Logo Club ${club?.name}`} />
                        </div>
                        <div className="clubProfileNameAndLocation">
                            <h1>{club?.name}</h1>
                            <p className="descriptionDesktop">7 canchas de Pádel de alto rendimiento.</p>
                            <div className="clubProfileItems desktop">
                                <div className="clubProfileItem">
                                    <PinIcon
                                        width="16"
                                        height="16"
                                        fill="#a9d703"
                                    />
                                    <p>Coronel Suarez 936, San Rafael, Mendoza</p>
                                </div>
                                <div className="clubProfileItem">
                                    <PhoneIcon
                                        width="16"
                                        height="16"
                                        fill="#a9d703"
                                    />
                                    <p>2604627402</p>
                                </div>
                                <div className="clubProfileItem">
                                    <InstagramIcon
                                        width="16"
                                        height="16"
                                        fill="#a9d703"
                                    />
                                    <p>complejocenter</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="descriptionMobile">7 canchas de Pádel de alto rendimiento.</p>
                    <div className="clubProfileItems mobile">
                        <div className="clubProfileItem">
                            <PinIcon
                                width="16"
                                height="16"
                                fill="#a9d703"
                            />
                            <p>Coronel Suarez 936, San Rafael, Mendoza</p>
                        </div>
                        <div className="clubProfileItem">
                            <PhoneIcon
                                width="16"
                                height="16"
                                fill="#a9d703"
                            />
                            <p>2604627402</p>
                        </div>
                        <div className="clubProfileItem">
                            <InstagramIcon
                                width="16"
                                height="16"
                                fill="#a9d703"
                            />
                            <p>complejocenter</p>
                        </div>
                    </div>
                </div>
                <div className="findYourMatchSection">
                    <div className="findYourMatchTitleContainer">
                        <div className="findYourMatchHeader desktop">
                            <div className="findYourMatchIcon">
                                <SearchIcon
                                    width="32"
                                    height="32"
                                    fill="#1c67ba"
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
                                        fill="#1c67ba"
                                    />
                                </div>
                                <h2>Encuentra tu partido</h2>
                            </div>
                            <div className="findYourMatchTitleAndDescription">
                                <p>Selecciona cancha, fecha y horario para ver el video</p>
                            </div>
                        </div>
                    </div>
                    <div className="filtersContainer">
                        <div className="filterContainer">
                            <label htmlFor="filter-court" style={{ fontWeight: 500 }}>Selecciona una cancha:</label>
                            <select id="filter-day" className="filter" onChange={(e) => setCourtId(e.target.value)}>
                                <option value="">¿En qué cancha jugaste?</option>
                                {
                                    courts.map(court => (
                                        <option key={court.id} value={court.id}>{court.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="filterContainer">
                            <label htmlFor="filter-day" style={{ fontWeight: 500 }}>Selecciona un día: </label>
                            <select id="filter-day" className="filter" onChange={(e) => setDay(e.target.value)}>
                                <option value="">Selecciona un día</option>
                                {(() => {
                                    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                                    const options = [];
                                    for (let i = 0; i < 3; i++) {
                                        const date = new Date();
                                        date.setDate(date.getDate() - i);
                                        const yyyy = date.getFullYear();
                                        const mm = String(date.getMonth() + 1).padStart(2, '0');
                                        const dd = String(date.getDate()).padStart(2, '0');
                                        const value = `${yyyy}-${mm}-${dd}`;
                                        const label = i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : 'Antes de ayer';
                                        options.push(
                                            <option key={value} value={value}>
                                                {label} ({dayNames[date.getDay()]})
                                            </option>
                                        );
                                    }
                                    return options;
                                })()}
                            </select>
                        </div>
                        <div className="filterContainer">
                            <label htmlFor="filter-hour" style={{ fontWeight: 500 }}>Hora</label>
                            <select id="filter-hour" className="filter" onChange={(e) => setHour(e.target.value)}>
                                <option value="">¿A qué hora?</option>
                                {(() => {
                                    const timeToMinutes = (timeStr: string) => {
                                        const [h, m] = timeStr.split(":").map(Number);
                                        return h * 60 + m;
                                    };
                                    const minutesToTime = (mins: number) => {
                                        const h = Math.floor(mins / 60);
                                        const m = mins % 60;
                                        return h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
                                    };

                                    const open = club?.openTime || "08:00";
                                    const close = club?.closeTime || "20:00";
                                    const openMins = timeToMinutes(open);
                                    const closeMins = timeToMinutes(close);

                                    const options = [];
                                    for (let mins = openMins; mins <= closeMins; mins += 15) {
                                        const time = minutesToTime(mins);
                                        options.push(
                                            <option key={time} value={time}>{time}</option>
                                        );
                                    }
                                    return options;
                                })()}
                            </select>
                        </div>
                    </div>
                    <div className="buttonVideoContainer">
                        <Button
                            margin="0"
                            backgroundColor="#1c67ba"
                            color="white"
                            onClick={() => fetchVideos()}
                            disabled={!(courtId && day && hour) || isLoadingVideos}
                            icon={
                                <CameraIcon
                                    width="24"
                                    height="24"
                                    fill="white"
                                />
                            }
                            width={window.innerWidth <= 530 ? "100%" : ""}
                        >
                            {isLoadingVideos ? "Buscando partido..." : "Ver partido"}
                        </Button>
                    </div>
                    <div className="importantNotice">
                        <p><span>Importante: </span> Las grabaciones de los partidos duran 3 días después de jugado. Si quieres guardar tu partido puedes descargarlo desde el reproductor.</p>
                    </div>
                </div>
                {
                    videos &&
                    <>
                        {
                            videos.length === 0 ?
                                <div className="noVideosFoundContainer animationIn">
                                    <NoVideoIcon
                                        width="20px"
                                        height="20px"
                                        fill="black"
                                    />
                                    <p className="noVideosFoundText">No encontramos ningún partido. Por favor, verifica la cancha, fecha y hora.</p>
                                </div>
                                :
                                <div className="matchVideoPlayerContainer animationIn">
                                    <div className="titleMatchVideoPlayerContainer">
                                        <div className="findYourMatchIcon">
                                            <PlayIcon
                                                width="32"
                                                height="32"
                                                fill="#1c67ba"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="titleMatchVideoPlayer">Tu partido: </h3>
                                            <p className="pSlices">Dividido en {videos.length} partes. Al finalizar una se reproducirá la siguiente.</p>
                                        </div>
                                    </div>
                                    <MatchVideoPlayer videos={videos} />
                                    <div className="downloadInfoContainer">
                                        <p className="downloadNotice">Puedes grabar un clip del partido, descargarlo y compartirlo con tus amigos (los clips duran como máximo 30 segundos).</p>
                                    </div>
                                </div>
                        }
                    </>
                }
            </div>
        </div>
    );
}

export default ClubProfile;
