
const Button = ({ buttonText, onClick, disabled }) => {
    return (
        <button className="custom-button" onClick={onClick} disabled={disabled}>
            {buttonText}
        </button>
    );
}
export default Button;
