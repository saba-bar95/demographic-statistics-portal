import banner1_ka from "../assets/images/banner1_ka.jpg";
import banner1_en from "../assets/images/banner1_en.jpg";
import banner2_ka from "../assets/images/banner2_ka.jpg";
import banner2_en from "../assets/images/banner2_en.jpg";
import banner3_ka from "../assets/images/banner3_ka.jpg";
import banner3_en from "../assets/images/banner3_en.jpg";
import banner4_ka from "../assets/images/banner4_ka.jpg";
import banner4_en from "../assets/images/banner4_en.jpg";
import "./BannerSection.css";

const banners = [
  {
    ka: banner1_ka,
    en: banner1_en,
    link: {
      ka: "https://www.geostat.ge/ka/modules/categories/316/mosakhleoba-da-demografia",
      en: "https://www.geostat.ge/en/modules/categories/316/population-and-demography",
    },
  },
  {
    ka: banner2_ka,
    en: banner2_en,
    link: {
      ka: "https://www.geostat.ge/ka/modules/categories/737/mosakhleobis-2014-tslis-saqoveltao-aghtseris-shedegebi",
      en: "https://www.geostat.ge/en/modules/categories/737/2014-general-population-census-results",
    },
  },
  {
    ka: banner4_ka,
    en: banner4_en,
    link: {
      ka: "https://pc-axis.geostat.ge/PXWeb/pxweb/ka/Database/Database__Demography",
      en: "https://pc-axis.geostat.ge/PXWeb/pxweb/en/Database/Database__Demography",
    },
  },
  {
    ka: banner3_ka,
    en: banner3_en,
    modal: true,
  },
];

export default function BannerSection({ language, onBannerModalOpen }) {
  return (
    <div className="flex flex-wrap gap-4">
      {banners.map((banner, index) => {
        const img = (
          <img
            src={language === "ka" ? banner.ka : banner.en}
            alt={`Banner ${index + 1}`}
            className="w-full h-auto rounded-lg object-cover"
          />
        );

        if (banner.modal) {
          return (
            <button
              key={index}
              onClick={onBannerModalOpen}
              className="banner-item w-full sm:flex-1 sm:min-w-[calc(50%-0.5rem)] lg:min-w-0 cursor-pointer">
              {img}
            </button>
          );
        }

        return (
          <a
            key={index}
            href={banner.link[language] || banner.link.en}
            target="_blank"
            rel="noopener noreferrer"
            className="banner-item w-full sm:flex-1 sm:min-w-[calc(50%-0.5rem)] lg:min-w-0">
            {img}
          </a>
        );
      })}
    </div>
  );
}
