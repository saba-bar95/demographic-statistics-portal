import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { LuSun, LuMoon } from "react-icons/lu";
import logoEn from "../assets/images/logo_en.svg";
import logoKa from "../assets/images/logo_ka.svg";
import "flag-icons/css/flag-icons.min.css";
import useTextSize from "../hooks/useTextSize";
import useTheme from "../hooks/useTheme";
import { useRef } from "react";

export default function MarriagesHeader() {
  const { language } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { size, toggle: toggleTextSize } = useTextSize();
  const { theme, toggle: toggleTheme } = useTheme();

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "ka" : "en";
    const newPath = location.pathname.replace(`/${language}/`, `/${newLanguage}/`);
    navigate(newPath);
  };

  const flagCode = language === "en" ? "ge" : "gb";

  const headerRef = useRef(null);

  return (
    <>
      {/* No spacer needed, header is always static */}
      <header
        ref={headerRef}
        className={
          "relative mb-6 bg-(--bg) text-(--text) shadow-md transition-all duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:bg-blue-500 after:content-[''] md:mb-8 lg:mb-4 xl:mb-8"
        }
      >
        <div className="mx-auto flex max-w-375 flex-col items-center justify-center gap-4 px-4 py-4 md:px-8 md:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-12 lg:py-4 xl:gap-6 xl:py-8">
          <Link to={`/${language}`}>
            <img
              src={language === "en" ? logoEn : logoKa}
              alt="Logo"
              className="h-10 w-auto transition-opacity duration-300 sm:h-12 md:h-14 lg:h-10 xl:h-14"
            />
          </Link>

          <h1 className="mt-2 max-w-125 text-center text-base font-semibold uppercase transition-all duration-300 sm:text-lg md:text-xl lg:absolute lg:left-1/2 lg:mt-0 lg:-translate-x-1/2 lg:transform lg:text-lg xl:text-2xl">
            {language === "en"
              ? "Number of Registered Marriages"
              : "რეგისტრირებულ ქორწინებათა რაოდენობა"}
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTextSize}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm font-medium sm:h-10 sm:w-10 ${
                size === "large"
                  ? "bg-(--text) text-(--bg) hover:bg-(--primary) hover:text-(--bg)"
                  : "border border-(--text) text-(--text) hover:bg-(--primary) hover:text-(--bg)"
              } cursor-pointer transition-colors duration-150`}
              title="Toggle text size"
            >
              A
            </button>

            <button
              onClick={handleLanguageToggle}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-(--text) transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:h-10 sm:w-10"
              title={`Switch to ${language === "en" ? "Georgian" : "English"}`}
            >
              <span
                className={`fi fi-${flagCode}`}
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                }}
              ></span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded bg-(--text) text-(--bg) transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:h-10 sm:w-10"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <LuMoon size="clamp(1rem, 2vw, 1.25rem)" />
              ) : (
                <LuSun size="clamp(1rem, 2vw, 1.25rem)" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
