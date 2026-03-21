import { useEffect, useState } from "react";

function GeorgiaMiniMap({ selected = false }) {
  const [paths, setPaths] = useState([]);
  const [viewBox, setViewBox] = useState("0 0 100 100");

  useEffect(() => {
    fetch("/data/georgia-regions.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        const ringToPath = (ring) =>
          ring
            .map((coord, i) => {
              const x = coord[0];
              const y = -coord[1]; // invert Y for SVG
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              return `${i === 0 ? "M" : "L"}${x},${y}`;
            })
            .join(" ") + " Z";

        const svgPaths = geojson.features.map((feature) => {
          const { type, coordinates } = feature.geometry;
          const polygons = type === "MultiPolygon" ? coordinates : [coordinates];
          return polygons.map((rings) => rings.map(ringToPath).join(" ")).join(" ");
        });

        const padding = 0.1;
        const vbX = minX - padding;
        const vbY = minY - padding;
        const vbW = maxX - minX + padding * 2;
        const vbH = maxY - minY + padding * 2;

        setViewBox(`${vbX} ${vbY} ${vbW} ${vbH}`);
        setPaths(svgPaths);
      })
      .catch(() => {});
  }, []);

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill={selected ? "#3b82f6" : "#87cefa"} stroke="none" />
      ))}
    </svg>
  );
}

export default GeorgiaMiniMap;
