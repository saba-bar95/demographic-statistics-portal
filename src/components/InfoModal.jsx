import { LuX } from "react-icons/lu";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { infoModalContent } from "../content/infoModalContent.jsx";
import logoEn from "../assets/images/logo_en.svg";
import logoKa from "../assets/images/logo_ka.svg";
import logoSweden from "../assets/images/sweden.svg";
import logoUndp from "../assets/images/undp.svg";

export default function InfoModal({ isOpen, onClose }) {
  const { language } = useParams();
  const content = infoModalContent[language] || infoModalContent.en;
  const modalRef = useRef(null);

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
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed top-52 left-1/2 z-1000 max-h-[80vh] w-full -translate-x-1/2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-lg border border-gray-300 bg-(--bg) px-4 pb-4 text-(--text) transition-all duration-300 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:top-32 lg:w-[calc(65%+25px)]"
      style={{ fontFamily: "BPGMrgvlovani" }}
    >
      <div className="relative">
        <div className="-mx-4 mb-4 flex items-center justify-between rounded-t-lg px-4 py-2 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8" style={{ backgroundColor: "#0080be" }}>
          <h2 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">{content.title}</h2>
          <button
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded p-1 text-white transition-colors duration-150 hover:text-white/70"
            title={content.closeTitle}
          >
            <LuX size="1.5rem" />
          </button>
        </div>

        <div className="space-y-4 text-justify text-sm sm:text-base">
          <p>{content.intro}</p>

          <h3 className="mt-4 text-base font-semibold sm:text-lg">{content.pyramidTitle}</h3>
          <p>{content.pyramidBody}</p>

          <h3 className="mt-4 text-sm font-semibold italic sm:text-base">
            {content.instructionsTitle}
          </h3>
          <div>
            {typeof content.instructionsBody === "function"
              ? content.instructionsBody()
              : content.instructionsBody}
          </div>

          <h3 className="mt-4 text-base font-semibold sm:text-lg">{content.indicatorsTitle}</h3>
          <ul className="ml-2 list-inside list-disc space-y-2">
            {content.indicators.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-4 text-base font-semibold sm:text-lg">{content.marriageTitle}</h3>
          <p>{content.marriageBody}</p>

          <p>
            <span className="font-semibold">{content.noteTitle}: </span>
            {content.noteBody}
          </p>

          <h3 className="mt-4 text-base font-semibold sm:text-lg">{content.lifeTitle}</h3>
          <p>{content.lifeBody}</p>

          <p>{content.methodologyTitle}</p>
          <a
            href={content.methodologyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-blue-600 underline"
          >
            {content.methodologyLink}
          </a>
          <div className="flex flex-nowrap items-center justify-around gap-2 overflow-hidden">
            <img
              src={language === "en" ? logoEn : logoKa}
              alt="Instructions"
              className="inline-block h-auto min-w-0 shrink rounded object-contain align-middle md:h-[4.5em] md:w-auto"
            />
            <img
              src={logoSweden}
              alt="Instructions"
              className="inline-block h-auto min-w-0 shrink rounded object-contain align-middle md:h-[4.5em] md:w-auto"
            />
            <img
              src={logoUndp}
              alt="Instructions"
              className="inline-block h-auto min-w-0 shrink rounded object-contain align-middle md:h-[10.5em] md:w-auto"
            />
          </div>

          <p>
            {language === "en"
              ? "The adapted version of the website for people with disabilities was developed by the National Statistics Office of Georgia (Geostat) with the support of the United Nations Development Program (UNDP) and the Government of Sweden."
              : "ვებგვერდის ადაპტირებული ვერსია შეზღუდული შესაძლებლობის მქონე პირებისთვის შექმნილია საქართველოს სტატისტიკის ეროვნული სამსახურის (საქსტატი) მიერ გაეროს განვითარების პროგრამისა (UNDP) და შვედეთის მთავრობის ხელშეწყობით."}
          </p>

          <div className="w-full border-t border-(--text)"></div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded border border-(--text) px-3 py-1 transition-colors duration-150 hover:bg-[#0080be] hover:text-white"
              title={content.closeTitle}
            >
              <span className="text-sm sm:text-base">{language === "en" ? "Close" : "დახურვა"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
