import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarriagesHeader from "./components/MarriagesHeader";
import MarriageYearSlider from "./components/MarriageYearSlider";
import MarriageDistribution from "./components/MarriageDistribution";
import useMarriagesData from "./hooks/useMarriagesData";

function Marriages() {
  const { language } = useParams();
  const [selectedYear, setSelectedYear] = useState(null);
  const { years } = useMarriagesData(null);
  const effectiveYear = selectedYear ?? years?.[years.length - 1] ?? null;
  const { total, distribution, isLoading } = useMarriagesData(effectiveYear);

  useEffect(() => {
    document.title =
      language === "ka" ? "რეგისტრირებულ ქორწინებათა რაოდენობა" : "Number of Registered Marriages";
  }, [language]);

  return (
    <>
      <MarriagesHeader />
      <div className="mx-auto max-w-375">
        <main className="px-4 pb-8 md:px-8 xl:px-12">
          <MarriageYearSlider
            years={years}
            selectedYear={effectiveYear}
            onYearChange={setSelectedYear}
            total={total}
            isLoading={isLoading}
          />
          <MarriageDistribution data={distribution} language={language} />
        </main>
      </div>
    </>
  );
}

export default Marriages;
