import { LuX } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import maleImg from "../assets/images/male.png";
import femaleImg from "../assets/images/female.png";
import { fetchLifeExpectancy } from "../api/chartDataApi";

export default function BannerModal({ isOpen, onClose }) {
  const { language } = useParams();
  const modalRef = useRef(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(null);
  const [year, setYear] = useState(2024);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (event) => {
      const target = event.target;
      const clickedInsideModal = modalRef.current?.contains(target);
      const clickedHeaderControl = target.closest("header button, header a");
      if (!clickedInsideModal && !clickedHeaderControl) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  const handleFetch = async (ageVal, genderVal, yearVal) => {
    if (ageVal === "" || ageVal < 0) {
      setResult(null);
      return;
    }
    try {
      const data = await fetchLifeExpectancy(ageVal, yearVal, genderVal);
      setResult(data);
    } catch {
      setResult(null);
    }
  };

  if (!isOpen) return null;

  const years = [2019, 2020, 2021, 2022, 2023, 2024];

  return (
    <div
      ref={modalRef}
      className="fixed top-4 left-1/2 z-1000 max-h-[calc(100vh-2rem)] w-[90%] -translate-x-1/2 overflow-y-auto rounded-lg border border-gray-300 bg-(--bg) px-3 pb-3 text-(--text) transition-all duration-300 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:w-[calc(65%+25px)]"
      style={{ fontFamily: "BPGMrgvlovani" }}
    >
      <div className="relative">
        <div className="-mx-3 mb-6 flex justify-end rounded-t-lg px-3 py-2 sm:-mx-6 sm:mb-8 sm:px-6 md:-mx-8 md:px-8" style={{ backgroundColor: "#0080be" }}>
          <button
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded p-1 text-white transition-colors duration-150 hover:text-white/70"
            title={language === "en" ? "Close" : "დახურვა"}
          >
            <LuX size="1.5rem" />
          </button>
        </div>
        <h2 className="mb-6 text-center text-sm sm:mb-10 sm:text-lg md:text-xl">
          {language === "ka"
            ? "სიცოცხლის მოსალოდნელი ხანგრძლივობის კალკულატორი"
            : "Life Expectancy Calculator"}{" "}
          ({year} {language === "ka" ? "წელი" : "Year"})
        </h2>

        <div className="space-y-5 text-center text-xs sm:space-y-8 sm:text-base">
          {/* Year selector */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-medium">{language === "ka" ? "წელი:" : "Year:"}</span>
            <div className="flex gap-1.5">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setYear(y);
                    handleFetch(age, gender, y);
                  }}
                  className={`cursor-pointer rounded px-2 py-1 text-xs transition-colors sm:px-4 sm:py-2 sm:text-base ${
                    year === y
                      ? "bg-[#0080be] text-white"
                      : "border border-(--text) bg-(--bg) text-(--text) hover:bg-[#0080be]/20"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <h3 className="mt-4 text-sm font-semibold sm:mt-10 sm:text-lg">
            {language === "ka" ? "რა არის თქვენი ასაკი?" : "What Is Your Age?"}
          </h3>

          {/* Age input */}
          <input
            type="number"
            min="0"
            max="85"
            value={age}
            onChange={(e) => {
              const val = e.target.value === "" ? "" : Number(e.target.value);
              setAge(val);
              handleFetch(val, gender, year);
            }}
            placeholder={language === "ka" ? "შეიყვანეთ ასაკი" : "Type Your Age"}
            className="mx-auto block w-48 rounded-lg border border-(--text) bg-(--bg) px-3 py-2 text-center text-base text-(--text) transition-colors outline-none placeholder:text-(--text)/50 focus:border-[#0080be] sm:w-64 sm:px-4 sm:py-2.5 sm:text-xl"
          />

          {/* Gender selection */}
          <p className="text-base sm:text-xl">
            {language === "ka" ? "აირჩიეთ სქესი" : "Choose Your Gender"}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                const val = gender === "female" ? null : "female";
                setGender(val);
                handleFetch(age, val, year);
              }}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg p-2 transition-colors sm:p-4 ${
                gender === "female"
                  ? "bg-[#f03f46] text-white"
                  : "text-(--text) hover:bg-[#f03f46]/10"
              }`}
            >
              <img src={femaleImg} alt="Female" className="h-16 w-11 sm:h-25 sm:w-17.5" />
            </button>
            <button
              onClick={() => {
                const val = gender === "male" ? null : "male";
                setGender(val);
                handleFetch(age, val, year);
              }}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg p-2 transition-colors sm:p-4 ${
                gender === "male"
                  ? "bg-[#0080be] text-white"
                  : "text-(--text) hover:bg-[#0080be]/10"
              }`}
            >
              <img src={maleImg} alt="Male" className="h-16 w-11 sm:h-25 sm:w-17.5" />
            </button>
          </div>

          {/* Result message */}
          {result && (
            <div className="mx-auto w-[90%] sm:w-[70%]">
              <div className="rounded-lg border border-[#0080be]/30 bg-[#0080be]/5 px-4 py-3">
                <p className="text-sm sm:text-lg">
                  {language === "ka"
                    ? result.message
                    : `Life expectancy of a ${result.age}-year-old${result.gender !== "both" ? (result.gender === "female" ? " female" : " male") : ""} in Georgia is ${result.life_expectancy} years`}
                </p>
              </div>

              {/* Life bar */}
              <div className="relative mt-10 w-full">
                {/* Age marker above bar */}
                <div
                  className="absolute -top-8 flex flex-col items-center gap-0.5 text-sm font-semibold text-(--text) sm:-top-9 sm:text-base"
                  style={{
                    left: `${(result.age / result.life_expectancy) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <span>{result.age}</span>
                  <span className="text-xs leading-none">▼</span>
                </div>
                {/* Bar */}
                <div
                  className="h-6 w-full overflow-hidden rounded-sm"
                  style={{ backgroundColor: "#b3d7ff" }}
                >
                  <div
                    className="h-full rounded-sm"
                    style={{
                      backgroundColor: "#007bff",
                      width: `${(result.age / result.life_expectancy) * 100}%`,
                    }}
                  />
                </div>
                {/* Edge labels below bar */}
                <div className="mt-1 flex justify-between text-sm font-semibold text-(--text) sm:text-base">
                  <span>0</span>
                  <span>{result.life_expectancy}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 w-full border-t border-(--text)"></div>

        <div className="mt-4 flex justify-end pt-2 sm:mt-10">
          <button
            onClick={onClose}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded border border-(--text) px-3 py-1 transition-colors duration-150 hover:bg-[#0080be] hover:text-white"
            title={language === "en" ? "Close" : "დახურვა"}
          >
            <span className="text-sm sm:text-base">{language === "en" ? "Close" : "დახურვა"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
