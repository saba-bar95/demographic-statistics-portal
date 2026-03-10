import { LuX } from "react-icons/lu";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function BannerModal({ isOpen, onClose }) {
  const { language } = useParams();
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
          <h2 className="text-base sm:text-lg md:text-xl font-semibold"></h2>
          <button
            onClick={onClose}
            className="p-1 border border-(--text) hover:bg-(--primary) hover:text-(--bg) rounded transition-colors duration-150 cursor-pointer shrink-0"
            title={language === "en" ? "Close" : "დახურვა"}>
            <LuX size="1.5rem" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-justify"></div>

        <div className="w-full border-t border-(--text) mt-4"></div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3 py-1 border border-(--text) hover:bg-(--primary) hover:text-(--bg) rounded transition-colors duration-150 cursor-pointer shrink-0"
            title={language === "en" ? "Close" : "დახურვა"}>
            <span className="text-xs sm:text-sm">
              {language === "en" ? "Close" : "დახურვა"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
