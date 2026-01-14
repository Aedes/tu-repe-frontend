import "./Hero.css"
import Button from "../../common/Button/Button";
import { SearchIcon, CameraIcon } from "../../../assets/Icons";
import { useFetchData } from "../../../hooks/useFetchData";
import type { IClub } from "../../../types";
import { BACKEND_API_URL } from "../../../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Hero = () => {
    const { error, fetchData } = useFetchData<IClub[]>(`${BACKEND_API_URL}/clubs`, "GET")
    const [clubs, setClubs] = useState<IClub[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchClubs = async () => {
            const data = await fetchData()
            setClubs(data)
        }

        fetchClubs()
    }, [])

    if (error) {
        console.error(error)
        toast.error("Error al obtener los clubs, inténtalo de nuevo más tarde.")
    }

    return (
        <div className="heroSection">
            <h1><span>Tu Repe</span>. Donde los partidos vuelven a jugarse.</h1>
            <p className="heroDescription">Tu Repe conecta complejos deportivos con sus jugadores. Grabamos tus partidos y te entregamos el video completo del juego.</p>
            <Button
                onClick={() => console.log("")}
                icon={<CameraIcon
                    width={20}
                    height={20}
                    fill="blacks"
                />}
            >
                Sumá Tu Repe a tu complejo
            </Button>
            <div className="searchClubSection">
                <h3>¿Jugaste un partido? Buscá tu club</h3>
                <div className="searchInputAndButtonContainer">
                    <div className="searchInputContainer">
                        <SearchIcon
                            width={20}
                            height={20}
                            fill="gray"
                        />
                        <input
                            className="searchInput"
                            type="text"
                            placeholder="Escribí el nombre del club o complejo..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {searchTerm && (
                    <ul className="clubSearchResults animation-fade-in">
                        {clubs
                            .filter(club =>
                                club.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(club => (
                                <button
                                    className="clubItem"
                                    key={club.id}
                                    onClick={() => navigate("/c/" + club.id)}
                                >
                                    {club.name}
                                </button>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Hero;
