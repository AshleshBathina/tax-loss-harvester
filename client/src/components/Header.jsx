import "./Header.css";
import image from "../assets/image.png";
const KoinXLogo = () => (
  <svg width="90" height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="22" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="22" fill="#0052FE">
      KoinX
    </text>
    <circle cx="73" cy="7" r="3.5" fill="#F7941D" />
  </svg>
);

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          {/* <span className="logo-text">
            <span className="logo-koin">Koin</span>
            <span className="logo-x">X</span>
          </span>
          <span className="logo-dot">●</span> */}
          <img className="logox" src={image} />
        </div>
      </div>
    </header>
  );
}
