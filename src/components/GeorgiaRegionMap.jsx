import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import smallmap from "../assets/images/smallmap.png";
import { regionNameTranslations } from "../constants/regionNames";

const GEORGIA_ALL_ID = "GEO_ALL";

const defaultStyle = {
  color: "#ffffff",
  weight: 1.2,
  fillColor: "#87cefa",
  fillOpacity: 0.7,
};

const hoverStyle = {
  color: "#ffffff",
  weight: 1.2,
  fillColor: "#9ca3af",
  fillOpacity: 0.7,
};

const selectedStyle = {
  color: "#ffffff",
  weight: 2,
  fillColor: "#3b82f6",
  fillOpacity: 0.85,
};

function CtrlZoomHandler({ onScrollHint }) {
  const map = useMap();
  useEffect(() => {
    map.scrollWheelZoom.disable();
    const container = map.getContainer();
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        map.zoomIn(delta);
      } else {
        onScrollHint();
      }
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [map, onScrollHint]);
  return null;
}

function FitToData({ geoJsonData }) {
  const map = useMap();
  useEffect(() => {
    if (!geoJsonData) return;
    const bounds = L.geoJSON(geoJsonData).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [10, 10] });
    }
  }, [map, geoJsonData]);
  return null;
}

function ResizeHandler({ geoJsonData }) {
  const map = useMap();
  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
      if (geoJsonData) {
        const bounds = L.geoJSON(geoJsonData).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [10, 10] });
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map, geoJsonData]);
  return null;
}

export default function GeorgiaRegionMap({
  onRegionSelect,
  selectedRegionId = null,
}) {
  const { language } = useParams();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollHintTimer = useRef(null);

  const handleScrollHint = useRef(() => {
    setShowScrollHint(true);
    if (scrollHintTimer.current) clearTimeout(scrollHintTimer.current);
    scrollHintTimer.current = setTimeout(() => setShowScrollHint(false), 1500);
  }).current;

  // Use refs to avoid stale closures in GeoJSON onEachFeature
  const onRegionSelectRef = useRef(onRegionSelect);
  const selectedRegionIdRef = useRef(selectedRegionId);

  useEffect(() => {
    onRegionSelectRef.current = onRegionSelect;
  }, [onRegionSelect]);
  useEffect(() => {
    selectedRegionIdRef.current = selectedRegionId;
  }, [selectedRegionId]);

  // Track layers to update styles when selection changes
  const layersRef = useRef({});

  useEffect(() => {
    // Update all layer styles when selection changes
    Object.entries(layersRef.current).forEach(([code, layer]) => {
      layer.setStyle(code === selectedRegionId ? selectedStyle : defaultStyle);
    });
  }, [selectedRegionId]);

  useEffect(() => {
    let isMounted = true;
    async function loadRegions() {
      try {
        const response = await fetch("/data/georgia-regions.geojson");
        if (!response.ok)
          throw new Error(`Failed to load regions (${response.status})`);
        const payload = await response.json();
        if (isMounted) setGeoJsonData(payload);
      } catch (err) {
        if (isMounted) setError(err);
      }
    }
    loadRegions();
    return () => {
      isMounted = false;
    };
  }, []);

  const onEachFeature = (feature, layer) => {
    const regionCode = feature?.properties?.shapeISO;
    const regionNameEn = feature?.properties?.shapeName;

    // Store layer ref for style updates
    if (regionCode) {
      layersRef.current[regionCode] = layer;
    }

    const getRegionName = () => {
      const lang = language;
      return lang === "ka"
        ? regionNameTranslations[regionNameEn] || regionNameEn
        : regionNameEn;
    };

    layer.bindTooltip(getRegionName() || "Unknown region");
    layer.on({
      mouseover: () => {
        if (selectedRegionIdRef.current !== regionCode) {
          layer.setStyle(hoverStyle);
        }
      },
      mouseout: () => {
        if (selectedRegionIdRef.current === regionCode) {
          layer.setStyle(selectedStyle);
        } else {
          layer.setStyle(defaultStyle);
        }
      },
      click: () => {
        if (selectedRegionIdRef.current === regionCode) {
          // Toggle off — deselect to whole Georgia
          onRegionSelectRef.current({ id: null, name: null });
        } else {
          onRegionSelectRef.current({
            id: regionCode || null,
            name: regionNameEn || null,
          });
        }
      },
    });
  };

  const mapTitle = language === "ka" ? "რეგიონები" : "Regions";

  const handleWholeGeorgiaSelect = () => {
    onRegionSelect({ id: null, name: null });
  };

  if (error) {
    return <p className="text-sm sm:text-base text-red-500">{error.message}</p>;
  }

  return (
    <div className="relative w-full max-w-150 mx-auto h-80 border border-(--text) rounded overflow-hidden bg-(--bg)">
      {/* Header bar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center px-3 py-2 text-(--text)">
        <p
          className="text-sm sm:text-base font-semibold text-center text-(--text)"
          style={{
            fontFamily: "'FiraGORegular', sans-serif",
            fontFeatureSettings: '"case" on',
          }}>
          {mapTitle}
        </p>
        <img
          src={smallmap}
          alt=""
          className="absolute right-10 top-10 cursor-pointer"
          onClick={handleWholeGeorgiaSelect}
        />
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[42.35, 43.2]}
          zoom={7}
          className="w-full h-full bg-(--bg)"
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}>
          {geoJsonData && (
            <>
              <GeoJSON
                key={language}
                data={geoJsonData}
                style={(feature) =>
                  feature?.properties?.shapeISO === selectedRegionId
                    ? selectedStyle
                    : defaultStyle
                }
                onEachFeature={onEachFeature}
              />
              <FitToData geoJsonData={geoJsonData} />
              <ResizeHandler geoJsonData={geoJsonData} />
              <CtrlZoomHandler onScrollHint={handleScrollHint} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Scroll hint overlay */}
      {showScrollHint && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white text-xs sm:text-sm px-4 py-2 rounded-lg shadow-lg">
            {language === "ka"
              ? "გამოიყენეთ Ctrl + scroll მასშტაბის შესაცვლელად"
              : "Use Ctrl + scroll to zoom the map"}
          </div>
        </div>
      )}
    </div>
  );
}
