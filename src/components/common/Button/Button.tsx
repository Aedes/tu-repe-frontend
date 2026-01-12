import "./Button.css"

interface Props {
    children: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
    backgroundColor?: string;
    color?: string;
}

const Button: React.FC<Props> = ({children, onClick, icon, backgroundColor, color}) => {
    return (
        <button 
            onClick={onClick} 
            className="customButton"
            style={{backgroundColor: backgroundColor, color: color}}
        >
            {icon && icon}
            <p className="pButton">{children}</p>
        </button>
    );
}

export default Button;
