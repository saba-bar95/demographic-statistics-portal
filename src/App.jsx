import { useState, useEffect } from "react";
import Header from "./components/Header";
import InfoModal from "./components/InfoModal";
import useChartData from "./hooks/useChartData";
import useAvailableYears from "./hooks/useAvailableYears";
import useTheme from "./hooks/useTheme";
import GeorgiaRegionMap from "./components/GeorgiaRegionMap";
import { regionNameTranslations } from "./constants/regionNames";
import PopulationPyramid from "./components/PopulationPyramid";
import PopulationCircles from "./components/PopulationCircles";
import MedianAge from "./components/MedianAge";
import DemographicIndicators from "./components/DemographicIndicators";
import { useParams, Link } from "react-router-dom";
import wedEn from "./assets/images/wed_en.jpg";
import wedKa from "./assets/images/wed_ka.jpg";
import BannerSection from "./components/BannerSection";
import BannerModal from "./components/BannerModal";
import useSummaryData from "./hooks/useSummaryData";
import AgeRangeSlider from "./components/AgeRangeSlider";
import AgeGroupDetails from "./components/AgeGroupDetails";

const REGION_YEARS = [1989, 2002, 2014];

function App() {
  const { language } = useParams();

  useEffect(() => {
    document.title = language === "ka" ? "დემოგრაფიული პორტალი" : "Demographic Portal";
  }, [language]);

  const { theme, toggle: toggleTheme } = useTheme();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({
    id: null,
    name: null,
  });
  const [selectedYear, setSelectedYear] = useState(null);
  const { years: allYears } = useAvailableYears();

  // Use region-specific years when a region is selected
  const years = selectedRegion.id ? REGION_YEARS : allYears;
  const effectiveYear = selectedYear ?? years?.[years.length - 1] ?? null;

  const { chartData, isLoading, error } = useChartData(effectiveYear, selectedRegion.id);
  const { summaryData } = useSummaryData(effectiveYear, selectedRegion.id);

  // Derive translated region name based on current language
  const regionDisplayName = selectedRegion.name
    ? language === "ka"
      ? regionNameTranslations[selectedRegion.name] || selectedRegion.name
      : selectedRegion.name
    : language === "ka"
      ? "საქართველო"
      : "Georgia";

  // Age range slider state
  const [showAgeSlider, setShowAgeSlider] = useState(false);
  const ageGroups = chartData ? chartData.map((d) => d.age) : [];
  const [ageRange, setAgeRange] = useState({ low: 4, high: 13 });
  // Keep high in sync when chartData loads
  const ageRangeHigh =
    ageGroups.length > 0
      ? Math.min(ageRange.high || ageGroups.length - 1, ageGroups.length - 1)
      : 0;
  const ageRangeValue = { low: ageRange.low, high: ageRangeHigh };

  // Bar colors from age group sex-ratio ranking
  const [barColorMap, setBarColorMap] = useState({});

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
      setLockedYear(effectiveYear);
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
    if (targetYears.length > 0 && !targetYears.includes(effectiveYear)) {
      // Find the closest available year
      const closest = targetYears.reduce((prev, curr) =>
        Math.abs(curr - effectiveYear) < Math.abs(prev - effectiveYear) ? curr : prev,
      );
      setSelectedYear(closest);
    }
  };

  return (
    <>
      <Header
        onInfoClick={() => setIsInfoOpen((prev) => !prev)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="mx-auto max-w-250 2xl:max-w-500">
        <main className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:px-8 xl:px-12 2xl:grid-cols-7 2xl:grid-rows-[240px_200px_1fr]">
          {/* Population Pyramid — full width on sm/md, cols 1-3 all rows on 2xl */}
          <div className="h-full md:col-span-2 md:min-h-100 2xl:col-span-3 2xl:row-span-3 2xl:min-h-197.5 2xl:overflow-hidden">
            {error && <p className="text-sm text-red-500 sm:text-base">{error.message}</p>}
            {chartData && (
              <div className="relative h-full md:min-h-200 2xl:min-h-0">
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-(--bg)/70">
                    <span className="text-sm">Loading...</span>
                  </div>
                )}
                <PopulationPyramid
                  key={`${language}-${theme}`}
                  data={chartData}
                  language={language}
                  years={years}
                  year={effectiveYear}
                  onYearChange={handleYearChange}
                  theme={theme}
                  isLocked={isLocked}
                  lockedData={lockedData}
                  lockedYear={lockedYear}
                  onToggleLock={handleToggleLock}
                  regionName={regionDisplayName}
                  barColorMap={showAgeSlider ? barColorMap : null}
                  sliderOverlay={
                    showAgeSlider && ageGroups.length > 0 ? (
                      <div className="w-12 shrink-0 pb-10">
                        <AgeRangeSlider
                          ageGroups={ageGroups}
                          value={ageRangeValue}
                          onChange={setAgeRange}
                          theme={theme}
                        />
                      </div>
                    ) : null
                  }
                />
              </div>
            )}
            {!chartData && isLoading && <p className="text-sm sm:text-base">Loading data...</p>}
          </div>

          {/* Georgia Region Map — cols 4-5, row 1 */}
          <div className="h-56.25 max-h-45 md:max-h-none 2xl:col-span-2 2xl:h-full 2xl:overflow-hidden">
            <GeorgiaRegionMap
              onRegionSelect={handleRegionSelect}
              selectedRegionId={selectedRegion.id}
            />
          </div>

          {/* Population Circles — cols 6-7, row 1 */}
          <div
            className="flex h-56.25 max-h-45 items-center justify-center rounded-lg bg-(--bg) md:max-h-none 2xl:col-span-2 2xl:h-full"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <PopulationCircles
              data={summaryData}
              language={language}
              year={effectiveYear}
              regionName={regionDisplayName}
            />
          </div>

          {/* Age slider toggle + details — cols 4-5, row 2 */}
          <div
            className="flex h-56.25 max-h-45 flex-col items-center justify-center overflow-auto rounded-lg bg-(--bg) md:max-h-none 2xl:col-span-2 2xl:h-full"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <AgeGroupDetails
              chartData={chartData}
              ageRange={ageRangeValue}
              year={effectiveYear}
              language={language}
              showAgeSlider={showAgeSlider}
              onToggleSlider={() => setShowAgeSlider((v) => !v)}
              onBarColors={setBarColorMap}
              regionCode={selectedRegion.id}
            />
          </div>

          {/* Median Age — cols 6-7, row 2 */}
          <div
            className="h-56.25 max-h-45 rounded-lg bg-(--bg) md:max-h-none 2xl:col-span-2 2xl:h-full"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <MedianAge data={summaryData} language={language} isRegion={!!selectedRegion.id} />
          </div>

          {/* Demographic Indicators — cols 4-5, row 3 */}
          <div
            className="h-56.25 max-h-45 rounded-lg bg-(--bg) md:max-h-none 2xl:col-span-2 2xl:h-full"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <DemographicIndicators
              data={summaryData}
              language={language}
              isRegion={!!selectedRegion.id}
            />
          </div>

          {/* Marriages link — cols 6-7, row 3 */}
          <div
            className="h-56.25 max-h-45 rounded-lg bg-(--bg) p-3 md:max-h-none md:p-4 2xl:col-span-2 2xl:h-full"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <Link
              to={`/${language}/marriages`}
              className="block h-full w-full rounded-lg p-3 md:p-4"
            >
              <img
                src={language === "en" ? wedEn : wedKa}
                alt={language === "en" ? "Marriages" : "ქორწინებები"}
                className="wed-img h-full w-full rounded-lg object-contain"
              />
            </Link>
          </div>
        </main>
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <BannerModal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} />
      <div className="mt-15 mb-15 bg-(--bg) py-4">
        <div className="mx-auto max-w-500 px-4 md:px-8 lg:px-12">
          <BannerSection language={language} onBannerModalOpen={() => setIsBannerModalOpen(true)} />
        </div>
      </div>
    </>
  );
}

export default App;
