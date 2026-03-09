import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import georgianFont from "../assets/fonts/NotoSansGeorgian_ExtraCondensed-Bold.ttf";

/**
 * Export chart as JPG image
 * @param {object} exportingRef - amCharts exporting reference
 */
export const exportToJpg = async (exportingRef) => {
  if (exportingRef?.current) {
    await exportingRef.current.download("jpg");
  }
};

/**
 * Export data to Excel (.xlsx)
 * @param {Array} data - Chart data array
 * @param {number} year - Selected year
 * @param {string} language - Language code ('en' or 'ka')
 */
export const exportToExcel = (data, year, language = "en") => {
  if (!data) return;

  const headers = [
    language === "ka" ? "ასაკობრივი ჯგუფი" : "Age Group",
    language === "ka" ? "მამრობითი" : "Male",
    language === "ka" ? "მდედრობითი" : "Female",
  ];

  // Prepare data rows
  const rows = data.map((item) => [item.age, Math.abs(item.male), item.female]);

  // Create worksheet data with headers
  const wsData = [headers, ...rows];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws["!cols"] = [{ wch: 15 }, { wch: 12 }, { wch: 12 }];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, `Population Pyramid ${year}`);

  // Save file
  XLSX.writeFile(wb, `population_pyramid_${year}.xlsx`);
};

/**
 * Export data to PDF file
 * @param {Array} data - Chart data array
 * @param {number} year - Selected year
 * @param {string} language - Language code ('en' or 'ka')
 */
export const exportToPdf = (data, year, language = "en") => {
  if (!data) return;

  const isGeorgian = language === "ka";

  const title = isGeorgian
    ? `მოსახლეობის პირამიდა - ${year}`
    : `Population Pyramid - ${year}`;

  const headers = [
    isGeorgian ? "ასაკობრივი ჯგუფი" : "Age Group",
    isGeorgian ? "მამრობითი" : "Male",
    isGeorgian ? "მდედრობითი" : "Female",
  ];

  const tableData = data.map((item) => [
    item.age,
    Math.abs(item.male).toLocaleString(),
    item.female.toLocaleString(),
  ]);

  const doc = new jsPDF();

  // Add Georgian font if needed
  if (isGeorgian) {
    doc.addFont(georgianFont, "NotoSansGeorgian", "normal");
    doc.setFont("NotoSansGeorgian");
  }

  const fontStyles = {
    font: isGeorgian ? "NotoSansGeorgian" : "helvetica",
    fontSize: 10,
    halign: "center",
  };

  // Add title
  doc.setFontSize(16);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, {
    align: "center",
  });

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 30,
    styles: fontStyles,
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "normal",
    },
  });

  doc.save(`population_pyramid_${year}.pdf`);
};

/**
 * Print chart image
 * @param {object} exportingRef - amCharts exporting reference
 */
export const printChart = async (exportingRef) => {
  if (exportingRef?.current) {
    await exportingRef.current.print();
  }
};
