import { useEffect, useRef, useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import {
  BsFileEarmarkImage,
  BsFileEarmarkExcel,
  BsFileEarmarkPdf,
  BsPrinter,
} from "react-icons/bs";
import {
  exportToJpg,
  exportToExcel,
  exportToPdf,
  printChart,
} from "../utils/chartExport";

export default function ChartExportMenu({
  data,
  year,
  language = "en",
  exportingRef,
}) {
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportJpg = async () => {
    await exportToJpg(exportingRef);
    setIsMenuOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcel(data, year, language);
    setIsMenuOpen(false);
  };

  const handleExportPdf = () => {
    exportToPdf(data, year, language);
    setIsMenuOpen(false);
  };

  const handlePrint = async () => {
    await printChart(exportingRef);
    setIsMenuOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-2 right-2 z-10 sm:top-3 sm:right-3"
    >
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-(--text) bg-(--bg) transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:h-8 sm:w-8"
        title={language === "ka" ? "მენიუ" : "Menu"}
      >
        <HiOutlineMenu className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-1 w-max overflow-hidden rounded border border-(--text) bg-(--bg) shadow-lg">
          <button
            onClick={handleExportJpg}
            className="flex w-full items-center gap-3 px-4 py-1.5 text-xs transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:text-sm"
          >
            <BsFileEarmarkImage className="h-5 w-5 text-amber-500" />
            <span>
              {language === "ka" ? "JPG ჩამოტვირთვა" : "Download JPG"}
            </span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex w-full items-center gap-3 px-4 py-1.5 text-xs transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:text-sm"
          >
            <BsFileEarmarkExcel className="h-5 w-5 text-emerald-600" />
            <span>
              {language === "ka" ? "Excel ჩამოტვირთვა" : "Download Excel"}
            </span>
          </button>
          <button
            onClick={handleExportPdf}
            className="flex w-full items-center gap-3 px-4 py-1.5 text-xs transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:text-sm"
          >
            <BsFileEarmarkPdf className="h-5 w-5 text-red-600" />
            <span>
              {language === "ka" ? "PDF ჩამოტვირთვა" : "Download PDF"}
            </span>
          </button>
          <div className="border-t border-(--text)"></div>
          <button
            onClick={handlePrint}
            className="flex w-full items-center gap-3 px-4 py-1.5 text-xs transition-colors duration-150 hover:bg-(--primary) hover:text-(--bg) sm:text-sm"
          >
            <BsPrinter className="h-5 w-5 text-sky-600" />
            <span>{language === "ka" ? "ბეჭდვა" : "Print"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
