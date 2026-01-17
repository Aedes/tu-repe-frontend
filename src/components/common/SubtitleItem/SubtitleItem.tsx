import "./SubtitleItem.css"

interface Props {
    text: string;
    icon?: React.ReactNode;
}

const SubtitleItem: React.FC<Props> = ({ text, icon }) => {
    return (
        <div className="subtitleItem">
            {icon && icon}
            <p className="subtitleItemDescription">{text}</p>
        </div>
    );
}

export default SubtitleItem;
