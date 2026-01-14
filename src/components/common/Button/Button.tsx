import "./Button.css"

interface Props {
    children: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
    backgroundColor?: string;
    color?: string;
    disabled?: boolean;
    padding?: string;
    fontSize?: string;
}

const Button: React.FC<Props> = ({ children, onClick, icon, backgroundColor, color, disabled, padding, fontSize }) => {
    return (
        <button
            onClick={onClick}
            className={`customButton ${disabled ? "disabledButton" : "activeButton"}`}
            style={{ backgroundColor: backgroundColor, color: color, padding: padding, fontSize: fontSize }}
            disabled={disabled}
        >
            {icon && icon}
            {children}
        </button>
    );
}

export default Button;
