import { useNavigate, useParams } from "react-router-dom";
import "./ClubProfile.css";
import { useFetchData } from "../../hooks/useFetchData";
import type { IClub, ICourt } from "../../types";
import {
	BACKEND_API_URL,
	DEFAULT_COVER_IMAGE_URL,
	DEFAULT_PROFILE_IMAGE_URL,
} from "../../config";
import { useEffect, useState } from "react";
import { useMatchVideoRender } from "../../hooks/useMatchVideoRender";
import {
	PlayIcon,
	SearchIcon,
	PinIcon,
	PhoneIcon,
	InstagramIcon,
	NoVideoIcon,
} from "../../assets/Icons";
import Button from "../common/Button/Button";
import { CameraIcon } from "../../assets/Icons";
import MatchVideoPlayer from "./MatchVideoPlayer/MatchVideoPlayer";
import { toast } from "sonner";
import { userFacingError } from "../../api/errorMessage";
import TurnstileWidget from "../common/TurnstileWidget/TurnstileWidget";
import type { MatchRenderMode } from "../../types/matchVideo";
import {
	argentinaLocalToUtcIso,
	recentArgentinaDays,
} from "../../utils/argentinaTime";

const ClubProfile = () => {
	const { clubUrlId } = useParams();
	const { isLoading, error, fetchData } = useFetchData<IClub>("GET");
	const {
		isLoading: isLoadingCourts,
		error: errorCourts,
		fetchData: fetchDataCourts,
	} = useFetchData<ICourt[]>("GET");
	const [club, setClub] = useState<IClub | null>(null);
	const [courts, setCourts] = useState<ICourt[]>([]);
	const [day, setDay] = useState<string>("");
	const [hour, setHour] = useState<string>("");
	const [courtId, setCourtId] = useState<string>("");
	const [turnstileToken, setTurnstileToken] = useState("");
	const [captchaKey, setCaptchaKey] = useState(0);
	const navigate = useNavigate();
	const { ui: videoUi, startRender, refreshUrl } = useMatchVideoRender();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [renderMode, setRenderMode] = useState<MatchRenderMode>("parts");

	useEffect(() => {
		const fetchClubAndCourts = async () => {
			const dataClub = await fetchData(
				`${BACKEND_API_URL}/clubs/c-url/${clubUrlId}`,
			);
			const dataCourts = await fetchDataCourts(
				`${BACKEND_API_URL}/courts/cl-url/${clubUrlId}`,
			);
			setClub(dataClub);
			setCourts(dataCourts || []);
		};

		fetchClubAndCourts();
	}, []);

	useEffect(() => {
		if (!club) return;

		const root = document.documentElement;

		root.style.setProperty(
			"--color-primary",
			club.theme?.primary ?? "#0077b6",
		);

		root.style.setProperty(
			"--color-secondary",
			club.theme?.secondary ?? "#caf0f8",
		);

		root.style.setProperty(
			"--color-bg",
			club.theme?.background ?? "#edfafd",
		);
	}, [club]);

	const fetchVideos = async () => {
		if (!turnstileToken) {
			toast.error("Completá el CAPTCHA para buscar el partido.");
			return;
		}
		setCurrentIndex(0);
		const outcome = await startRender({
			clubUrlId: clubUrlId || "",
			courtId,
			startTime: argentinaLocalToUtcIso(day, hour),
			turnstileToken,
			mode: renderMode,
		});
		if (outcome === "ok" || outcome === "captcha") {
			setTurnstileToken("");
			setCaptchaKey((value) => value + 1);
		}
	};

	useEffect(() => {
		if (
			videoUi.phase !== "ready" &&
			videoUi.phase !== "parts" &&
			videoUi.phase !== "fallback"
		) return;
		const timer = setTimeout(() => {
			document
				.querySelector(".matchVideoPlayerContainer")
				?.scrollIntoView({ behavior: "smooth" });
		}, 100);
		return () => clearTimeout(timer);
	}, [videoUi]);

	useEffect(() => {
		if (videoUi.phase === "failed") {
			toast.error(
				userFacingError(videoUi.error, "No se pudo buscar el partido"),
			);
		}
	}, [videoUi]);

	if (error) {
		console.error(error);
		return (
			<div className="clubProfileContainerLoading">
				<p className="pLoading">
					No se encontró el club que estabas buscando.
				</p>
				<Button
					backgroundColor="#0077b6"
					color="white"
					onClick={() => navigate("/")}
				>
					Volver al inicio
				</Button>
			</div>
		);
	}

	if (errorCourts) {
		console.error(errorCourts);
	}

	if (isLoading || isLoadingCourts) {
		return (
			<div className="clubProfileContainerLoading">
				<p className="pLoading">Cargando perfil del club...</p>
			</div>
		);
	}

	const location = `${club?.address} ${club?.city} ${club?.province}`.replace(
		/ /g,
		"+",
	);

	return (
		<div className="clubProfileContainer">
			<div
				className="clubImg"
				style={{
					backgroundImage: club?.coverImageUrl
						? `url(${club.coverImageUrl})`
						: `url("${DEFAULT_COVER_IMAGE_URL}")`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			></div>
			<div className="clubProfileContent">
				<div className="clubProfileLogoAndName">
					<div className="clubProfileLogoAndNameContainer">
						<div className="clubProfileLogo">
							<img
								className="clubLogoImg"
								src={
									club?.profileImageUrl
										? club.profileImageUrl
										: DEFAULT_PROFILE_IMAGE_URL
								}
								alt={`Logo Club ${club?.name}`}
							/>
						</div>
						<div className="clubProfileNameAndLocation">
							<h1>{club?.name}</h1>
							{club?.description && (
								<p className="descriptionDesktop">
									{club?.description}
								</p>
							)}
							<div className="clubProfileItems desktop">
								<div className="clubProfileItem">
									<PinIcon
										width="16"
										height="16"
										fill={
											club?.theme?.primary
												? club.theme.primary
												: "#0077b6"
										}
									/>
									<a
										className="anchordInstagram"
										target="_blank"
										rel="noopener noreferrer"
										href={`https://www.google.com/maps/search/?api=1&query=${location}`}
									>
										{club?.address}, {club?.city},{" "}
										{club?.province}
									</a>
								</div>
								{club?.instagramHandle && (
									<div className="clubProfileItem">
										<InstagramIcon
											width="16"
											height="16"
											fill={
												club?.theme?.primary
													? club.theme.primary
													: "#0077b6"
											}
										/>
										<a
											className="anchordInstagram"
											target="_blank"
											rel="noopener noreferrer"
											href={`https://instagram.com/${club.instagramHandle}`}
										>
											{club.instagramHandle}
										</a>
									</div>
								)}
								{club?.phone && (
									<div className="clubProfileItem">
										<PhoneIcon
											width="16"
											height="16"
											fill={
												club?.theme?.primary
													? club.theme.primary
													: "#0077b6"
											}
										/>
										<p>{club.phone}</p>
									</div>
								)}
							</div>
							<div className="hoursContainer desktop">
								<p className="clubHours">
									<span>De</span>{" "}
									{club?.openTime.split(":")[0]}:
									{club?.openTime.split(":")[1]} a{" "}
									{club?.closeTime.split(":")[0]}:
									{club?.closeTime.split(":")[1]} hs
								</p>
							</div>
						</div>
					</div>
					<p className="descriptionMobile">{club?.description}</p>
					<div className="clubProfileItems mobile">
						<div className="clubProfileItem">
							<PinIcon
								width="16"
								height="16"
								fill={
									club?.theme?.primary
										? club.theme.primary
										: "#0077b6"
								}
							/>
							<a
								className="anchordInstagram"
								target="_blank"
								rel="noopener noreferrer"
								href={`https://www.google.com/maps/search/?api=1&query=${location}`}
							>
								{club?.address}, {club?.city}, {club?.province}
							</a>
						</div>
						{club?.instagramHandle && (
							<div className="clubProfileItem">
								<InstagramIcon
									width="16"
									height="16"
									fill={
										club?.theme?.primary
											? club.theme.primary
											: "#0077b6"
									}
								/>
								<a
									className="anchordInstagram"
									target="_blank"
									rel="noopener noreferrer"
									href={`https://instagram.com/${club.instagramHandle}`}
								>
									{club.instagramHandle}
								</a>
							</div>
						)}
						{club?.phone && (
							<div className="clubProfileItem">
								<PhoneIcon
									width="16"
									height="16"
									fill={
										club?.theme?.primary
											? club.theme.primary
											: "#0077b6"
									}
								/>
								<p>{club.phone}</p>
							</div>
						)}
					</div>
					<div className="hoursContainer mobile">
						<p className="clubHours">
							<span>De</span> {club?.openTime.split(":")[0]}:
							{club?.openTime.split(":")[1]} a{" "}
							{club?.closeTime.split(":")[0]}:
							{club?.closeTime.split(":")[1]} hs
						</p>
					</div>
				</div>
				<div className="findYourMatchSection">
					<div className="findYourMatchTitleContainer">
						<div className="findYourMatchHeader desktop">
							<div className="findYourMatchIcon">
								<SearchIcon
									width="32"
									height="32"
									fill={
										club?.theme?.primary
											? club.theme.primary
											: "#0077b6"
									}
								/>
							</div>
							<div className="findYourMatchTitleAndDescription">
								<h2>Encuentra tu partido</h2>
								<p>
									Selecciona cancha, fecha y horario para ver
									el video
								</p>
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
								<p>
									Selecciona cancha, fecha y horario para ver
									el video
								</p>
							</div>
						</div>
					</div>
					<div className="filtersContainer">
						<div className="filterContainer">
							<label
								htmlFor="filter-court"
								style={{ fontWeight: 500 }}
							>
								Selecciona una cancha:
							</label>
							<select
								id="filter-court"
								className="filter"
								onChange={(e) => setCourtId(e.target.value)}
							>
								<option value="">
									¿En qué cancha jugaste?
								</option>
								{courts.map((court) => (
									<option key={court.id} value={court.id}>
										{court.name}
									</option>
								))}
							</select>
						</div>
						<div className="filterContainer">
							<label
								htmlFor="filter-day"
								style={{ fontWeight: 500 }}
							>
								Selecciona un día:{" "}
							</label>
							<select
								id="filter-day"
								className="filter"
								onChange={(e) => setDay(e.target.value)}
							>
								<option value="">Selecciona un día</option>
								{recentArgentinaDays().map((option) => (
									<option key={option.value} value={option.value}>
										{option.label} ({option.weekday})
									</option>
								))}
							</select>
						</div>
						<div className="filterContainer">
							<label
								htmlFor="filter-hour"
								style={{ fontWeight: 500 }}
							>
								Hora:
							</label>
							<select
								id="filter-hour"
								className="filter"
								onChange={(e) => setHour(e.target.value)}
							>
								<option value="">¿A qué hora?</option>
								{(() => {
									const timeToMinutes = (timeStr: string) => {
										const [h, m] = timeStr
											.split(":")
											.map(Number);
										return h * 60 + m;
									};
									const minutesToTime = (mins: number) => {
										const h = Math.floor(mins / 60);
										const m = mins % 60;
										return (
											h.toString().padStart(2, "0") +
											":" +
											m.toString().padStart(2, "0")
										);
									};

									const open = club?.openTime || "08:00";
									const close = club?.closeTime || "20:00";
									const openMins = timeToMinutes(open);
									const closeMins = timeToMinutes(close);

									const options = [];

									if (closeMins > openMins) {
										for (
											let mins = openMins;
											mins <= closeMins;
											mins += 5
										) {
											const time = minutesToTime(mins);
											options.push(
												<option key={time} value={time}>
													{time}
												</option>,
											);
										}
									} else {
										for (
											let mins = openMins;
											mins < 24 * 60;
											mins += 5
										) {
											const time = minutesToTime(mins);
											options.push(
												<option key={time} value={time}>
													{time}
												</option>,
											);
										}
										for (
											let mins = 0;
											mins <= closeMins;
											mins += 5
										) {
											const time = minutesToTime(mins);
											options.push(
												<option key={time} value={time}>
													{time}
												</option>,
											);
										}
									}

									return options;
								})()}
							</select>
						</div>
					</div>
					<div className="videoModeOptions">
						<label className={`videoModeOption ${renderMode === "parts" ? "selected" : ""}`}>
							<input
								type="radio"
								name="renderMode"
								value="parts"
								checked={renderMode === "parts"}
								onChange={() => {
									setRenderMode("parts");
									setCurrentIndex(0);
								}}
							/>
							<span className="videoModeTitle">Ver por partes</span>
							<span className="videoModeDescription">
								Más rápido. Reproduce los fragmentos disponibles uno tras otro.
							</span>
						</label>
						<label className={`videoModeOption ${renderMode === "unified" ? "selected" : ""}`}>
							<input
								type="radio"
								name="renderMode"
								value="unified"
								checked={renderMode === "unified"}
								onChange={() => {
									setRenderMode("unified");
									setCurrentIndex(0);
								}}
							/>
							<span className="videoModeTitle">Preparar video completo</span>
							<span className="videoModeDescription">
								Un solo archivo. La primera vez puede tardar varios minutos.
							</span>
						</label>
					</div>
					<div className="buttonVideoContainer">
						<TurnstileWidget
							key={captchaKey}
							onToken={setTurnstileToken}
						/>
						<Button
							margin="0"
							backgroundColor={
								club?.theme?.primary
									? club.theme.primary
									: "#0077b6"
							}
							color="white"
							onClick={() => fetchVideos()}
							disabled={
								!(courtId && day && hour && turnstileToken) ||
								videoUi.phase === "submitting" ||
								videoUi.phase === "polling"
							}
							icon={
								<CameraIcon
									width="24"
									height="24"
									fill="white"
								/>
							}
							width={window.innerWidth <= 530 ? "100%" : ""}
						>
							{videoUi.phase === "submitting"
								? "Buscando partido..."
								: videoUi.phase === "polling"
									? "Preparando video completo..."
									: renderMode === "parts"
										? "Ver por partes"
										: "Preparar video completo"}
						</Button>
					</div>
					<div className="importantNotice">
						<p>
							<span>Importante: </span> Las grabaciones duran 72
							horas. La búsqueda es pública: cualquiera con el
							link del club, la cancha y el horario puede ver el
							partido. Si querés conservarlo, descargalo.
						</p>
					</div>
				</div>
				{videoUi.phase === "polling" && (
					<div className="matchVideoPreparing animationIn">
						<div className="matchPreparingSpinner" />
						<p>
							Preparando tu partido completo. Esto puede tardar
							unos minutos la primera vez.
						</p>
					</div>
				)}
				{videoUi.phase === "not_found" && (
					<div className="noVideosFoundContainer animationIn">
						<NoVideoIcon width="20px" height="20px" fill="black" />
						<p className="noVideosFoundText">
							No encontramos ningún partido. Por favor, verifica
							la cancha, fecha y hora.
						</p>
					</div>
				)}
				{videoUi.phase === "ready" && (
					<div className="matchVideoPlayerContainer animationIn">
						<div className="titleMatchVideoPlayerContainer">
							<div className="findYourMatchIcon">
								<PlayIcon
									width="32"
									height="32"
									fill={
										club?.theme?.primary
											? club.theme.primary
											: "#0077b6"
									}
								/>
							</div>
							<div>
								<h3 className="titleMatchVideoPlayer">
									Tu partido:{" "}
								</h3>
								<p className="pSlices">
									El partido se reproduce en un solo video.
								</p>
							</div>
						</div>
						<MatchVideoPlayer
							key={videoUi.job.jobId || videoUi.job.startTime}
							mode="unified"
							videoUrl={videoUi.job.videoUrl}
							onRefreshUrl={
								videoUi.job.jobId
									? () => refreshUrl(videoUi.job.jobId!)
									: undefined
							}
						/>
						<div className="downloadInfoContainer">
							<p className="downloadNotice">
								Puedes grabar un clip del partido, descargarlo y
								compartirlo con tus amigos (los clips duran como
								máximo 30 segundos).
							</p>
						</div>
					</div>
				)}
				{videoUi.phase === "parts" && (
					<div className="matchVideoPlayerContainer animationIn">
						<div className="titleMatchVideoPlayerContainer">
							<div className="findYourMatchIcon">
								<PlayIcon
									width="32"
									height="32"
									fill={
										club?.theme?.primary
											? club.theme.primary
											: "#0077b6"
									}
								/>
							</div>
							<div>
								<h3 className="titleMatchVideoPlayer">
									Tu partido por partes:{" "}
								</h3>
								<p className="pSlices">
									Se muestran {videoUi.job.parts.length} partes.
									Usá los controles del reproductor para cambiar
									entre fragmentos. Parte {currentIndex + 1}/
									{videoUi.job.parts.length}
								</p>
							</div>
						</div>
						<MatchVideoPlayer
							mode="parts"
							videos={videoUi.job.parts}
							currentIndex={currentIndex}
							setCurrentIndex={setCurrentIndex}
						/>
						<div className="downloadInfoContainer">
							<p className="downloadNotice">
								Puedes grabar un clip del partido, descargarlo y
								compartirlo con tus amigos (los clips duran como
								máximo 30 segundos).
							</p>
						</div>
					</div>
				)}
				{videoUi.phase === "fallback" && (
					<div className="matchVideoPlayerContainer animationIn">
						<div className="titleMatchVideoPlayerContainer">
							<div className="findYourMatchIcon">
								<PlayIcon
									width="32"
									height="32"
									fill={
										club?.theme?.primary
											? club.theme.primary
											: "#0077b6"
									}
								/>
							</div>
							<div>
								<h3 className="titleMatchVideoPlayer">
									Tu partido:{" "}
								</h3>
								<p className="pSlices">
									{videoUi.job.reason === "incomplete_sources"
										? `Faltan fragmentos, así que se muestran ${videoUi.job.parts.length} partes.`
										: `No se pudo unir el video, así que se muestran ${videoUi.job.parts.length} partes.`}{" "}
									Usá los controles del reproductor para
									cambiar entre fragmentos. Parte{" "}
									{currentIndex + 1}/{videoUi.job.parts.length}
								</p>
							</div>
						</div>
						<MatchVideoPlayer
							mode="parts"
							videos={videoUi.job.parts}
							currentIndex={currentIndex}
							setCurrentIndex={setCurrentIndex}
						/>
						<div className="downloadInfoContainer">
							<p className="downloadNotice">
								Puedes grabar un clip del partido, descargarlo y
								compartirlo con tus amigos (los clips duran como
								máximo 30 segundos).
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ClubProfile;
