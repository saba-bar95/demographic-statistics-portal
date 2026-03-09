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
      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded border border-(--text) hover:bg-(--primary) hover:text-(--bg) cursor-pointer transition-colors duration-150 bg-(--bg)"
        title={language === "ka" ? "მენიუ" : "Menu"}>
        <HiOutlineMenu className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-1 w-max bg-(--bg) border border-(--text) rounded shadow-lg overflow-hidden">
          <button
            onClick={handleExportJpg}
            className="w-full px-4 py-1.5 flex items-center gap-3 hover:bg-(--primary) hover:text-(--bg) transition-colors duration-150 text-xs sm:text-sm">
            <BsFileEarmarkImage className="w-5 h-5 text-amber-500" />
            <span>
              {language === "ka" ? "JPG ჩამოტვირთვა" : "Download JPG"}
            </span>
          </button>
          <button
            onClick={handleExportExcel}
            className="w-full px-4 py-1.5 flex items-center gap-3 hover:bg-(--primary) hover:text-(--bg) transition-colors duration-150 text-xs sm:text-sm">
            <BsFileEarmarkExcel className="w-5 h-5 text-emerald-600" />
            <span>
              {language === "ka" ? "Excel ჩამოტვირთვა" : "Download Excel"}
            </span>
          </button>
          <button
            onClick={handleExportPdf}
            className="w-full px-4 py-1.5 flex items-center gap-3 hover:bg-(--primary) hover:text-(--bg) transition-colors duration-150 text-xs sm:text-sm">
            <BsFileEarmarkPdf className="w-5 h-5 text-red-600" />
            <span>
              {language === "ka" ? "PDF ჩამოტვირთვა" : "Download PDF"}
            </span>
          </button>
          <div className="border-t border-(--text)"></div>
          <button
            onClick={handlePrint}
            className="w-full px-4 py-1.5 flex items-center gap-3 hover:bg-(--primary) hover:text-(--bg) transition-colors duration-150 text-xs sm:text-sm">
            <BsPrinter className="w-5 h-5 text-sky-600" />
            <span>{language === "ka" ? "ბეჭდვა" : "Print"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
