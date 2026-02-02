import "./ClubDetails.css"
import { useAdminActions } from "../../../../hooks/useAdminActions";
import CourtsAndData from "./CourtsAndData/CourtsAndData";
import Personalization from "./Personalization/Personalization";
import { useState } from "react";

const ClubDetails = () => {

    const {
        selectedClub,
        editedClubData,
    } = useAdminActions();

    const [activeTab, setActiveTab] = useState<"courts" | "personalization">("courts");

    if (!selectedClub || !editedClubData) return null

    return (
        <div className="clubDetailsContainer">
            <h2 className="clubDetailsTitle">Editar club</h2>
            <div className="clubDetailsNavbar" style={{
                display: "flex",
                borderBottom: "2px solid #e0e0e0",
            }}>
                <button
                    onClick={() => setActiveTab("courts")}
                    className={activeTab === "courts" ? "navbarTab active" : "navbarTab"}
                    style={{
                        fontWeight: activeTab === "courts" ? 700 : 500,
                        border: "none",
                        background: "none",
                        padding: "1rem",
                        cursor: "pointer",
                        borderBottom: activeTab === "courts" ? "3px solid var(--color-primary,#0077b6)" : "3px solid transparent",
                        color: activeTab === "courts" ? "var(--color-primary,#0077b6)" : "#222",
                        outline: "none",
                        fontSize: "1rem",
                        transition: "border-bottom 0.3s, color 0.2s"
                    }}
                >
                    Canchas y datos
                </button>
                <button
                    onClick={() => setActiveTab("personalization")}
                    className={activeTab === "personalization" ? "navbarTab active" : "navbarTab"}
                    style={{
                        fontWeight: activeTab === "personalization" ? 700 : 500,
                        border: "none",
                        background: "none",
                        padding: "1rem",
                        cursor: "pointer",
                        borderBottom: activeTab === "personalization" ? "3px solid var(--color-primary,#0077b6)" : "3px solid transparent",
                        color: activeTab === "personalization" ? "var(--color-primary,#0077b6)" : "#222",
                        outline: "none",
                        fontSize: "1rem",
                        transition: "border-bottom 0.3s, color 0.2s"
                    }}
                >
                    Personalización
                </button>
            </div>
            <div className="clubDetails">
                {activeTab === "courts" && <CourtsAndData />}
                {activeTab === "personalization" && <Personalization />}
            </div>
        </div>
    );
}

export default ClubDetails;
