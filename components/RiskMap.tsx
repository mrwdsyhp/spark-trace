import {
    Camera,
    GeoJSONSource,
    Layer,
    Map as MapLibreMap,
    type HeatmapLayerSpecification,
    type StyleSpecification,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { fetchHousesGeoJSON, type HousesGeoJSON } from "../utils/apiService";

// CATATAN API: proyek ini memakai @maplibre/maplibre-react-native v11.
// - <ShapeSource>  -> <GeoJSONSource> (prop `shape` menjadi `data`)
// - <HeatmapLayer> -> <Layer type="heatmap"> (prop `style` menjadi `paint`,
//   dengan nama properti kebab-case sesuai MapLibre style spec)

type RiskMapProps = {
  preview?: boolean;
  onPress?: () => void;
};

// Pusat kamera: [longitude, latitude] — urutan GeoJSON, bukan [lat, lng].
const YOGYA_COORD: [number, number] = [110.3695, -7.7956];

// Basemap raster OSM/CARTO — tanpa API key, tanpa style URL eksternal.
const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "osm-raster": {
      type: "raster",
      tiles: ["https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
    },
  },
  layers: [
    {
      id: "osm-raster",
      type: "raster",
      source: "osm-raster",
    },
  ],
};

/**
 * Styling heatmap murni — fluid density blending, tanpa lingkaran kaku.
 *
 * - weight  : kontribusi tiap titik sebanding risk_score (0 -> 0, 100 -> 1)
 * - color   : gradien berdasarkan kepadatan; density 0 wajib transparan
 * - radius  : membesar mengikuti zoom (z10 -> 15px, z15 -> 40px)
 * - opacity : konstan 0.8
 *
 * Data GeoJSON datang langsung dari backend, maka expression memakai
 * property `risk_score` (bukan `riskScore`).
 */
const HEATMAP_PAINT: NonNullable<HeatmapLayerSpecification["paint"]> = {
  "heatmap-weight": ["interpolate", ["linear"], ["get", "risk_score"], 0, 0, 100, 1],
  "heatmap-color": [
    "interpolate",
    ["linear"],
    ["heatmap-density"],
    0,
    "rgba(0,0,0,0)", // transparan di density 0
    0.2,
    "#00FF00", // hijau — aman
    0.6,
    "#FFFF00", // kuning — sedang
    1,
    "#FF0000", // merah — bahaya
  ],
  "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 15, 15, 40],
  "heatmap-opacity": 0.8,
};

export default function RiskMap({ preview = false, onPress }: RiskMapProps) {
  // Data dari backend — semua rumah untuk peta spasial
  const [geojson, setGeojson] = useState<HousesGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Fetch all houses for spatial map display
    fetchHousesGeoJSON()
      .then((data) => {
        if (cancelled) return;
        setGeojson(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("❌ Gagal fetch data rumah:", err.message);
        setError("Gagal memuat data peta. Pastikan server backend berjalan.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const mapContent = (
    <View style={preview ? styles.previewWrap : styles.fullWrap}>
      <MapLibreMap
        style={StyleSheet.absoluteFillObject}
        mapStyle={OSM_STYLE}
        dragPan={!preview}
        touchZoom={!preview}
        doubleTapZoom={!preview}
        doubleTapHoldZoom={!preview}
        touchRotate={!preview}
        touchPitch={!preview}
        attribution={!preview}
        logo={false}
        compass={false}
      >
        <Camera initialViewState={{ center: YOGYA_COORD, zoom: preview ? 12 : 13 }} />

        {geojson && (
          <GeoJSONSource id="heatmap-source" data={geojson}>
            <Layer id="heatmap-layer" type="heatmap" paint={HEATMAP_PAINT} />
          </GeoJSONSource>
        )}
      </MapLibreMap>

      {loading && (
        <View style={styles.statusOverlay}>
          <ActivityIndicator size="small" color={COLORS.primaryBlue} />
        </View>
      )}

      {error && (
        <View style={styles.statusOverlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.attribution}>© OpenStreetMap contributors</Text>
    </View>
  );

  if (preview) {
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={0.8}>
        {mapContent}
      </TouchableOpacity>
    );
  }

  return mapContent;
}

const styles = StyleSheet.create({
  previewWrap: {
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#DCE3EE",
  },
  fullWrap: {
    flex: 1,
    backgroundColor: "#DCE3EE",
  },
  statusOverlay: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    maxWidth: "80%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.kritis,
    textAlign: "center",
  },
  attribution: {
    position: "absolute",
    bottom: 2,
    right: 4,
    fontSize: 8,
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 3,
  },
});