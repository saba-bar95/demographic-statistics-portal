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
      className="fixed left-1/2 -translate-x-1/2 top-52 lg:top-32 z-40 w-full lg:w-[calc(65%+25px)] max-h-[80vh] overflow-y-auto border-2 border-(--text) rounded-lg p-4 sm:p-6 md:p-8 bg-(--bg) text-(--text) transition-all duration-300">
      <div className="relative pt-3">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            {content.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 border border-(--text) hover:bg-(--primary) hover:text-(--bg) rounded transition-colors duration-150 cursor-pointer shrink-0"
            title={content.closeTitle}>
            <LuX size="1.5rem" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-justify">
          <p>{content.intro}</p>

          <h3 className="text-sm sm:text-base font-semibold mt-4">
            {content.pyramidTitle}
          </h3>
          <p>{content.pyramidBody}</p>

          <h3 className="text-sm sm:text-base font-semibold mt-4 italic">
            {content.instructionsTitle}
          </h3>
          <div>
            {typeof content.instructionsBody === "function"
              ? content.instructionsBody()
              : content.instructionsBody}
          </div>

          <h3 className="text-sm sm:text-base font-semibold mt-4">
            {content.indicatorsTitle}
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-2">
            {content.indicators.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="text-sm sm:text-base font-semibold mt-4">
            {content.marriageTitle}
          </h3>
          <p>{content.marriageBody}</p>

          <p>
            <span className="font-semibold">{content.noteTitle}: </span>
            {content.noteBody}
          </p>

          <h3 className="text-sm sm:text-base font-semibold mt-4">
            {content.lifeTitle}
          </h3>
          <p>{content.lifeBody}</p>

          <p>{content.methodologyTitle}</p>
          <a
            href={content.methodologyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all">
            {content.methodologyLink}
          </a>
          <div className="flex flex-nowrap justify-around items-center gap-2 overflow-hidden">
            <img
              src={language === "en" ? logoEn : logoKa}
              alt="Instructions"
              className="inline-block  md:w-auto h-auto md:h-[4.5em] align-middle rounded object-contain shrink min-w-0"
            />
            <img
              src={logoSweden}
              alt="Instructions"
              className="inline-block  md:w-auto h-auto md:h-[4.5em] align-middle rounded object-contain shrink min-w-0"
            />
            <img
              src={logoUndp}
              alt="Instructions"
              className="inline-block  md:w-auto h-auto md:h-[10.5em] align-middle rounded object-contain shrink min-w-0"
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
              className="inline-flex items-center gap-2 px-3 py-1 border border-(--text) hover:bg-(--primary) hover:text-(--bg) rounded transition-colors duration-150 cursor-pointer shrink-0"
              title={content.closeTitle}>
              <span className="text-xs sm:text-sm">
                {language === "en" ? "Close" : "დახურვა"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
