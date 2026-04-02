import { IoPeople } from "react-icons/io5";
import maleImg from "../assets/images/medianAge/male.png";
import femaleImg from "../assets/images/medianAge/female.png";

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
      img: maleImg,
    },
    {
      label: language === "ka" ? "ქალი" : "Female",
      value: median_female,
      img: femaleImg,
    },
  ];

  return (
    <div className="flex h-full items-center justify-center p-3 md:p-4 lg:p-5">
      <table className="w-full border-separate border-spacing-x-3 border-spacing-y-4 md:border-spacing-x-5 md:border-spacing-y-5 lg:border-spacing-x-6">
        <thead>
          <tr>
            <td></td>
            {items.map((item) => (
              <td key={item.label} className="text-center">
                <div className="flex flex-col items-center gap-1">
                  {item.img ? (
                    <img src={item.img} alt={item.label} className="h-7 w-7 object-contain md:h-9 md:w-9 lg:h-10 lg:w-10" />
                  ) : (
                    <item.icon className={`h-7 w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 ${item.color}`} />
                  )}
                  <span className="text-xs font-medium text-(--text) lg:text-sm">
                    {item.label}
                  </span>
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-xs font-medium text-[#0080be] lg:text-sm">
              {language === "ka" ? "მედიანური ასაკი" : "Median Age"}
            </td>
            {items.map((item) => (
              <td key={item.label} className="text-center">
                <span className="text-xs font-semibold text-(--text) md:text-sm lg:text-base">
                  {item.value ?? "—"}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="text-xs font-medium text-[#0080be] lg:text-sm">
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
                <span className="text-xs font-semibold text-(--text) md:text-sm lg:text-base">
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
