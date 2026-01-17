import "./ItemCard.css"

interface Props {
    icon?: React.ReactNode
    title: string
    description: string
    colorPrimary: string
    colorSecundary: string
}

const ItemCard: React.FC<Props> = ({ title, icon, description, colorPrimary, colorSecundary }) => {
    return (
        <div
            className="itemCard"
            style={{ "--hover-color": colorPrimary, "--semi-circle-color": colorSecundary } as React.CSSProperties}
        >
            {
                icon &&
                <div
                    className="itemCardIcon"
                    style={{
                        background: `linear-gradient(135deg, ${colorPrimary}, ${colorSecundary})`
                    }}
                >
                    {icon}
                </div>
            }
            <h3 className="itemCardTitle">{title}</h3>
            <p className="itemCardDescription">{description}</p>
            <div className="semi-circle">
            </div>
        </div>
    );
}

export default ItemCard;
