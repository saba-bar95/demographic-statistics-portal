import useTheme from "../hooks/useTheme";
import { useParams, useNavigate } from "react-router-dom";
import { LuSun, LuMoon, LuInfo } from "react-icons/lu";
import { FaFacebook } from "react-icons/fa";
import logoEn from "../assets/images/logo_en.svg";
import logoKa from "../assets/images/logo_ka.svg";
import "flag-icons/css/flag-icons.min.css";
import useTextSize from "../hooks/useTextSize";

export default function Header({ onInfoClick }) {
  const { theme, toggle } = useTheme();
  const { language } = useParams();
  const navigate = useNavigate();

  const { size, toggle: toggleTextSize } = useTextSize();

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "ka" : "en";
    navigate(`/${newLanguage}`);
  };

  // Display opposite flag to indicate what clicking will switch to
  const flagCode = language === "en" ? "ge" : "gb";

  return (
    <header className="relative flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between gap-4 lg:gap-6 mb-6 md:mb-8 transition-all duration-300 pb-4 lg:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-screen after:h-0.5 after:bg-blue-500">
      <img
        src={language === "en" ? logoEn : logoKa}
        alt="Logo"
        className="h-10 sm:h-12 md:h-14 w-auto transition-opacity duration-300"
      />

      {/* responsive title - centered on mobile (in-flow), absolutely centered on desktop */}
      <h1 className="uppercase text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center w-full mt-2 lg:mt-0 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-auto transition-all duration-300">
        {language === "en" ? "Demographic portal" : "დემოგრაფიული პორტალი"}
      </h1>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTextSize}
          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded text-sm font-medium ${
            size === "large"
              ? "bg-(--text) text-(--bg) hover:bg-(--primary) hover:text-(--bg)"
              : "border border-(--text) text-(--text) hover:bg-(--primary) hover:text-(--bg)"
          } cursor-pointer transition-colors duration-150`}
          title={`Toggle text size`}>
          A
        </button>

        <button
          onClick={handleLanguageToggle}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border border-(--text) hover:bg-(--primary) hover:text-(--bg) cursor-pointer transition-colors duration-150"
          title={`Switch to ${language === "en" ? "Georgian" : "English"}`}>
          <span
            className={`fi fi-${flagCode}`}
            style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}></span>
        </button>

        <button
          onClick={onInfoClick}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border border-(--text) hover:bg-(--primary) hover:text-(--bg) cursor-pointer transition-colors duration-150"
          title="About">
          <LuInfo size="clamp(1rem, 2vw, 1.25rem)" />
        </button>

        <button
          onClick={toggle}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded bg-(--text) text-(--bg) hover:bg-(--primary) hover:text-(--bg) cursor-pointer transition-colors duration-150"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          {theme === "light" ? (
            <LuMoon size="clamp(1rem, 2vw, 1.25rem)" />
          ) : (
            <LuSun size="clamp(1rem, 2vw, 1.25rem)" />
          )}
        </button>

        <a
          href="https://www.facebook.com/geostat.ge"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded border border-(--text) hover:bg-(--primary) hover:text-(--bg) cursor-pointer transition-colors duration-150"
          title="Visit Facebook">
          <FaFacebook size="clamp(1rem, 2vw, 1.25rem)" />
        </a>
      </div>
    </header>
  );
}
