import shobadobaImg from "../assets/images/demographicIndicators/shobadoba.png";
import bunebrivivImg from "../assets/images/demographicIndicators/bunebrivi mateba.png";
import migraciaImg from "../assets/images/demographicIndicators/migracia.png";

export default function DemographicIndicators({ data, language, isRegion }) {
  if (!data) return null;

  const { tfr, natinc, migration } = data;

  const items = [
    {
      label: language === "ka" ? "შობადობის ზოგადი კოეფიციენტი" : "Crude Birth Rate",
      value: isRegion ? null : tfr,
      img: shobadobaImg,
    },
    {
      label: language === "ka" ? "ბუნებრივი მატება" : "Natural Increase",
      value: isRegion ? null : natinc,
      img: bunebrivivImg,
      valueColor:
        !isRegion && natinc != null ? (natinc >= 0 ? "text-green-500" : "text-red-500") : null,
    },
    {
      label: language === "ka" ? "მიგრაციული სალდო" : "Net Migration",
      value: isRegion ? null : migration,
      img: migraciaImg,
      valueColor:
        !isRegion && migration != null
          ? migration >= 0
            ? "text-green-500"
            : "text-red-500"
          : null,
    },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4 md:gap-5 md:p-5 lg:p-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-wrap items-center gap-1.5 md:flex-nowrap md:gap-3"
        >
          <img
            src={item.img}
            alt=""
            className="h-6 w-6 shrink-0 object-contain md:h-7 md:w-7 lg:h-8 lg:w-8"
          />
          <span className="text-xs font-medium text-[#0080be] lg:text-sm">{item.label}</span>
          <span
            className={`text-xs font-semibold md:text-sm lg:text-base ${item.valueColor || "text-(--text)"}`}
          >
            {item.value != null ? item.value.toLocaleString() : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
