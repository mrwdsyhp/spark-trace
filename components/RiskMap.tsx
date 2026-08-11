import {
    Camera,
    GeoJSONSource,
    Layer,
    Map as MapLibreMap,
    type HeatmapLayerSpecification,
    type StyleSpecification,
} from "@maplibre/maplibre-react-native";
import type { Feature, FeatureCollection } from "geojson";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// CATATAN API: proyek ini memakai @maplibre/maplibre-react-native v11.
// - <ShapeSource>  -> <GeoJSONSource> (prop `shape` menjadi `data`)
// - <HeatmapLayer> -> <Layer type="heatmap"> (prop `style` menjadi `paint`,
//   dengan nama properti kebab-case sesuai MapLibre style spec)

type RiskHouse = {
  id: string;
  latitude: number;
  longitude: number;
  /** Skor risiko 0-100 dari AI Engine. */
  riskScore: number;
};

type RiskMapProps = {
  preview?: boolean;
  onPress?: () => void;
  /** Opsional: timpa data mock dengan data rumah dari backend. */
  houses?: RiskHouse[];
};

// Pusat kamera: [longitude, latitude] — urutan GeoJSON, bukan [lat, lng].
const YOGYA_COORD: [number, number] = [110.3695, -7.7956];

/**
 * Titik data mock di area Yogyakarta supaya file ini bisa langsung
 * di-test-run tanpa backend. Skor dibuat bervariasi agar gradien
 * heatmap (hijau -> kuning -> merah) terlihat jelas.
 */
const MOCK_HOUSES: RiskHouse[] = [
  { id: "h-01", latitude: -7.788, longitude: 110.3636, riskScore: 92 }, // Tugu
  { id: "h-02", latitude: -7.7928, longitude: 110.366, riskScore: 78 }, // Malioboro
  { id: "h-03", latitude: -7.79, longitude: 110.375, riskScore: 55 }, // Kotabaru
  { id: "h-04", latitude: -7.805, longitude: 110.364, riskScore: 34 }, // Alun-Alun Kidul
  { id: "h-05", latitude: -7.813, longitude: 110.38, riskScore: 15 }, // Umbulharjo
];

/**
 * Konversi array rumah menjadi GeoJSON FeatureCollection bertipe Point.
 * PENTING: koordinat GeoJSON selalu [longitude, latitude].
 */
function housesToGeoJSON(houses: RiskHouse[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: houses.map(
      (h): Feature => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [h.longitude, h.latitude],
        },
        properties: {
          id: h.id,
          riskScore: h.riskScore,
        },
      }),
    ),
  };
}

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
 * - weight  : kontribusi tiap titik sebanding riskScore (0 -> 0, 100 -> 1)
 * - color   : gradien berdasarkan kepadatan; density 0 wajib transparan
 * - radius  : membesar mengikuti zoom (z10 -> 15px, z15 -> 40px)
 * - opacity : konstan 0.8
 */
const HEATMAP_PAINT: NonNullable<HeatmapLayerSpecification["paint"]> = {
  "heatmap-weight": ["interpolate", ["linear"], ["get", "riskScore"], 0, 0, 100, 1],
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

export default function RiskMap({ preview = false, onPress, houses = MOCK_HOUSES }: RiskMapProps) {
  const geoJsonData = useMemo(() => housesToGeoJSON(houses), [houses]);

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

        <GeoJSONSource id="heatmap-source" data={geoJsonData}>
          <Layer id="heatmap-layer" type="heatmap" paint={HEATMAP_PAINT} />
        </GeoJSONSource>
      </MapLibreMap>
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
