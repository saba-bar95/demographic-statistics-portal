import { LuBaby } from "react-icons/lu";
import { GoArrowSwitch } from "react-icons/go";
import { TbArrowsExchange } from "react-icons/tb";

export default function DemographicIndicators({ data, language, isRegion }) {
  if (!data) return null;

  const { tfr, natinc, migration } = data;

  const items = [
    {
      label:
        language === "ka"
          ? "შობადობის ზოგადი კოეფიციენტი"
          : "Crude Birth Rate",
      value: isRegion ? null : tfr,
      icon: LuBaby,
      color: "text-green-500",
    },
    {
      label: language === "ka" ? "ბუნებრივი მატება" : "Natural Increase",
      value: isRegion ? null : natinc,
      icon: GoArrowSwitch,
      color: "text-orange-500",
      valueColor: !isRegion && natinc != null ? (natinc >= 0 ? "text-green-500" : "text-red-500") : null,
    },
    {
      label: language === "ka" ? "მიგრაციული სალდო" : "Net Migration",
      value: isRegion ? null : migration,
      icon: TbArrowsExchange,
      color: "text-purple-500",
      valueColor: !isRegion && migration != null ? (migration >= 0 ? "text-green-500" : "text-red-500") : null,
    },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4 sm:gap-5 sm:p-5 md:p-6">
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap sm:gap-3">
          <item.icon className={`h-6 w-6 shrink-0 sm:h-7 sm:w-7 md:h-8 md:w-8 ${item.color}`} />
          <span className="text-[10px] font-semibold text-[#0080be] sm:text-xs md:text-sm">
            {item.label}
          </span>
          <span className={`text-[11px] font-bold sm:text-sm md:text-base ${item.valueColor || "text-(--text)"}`}>
            {item.value != null ? item.value.toLocaleString() : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
