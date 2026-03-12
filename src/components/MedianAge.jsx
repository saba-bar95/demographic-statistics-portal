import { IoPeople } from "react-icons/io5";
import { CgBoy, CgGirl } from "react-icons/cg";

export default function MedianAge({ data, language, isRegion }) {
  if (!data) return null;

  const { median_total, median_male, median_female, leo_total, leo_male, leo_female } = data;

  const items = [
    {
      label: language === "ka" ? "სულ" : "Total",
      value: median_total,
      icon: IoPeople,
      color: "text-gray-500",
    },
    {
      label: language === "ka" ? "მამაკაცი" : "Male",
      value: median_male,
      icon: CgBoy,
      color: "text-blue-500",
    },
    {
      label: language === "ka" ? "ქალი" : "Female",
      value: median_female,
      icon: CgGirl,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="flex h-full items-center justify-center p-3 sm:p-4 md:p-5">
      <table className="w-full border-separate border-spacing-x-3 border-spacing-y-4 sm:border-spacing-x-5 sm:border-spacing-y-5 md:border-spacing-x-6">
        <thead>
          <tr>
            <td></td>
            {items.map((item) => (
              <td key={item.label} className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <item.icon className={`h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 ${item.color}`} />
                  <span className="text-[11px] font-medium text-(--text) sm:text-xs md:text-sm">
                    {item.label}
                  </span>
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-[10px] font-semibold text-[#0080be] sm:text-xs md:text-sm">
              {language === "ka" ? "მედიანური ასაკი" : "Median Age"}
            </td>
            {items.map((item) => (
              <td key={item.label} className="text-center">
                <span className="text-xs font-bold text-(--text) sm:text-sm md:text-base">
                  {item.value ?? "—"}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="text-[10px] font-semibold text-[#0080be] sm:text-xs md:text-sm">
              {language === "ka" ? "სიცოცხლის ხანგრძლივობა" : "Life Expectancy"}
            </td>
            {(isRegion
              ? [{ label: "Total" }, { label: "Male" }, { label: "Female" }]
              : [
                  { label: "Total", value: leo_total },
                  { label: "Male", value: leo_male },
                  { label: "Female", value: leo_female },
                ]
            ).map((item) => (
              <td key={item.label} className="text-center">
                <span className="text-xs font-bold text-(--text) sm:text-sm md:text-base">
                  {item.value ?? "—"}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
