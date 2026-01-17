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
    width?: string;
    margin?: string;
}

const Button: React.FC<Props> = ({ children, onClick, icon, backgroundColor, color, disabled, padding, fontSize, width, margin }) => {
    return (
        <button
            onClick={onClick}
            className={`customButton ${disabled ? "disabledButton" : "activeButton"}`}
            style={{ backgroundColor: backgroundColor, color: color, padding: padding, fontSize: fontSize, width: width, margin: margin }}
            disabled={disabled}
        >
            {icon && icon}
            {children}
        </button>
    );
}

export default Button;
