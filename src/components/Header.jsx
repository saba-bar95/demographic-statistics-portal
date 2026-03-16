import { useParams, useNavigate } from "react-router-dom";
import { LuSun, LuMoon, LuInfo } from "react-icons/lu";
import { FaFacebook } from "react-icons/fa";
import logoEn from "../assets/images/logo_en.svg";
import logoKa from "../assets/images/logo_ka.svg";
import "flag-icons/css/flag-icons.min.css";
import useTextSize from "../hooks/useTextSize";
import { useEffect, useRef, useState } from "react";

export default function Header({ onInfoClick, theme, onToggleTheme }) {
  const { language } = useParams();
  const navigate = useNavigate();

  const { size, toggle: toggleTextSize } = useTextSize();

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "ka" : "en";
    navigate(`/${newLanguage}`);
  };

  // Display opposite flag to indicate what clicking will switch to
  const flagCode = language === "en" ? "ge" : "gb";

  const [isSticky, setIsSticky] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > headerHeight) {
        if (currentScrollY > lastScrollY.current) {
          setIsHidden(true);
          setIsSticky(true);
        } else {
          setIsHidden(false);
          setIsSticky(true);
        }
      } else {
        setIsSticky(false);
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerHeight]);

  return (
    <>
      {isSticky && <div style={{ height: headerHeight }} />}
      <header
        ref={headerRef}
        className={`${isSticky ? "fixed top-0 right-0 left-0 z-500" : "relative"} mb-6 bg-(--bg) text-(--text) shadow-md transition-all duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-screen after:-translate-x-1/2 after:bg-blue-500 after:content-[''] md:mb-8 lg:mb-4 xl:mb-8 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="mx-auto flex max-w-470 flex-col items-center justify-center gap-4 px-4 py-4 md:px-8 md:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-12 lg:py-4 xl:gap-6 xl:py-8">
          <a
            href={`https://www.geostat.ge/${language === "en" ? "en" : "ka"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={language === "en" ? logoEn : logoKa}
              alt="Logo"
              className="h-10 w-auto transition-opacity duration-300 sm:h-12 md:h-14 lg:h-10 xl:h-14"
            />
          </a>

          {/* responsive title - centered on mobile (in-flow), absolutely centered on desktop */}
          <h1
            className={`mt-2 w-full text-center text-base font-semibold uppercase transition-all duration-300 sm:text-lg md:text-xl lg:absolute lg:left-1/2 lg:mt-0 lg:w-auto lg:-translate-x-1/2 lg:transform lg:text-lg xl:text-2xl`}
          >
            {language === "en" ? "Demographic portal" : "დემოგრაფიული პორტალი"}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTextSize}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm font-medium sm:h-10 sm:w-10 ${
                size === "large"
                  ? `bg-(--text) text-(--bg) hover:bg-(--primary) hover:text-(--bg)`
                  : `border border-(--text) text-(--text) hover:bg-(--primary) hover:text-(--bg)`
              } cursor-pointer transition-colors duration-150`}
              title={`Toggle text size`}
            >
              A
            </button>

            <button
              onClick={handleLanguageToggle}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-(--text) transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:h-10 sm:w-10`}
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
              onClick={onInfoClick}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-(--text) transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:h-10 sm:w-10`}
              title="About"
            >
              <LuInfo size="clamp(1rem, 2vw, 1.25rem)" />
            </button>

            <button
              onClick={onToggleTheme}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded bg-(--text) text-(--bg) transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:h-10 sm:w-10`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
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
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-(--text) transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:h-10 sm:w-10`}
              title="Visit Facebook"
            >
              <FaFacebook size="clamp(1rem, 2vw, 1.25rem)" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
