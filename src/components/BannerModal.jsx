import { LuX } from "react-icons/lu";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function BannerModal({ isOpen, onClose }) {
  const { language } = useParams();
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
      className="fixed top-25 left-1/2 z-1000 max-h-[80vh] w-full -translate-x-1/2 overflow-y-auto rounded-lg border-2 border-(--text) bg-(--bg) p-4 text-(--text) transition-all duration-300 sm:p-6 md:p-8 lg:w-[calc(65%+25px)]"
    >
      <div className="relative pt-3">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-base font-semibold sm:text-lg md:text-xl"></h2>
          <button
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded border border-(--text) p-1 transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg)"
            title={language === "en" ? "Close" : "დახურვა"}
          >
            <LuX size="1.5rem" />
          </button>
        </div>

        <div className="space-y-4 text-justify text-xs sm:text-sm"></div>

        <div className="mt-4 w-full border-t border-(--text)"></div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded border border-(--text) px-3 py-1 transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg)"
            title={language === "en" ? "Close" : "დახურვა"}
          >
            <span className="text-xs sm:text-sm">
              {language === "en" ? "Close" : "დახურვა"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
