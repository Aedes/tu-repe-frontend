import "./StatCard.css"

interface Props {
    title: string;
    quantity: number;
    icon: React.ReactNode
}

const StatCard: React.FC<Props> = ({ title, quantity, icon }) => {
    return (
        <div className="statCardContainer">
            <div className="statCardIcon">
                {icon}
            </div>
            <div className="statCardInfo">
                <h3 className="statCardTitle">{quantity}</h3>
                <p className="statCardQuantity">{title} en total</p>
            </div>
        </div>
    );
}

export default StatCard;
