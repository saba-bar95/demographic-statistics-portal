import { useState, useEffect } from "react";
import Header from "./components/Header";
import InfoModal from "./components/InfoModal";
import useChartData from "./hooks/useChartData";
import useAvailableYears from "./hooks/useAvailableYears";
import useTheme from "./hooks/useTheme";
import GeorgiaRegionMap from "./components/GeorgiaRegionMap";
import { regionNameTranslations } from "./constants/regionNames";
import PopulationPyramid from "./components/PopulationPyramid";
import { useParams } from "react-router-dom";
import BannerSection from "./components/BannerSection";
import BannerModal from "./components/BannerModal";

function App() {
  const { language } = useParams();

  useEffect(() => {
    document.title =
      language === "ka" ? "დემოგრაფიული პორტალი" : "Demographic Portal";
  }, [language]);

  const { theme, toggle: toggleTheme } = useTheme();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({
    id: null,
    name: null,
  });
  const REGION_YEARS = [1989, 2002, 2014];
  const [selectedYear, setSelectedYear] = useState(2025);
  const { chartData, isLoading, error } = useChartData(
    selectedYear,
    selectedRegion.id,
  );
  const { years: allYears } = useAvailableYears();

  // Use region-specific years when a region is selected
  const years = selectedRegion.id ? REGION_YEARS : allYears;

  // Derive translated region name based on current language
  const regionDisplayName = selectedRegion.name
    ? language === "ka"
      ? regionNameTranslations[selectedRegion.name] || selectedRegion.name
      : selectedRegion.name
    : language === "ka"
      ? "საქართველო"
      : "Georgia";

  // Locked state lifted here to persist across theme/language changes
  const [isLocked, setIsLocked] = useState(false);
  const [lockedData, setLockedData] = useState(null);
  const [lockedYear, setLockedYear] = useState(null);

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
  };

  const handleToggleLock = () => {
    if (!isLocked) {
      setLockedData(chartData);
      setLockedYear(selectedYear);
      setIsLocked(true);
    } else {
      setLockedData(null);
      setLockedYear(null);
      setIsLocked(false);
    }
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    // Clear lock when region changes
    setIsLocked(false);
    setLockedData(null);
    setLockedYear(null);
    // Keep current year if valid for target, otherwise pick closest
    const targetYears = region.id ? REGION_YEARS : allYears;
    if (targetYears.length > 0 && !targetYears.includes(selectedYear)) {
      // Find the closest available year
      const closest = targetYears.reduce((prev, curr) =>
        Math.abs(curr - selectedYear) < Math.abs(prev - selectedYear)
          ? curr
          : prev,
      );
      setSelectedYear(closest);
    }
  };

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 md:p-8 mx-auto max-w-425">
        <Header
          onInfoClick={() => setIsInfoOpen((prev) => !prev)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="space-y-4">
          {error && (
            <p className="text-sm sm:text-base text-red-500">{error.message}</p>
          )}
          {chartData && (
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-(--bg)/70 flex items-center justify-center z-10">
                  <span className="text-sm">Loading...</span>
                </div>
              )}
              <PopulationPyramid
                key={`${language}-${theme}`}
                data={chartData}
                language={language}
                years={years}
                year={selectedYear}
                onYearChange={handleYearChange}
                theme={theme}
                isLocked={isLocked}
                lockedData={lockedData}
                lockedYear={lockedYear}
                onToggleLock={handleToggleLock}
                regionName={regionDisplayName}
              />
            </div>
          )}
          {!chartData && isLoading && (
            <p className="text-sm sm:text-base">Loading data...</p>
          )}
          <GeorgiaRegionMap
            onRegionSelect={handleRegionSelect}
            selectedRegionId={selectedRegion.id}
          />
          <BannerSection
            language={language}
            onBannerModalOpen={() => setIsBannerModalOpen(true)}
          />
        </main>
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <BannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
      />
    </>
  );
}

export default App;
