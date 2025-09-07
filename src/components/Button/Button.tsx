import style from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}

const Button = ({ children, onClick, disabled }: ButtonProps) => {
  return (
    <button
      className={style.button}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default Button;
