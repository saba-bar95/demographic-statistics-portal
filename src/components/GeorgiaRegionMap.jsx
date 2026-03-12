import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import smallmap from "../assets/images/smallmap.png";
import { regionNameTranslations } from "../constants/regionNames";

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

function FitToData({ geoJsonData }) {
  const map = useMap();
  useEffect(() => {
    if (!geoJsonData) return;
    const bounds = L.geoJSON(geoJsonData).getBounds();
    if (bounds.isValid()) {
      map.invalidateSize();
      const center = bounds.getCenter();
      // Shift center up in lat so the map renders lower visually
      const adjustedCenter = L.latLng(center.lat + 0.15, center.lng);
      const autoZoom = map.getBoundsZoom(bounds);
      map.setView(adjustedCenter, autoZoom, { animate: false });
    }
  }, [map, geoJsonData]);
  return null;
}

export default function GeorgiaRegionMap({ onRegionSelect, selectedRegionId = null }) {
  const { language } = useParams();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [error, setError] = useState(null);

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
        if (!response.ok) throw new Error(`Failed to load regions (${response.status})`);
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
      return lang === "ka" ? regionNameTranslations[regionNameEn] || regionNameEn : regionNameEn;
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
    return <p className="text-sm text-red-500 sm:text-base">{error.message}</p>;
  }

  return (
    <div
      className="relative h-100 w-full overflow-hidden rounded-lg bg-(--bg) lg:h-full"
      style={{ boxShadow: "var(--shadow)" }}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center px-3 py-2 text-(--text)">
        <p
          className="text-center text-sm font-semibold text-(--text) sm:text-base"
          style={{
            fontFamily: "'FiraGORegular', sans-serif",
            fontFeatureSettings: '"case" on',
          }}
        >
          {mapTitle}
        </p>
        <img
          src={smallmap}
          alt=""
          className="absolute top-10 right-10 cursor-pointer"
          onClick={handleWholeGeorgiaSelect}
        />
      </div>
      {/* Map */}
      <div className="absolute inset-0">
        <MapContainer
          center={[42.3, 43.5]}
          zoom={8}
          zoomSnap={0}
          zoomDelta={0.25}
          className="h-full w-full bg-(--bg)"
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          attributionControl={false}
        >
          {geoJsonData && (
            <>
              <GeoJSON
                key={language}
                data={geoJsonData}
                style={(feature) =>
                  feature?.properties?.shapeISO === selectedRegionId ? selectedStyle : defaultStyle
                }
                onEachFeature={onEachFeature}
              />
              <FitToData geoJsonData={geoJsonData} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
